package com.damul.api.chat.service;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.auth.entity.User;
import com.damul.api.chat.dto.*;
import com.damul.api.chat.dto.request.ChatMessageCreate;
import com.damul.api.chat.dto.request.ChatReadRequest;
import com.damul.api.chat.dto.request.ChatTypingMessage;
import com.damul.api.chat.dto.response.ChatMessageResponse;
import com.damul.api.chat.entity.ChatMessage;
import com.damul.api.chat.entity.ChatRoom;
import com.damul.api.chat.entity.ChatRoomMember;
import com.damul.api.chat.repository.ChatMessageRepository;
import com.damul.api.chat.repository.ChatRoomMemberRepository;
import com.damul.api.chat.repository.ChatRoomRepository;
import com.damul.api.common.TimeZoneConverter;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.common.socket.Base64MultipartFile;
import com.damul.api.config.service.S3Service;
import com.damul.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebSocketServiceImpl implements WebSocketService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final SimpMessageSendingOperations messagingTemplate;
    private final S3Service s3Service;
    private final UserRepository userRepository;
    private final TimeZoneConverter timeZoneConverter;
    private final UnreadMessageService unreadMessageService;
    private final RedisTemplate<String, ChatMessageRedisDTO> redisTemplate;
    private final RedisTemplate<String, String> stringRedisTemplate;

    private static final String CHAT_MESSAGE_KEY = "chat:messages";

    @Override
    @Transactional
    public void handleMessage(int roomId, ChatMessageCreate messageRequest) {
        ChatRoom room = getChatRoom(roomId);
        User user = userRepository.findById(messageRequest.getUserId()).get();

        ChatMessage message = ChatMessage.createMessage(
                room,
                user,
                messageRequest.getContent(),
                messageRequest.getMessageType() != null ? messageRequest.getMessageType() : MessageType.TEXT
        );
        message.updateCreatedAt(timeZoneConverter.convertUtcToSeoul(LocalDateTime.now()));

        ChatMessageRedisDTO messageDTO = ChatMessageRedisDTO.from(message);
        String roomKey = CHAT_MESSAGE_KEY + roomId;
        redisTemplate.opsForList().rightPush(roomKey, messageDTO);

        int unReadCount = chatRoomMemberRepository.countMembersByRoomId(roomId) - 1;
        messagingTemplate.convertAndSend("/sub/chat/room/" + roomId,
                messageDTO.toResponse(unReadCount));
        updateUnreadCount(message);
    }

    @Override
    @Transactional
    public void handleImageMessage(int roomId, int userId, String content, String imagePath) {
        ChatRoom room = getChatRoom(roomId);
        User user = userRepository.findById(userId).get();

        // 이미지 메시지 생성
        ChatMessage message = ChatMessage.createFileMessage(room, user, content, imagePath);
        message.updateCreatedAt(timeZoneConverter.convertUtcToSeoul(LocalDateTime.now()));

        chatMessageRepository.save(message);
        int unReadCount = chatRoomMemberRepository.countMembersByRoomId(roomId) - 1;

        // 웹소켓으로 메시지 전송
        messagingTemplate.convertAndSend("/sub/chat/room/" + roomId,
                ChatMessageResponse.from(message, unReadCount));
        updateUnreadCount(message);
    }

    @Override
    @Transactional
    public void handleEnter(int roomId, int userId) {
        ChatRoom room = getChatRoom(roomId);
        validateRoomAndMember(roomId, userId);
        User user = userRepository.findById(userId).get();

        if (!chatRoomMemberRepository.existsByRoomIdAndUserId(roomId, userId)) {
            int currentMemberCount = chatRoomMemberRepository.countByRoomId(roomId);
            if (currentMemberCount >= room.getMemberLimit()) {
                throw new IllegalStateException("채팅방 최대 인원을 초과했습니다.");
            }

            String nickname = user.getNickname();
            ChatRoomMember member = ChatRoomMember.create(room, user, nickname, MemberRole.MEMBER, 0);
            member.updateCreatedAt(timeZoneConverter.convertUtcToSeoul(LocalDateTime.now()));
            chatRoomMemberRepository.save(member);
        }

        ChatMessage enterMessage = ChatMessage.createEnterMessage(room, user);
        enterMessage.updateCreatedAt(timeZoneConverter.convertUtcToSeoul(LocalDateTime.now()));
        chatMessageRepository.save(enterMessage);
        int unReadCount = chatMessageRepository.countUnreadMessages(roomId, enterMessage.getId());
        messagingTemplate.convertAndSend("/sub/chat/room/" + roomId, ChatMessageResponse.from(enterMessage, unReadCount));
    }

    @Override
    @Transactional
    public void handleLeave(int roomId, int userId) {
        ChatRoom room = getChatRoom(roomId);
        validateRoomAndMember(roomId, userId);
        User user = userRepository.findById(userId).get();

        ChatRoomMember member = chatRoomMemberRepository.findByRoomIdAndUserId(roomId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CHATROOM_MEMBER_NOT_FOUND, "채팅방 멤버를 찾을 수 없습니다."));

        if (member.getRole() == MemberRole.ADMIN) {
            throw new IllegalStateException("방장은 채팅방을 나갈 수 없습니다.");
        }

        chatRoomMemberRepository.delete(member);

        ChatMessage leaveMessage = ChatMessage.createLeaveMessage(room, user);
        leaveMessage.updateCreatedAt(timeZoneConverter.convertUtcToSeoul(LocalDateTime.now()));
        chatMessageRepository.save(leaveMessage);
        int unReadCount = chatMessageRepository.countUnreadMessages(roomId, leaveMessage.getId());
        messagingTemplate.convertAndSend("/sub/chat/room/" + roomId, ChatMessageResponse.from(leaveMessage, unReadCount));
    }

    @Override
    public void handleTyping(ChatTypingMessage typingRequest) {
        ChatRoomMember member = chatRoomMemberRepository.findByRoomIdAndUserId(typingRequest.getRoomId(), typingRequest.getUserId()).get();

        TypingStatus status = new TypingStatus(
                typingRequest.getRoomId(),
                typingRequest.getUserId(),
                member.getNickname(),
                typingRequest.isTyping()
        );

        messagingTemplate.convertAndSend("/sub/chat/room/" + typingRequest.getRoomId(), status);
    }

    @Override
    @Transactional
    public void handleMessageRead(ChatReadRequest readRequest) {
        ChatRoomMember member = chatRoomMemberRepository.findByRoomIdAndUserId(readRequest.getRoomId(), readRequest.getUserId()).get();
        int lastReadMessageId = chatRoomMemberRepository.findLastReadMessageIdByUserIdAndRoomId(readRequest.getUserId(), readRequest.getRoomId());

        member.updateLastReadMessageId(lastReadMessageId);
        chatRoomMemberRepository.save(member);
    }

    @Scheduled(fixedRate = 300000)
    @Transactional
    public void saveMessagesFromRedis() {
        String lockKey = "chat:sync:lock";
        Boolean acquired = stringRedisTemplate.opsForValue().setIfAbsent(lockKey, "locked", 4, TimeUnit.MINUTES);

        if (acquired != null && acquired) {
            try {
                // 한 번에 처리할 양을 제한
                int batchSize = 1000;
                List<ChatMessage> messages = new ArrayList<>();

                List<ChatMessageRedisDTO> messageDTOs = redisTemplate.opsForList()
                        .range(CHAT_MESSAGE_KEY, 0, batchSize - 1);

                if (messageDTOs != null && !messageDTOs.isEmpty()) {
                    for (ChatMessageRedisDTO messageDTO : messageDTOs) {
                        ChatRoom room = getChatRoom(messageDTO.getRoomId());
                        User sender = messageDTO.getSenderId() != null ?
                                userRepository.getReferenceById(messageDTO.getSenderId()) : null;

                        messages.add(messageDTO.toEntity(room, sender));
                    }

                    // DB 저장
                    chatMessageRepository.saveAll(messages);

                    // 저장된 만큼만 Redis에서 제거
                    redisTemplate.opsForList().trim(CHAT_MESSAGE_KEY, messageDTOs.size(), -1);
                }
            } finally {
                redisTemplate.delete(lockKey);
            }
        }
    }

    private ChatRoom getChatRoom(int roomId) {
        return chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CHATROOM_NOT_FOUND, "존재하지 않는 채팅방입니다."));
    }

    private void updateUnreadCount(ChatMessage message) {
        List<ChatRoomMember> members = chatRoomMemberRepository.findAllByRoomId(message.getRoom().getId());
        for (ChatRoomMember member : members) {
            if (!member.getUser().getId().equals(message.getSender().getId())) {
                // Redis에 안 읽은 메시지 수 증가
                unreadMessageService.incrementUnreadCount(member.getUser().getId());

                // 웹소켓으로 업데이트된 카운트 전송
                int unreadCount = unreadMessageService.getUnreadCount(member.getUser().getId());
                messagingTemplate.convertAndSend(
                        "/sub/chat/" + member.getUser().getId() + "/count",
                        unreadCount
                );
            }
        }
    }

    private void validateRoomAndMember(int roomId, int userId) {
        log.info("validateRoomAndMember roomId={}, userId={}", roomId, userId);
        ChatRoom room = getChatRoom(roomId);
        log.info("채팅방 존재: {}", room != null);

        if (room.getStatus() == ChatRoom.Status.INACTIVE) {
            throw new BusinessException(ErrorCode.CHATROOM_INACTIVE, "비활성화된 채팅방입니다.");
        }

        if(!chatRoomMemberRepository.findByRoomIdAndUserId(roomId, userId)
                .isEmpty()) throw new BusinessException(ErrorCode.CHATROOM_ALREADY_MEMBER, "이미 입장한 채팅방입니다.");
    }

    private String getExtensionFromContentType(String contentType) {
        switch (contentType.toLowerCase()) {
            case "image/png":
                return "png";
            case "image/jpeg":
                return "jpg";
            case "image/gif":
                return "gif";
            default:
                return "png";
        }
    }
}