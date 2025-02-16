package com.damul.api.chat.service;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.auth.entity.User;
import com.damul.api.chat.dto.MemberRole;
import com.damul.api.chat.dto.MessageType;
import com.damul.api.chat.dto.ReadStatus;
import com.damul.api.chat.dto.TypingStatus;
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
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.common.socket.Base64MultipartFile;
import com.damul.api.config.service.S3Service;
import com.damul.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.List;

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

    @Override
    @Transactional
    public void handleMessage(int roomId, ChatMessageCreate messageRequest) {
        ChatRoom room = getChatRoom(roomId);
        User user = userRepository.findById(messageRequest.getUserId()).get();
        validateRoomAndMember(roomId, user.getId());
        ChatMessage message;

        // 이미지가 포함된 메시지인 경우
        if (messageRequest.getImage() != null && !messageRequest.getImage().isEmpty()) {
            // Base64 디코딩 및 MultipartFile 변환
            String[] parts = messageRequest.getImage().split(",");
            byte[] imageBytes = Base64.getDecoder().decode(parts[1]);

// Content-Type 추출 (Base64 문자열의 헤더에서)
            String contentType = parts[0].split(":")[1].split(";")[0];

            MultipartFile multipartFile = new Base64MultipartFile(
                    imageBytes,
                    "image." + getExtensionFromContentType(contentType),  // 확장자 추출
                    contentType
            );

            String imagePath = s3Service.uploadFile(multipartFile);
            message = ChatMessage.createFileMessage(room, user, messageRequest.getContent(), imagePath);
        }
        // 일반 텍스트 메시지인 경우
        else {
            message = ChatMessage.createMessage(
                    room,
                    user,
                    messageRequest.getContent(),
                    messageRequest.getMessageType() != null ? messageRequest.getMessageType() : MessageType.TEXT
            );
        }

        chatMessageRepository.save(message);
        int unReadCount = chatMessageRepository.countUnreadMessages(roomId, message.getId());
        messagingTemplate.convertAndSend("/sub/chat/room/" + roomId, ChatMessageResponse.from(message, unReadCount));
        updateUnreadCount(message);

    }

    @Override
    @Transactional
    public void handleImageMessage(int roomId, ChatMessageCreate imageRequest) {
        ChatRoom room = getChatRoom(roomId);
        User user = userRepository.findById(imageRequest.getUserId()).get();
        validateRoomAndMember(roomId, user.getId());

        // Base64 디코딩 및 MultipartFile 변환
        String[] parts = imageRequest.getImage().split(",");
        byte[] imageBytes = Base64.getDecoder().decode(parts[1]);
        User currentUser = userRepository.findById(user.getId()).get();

// Content-Type 추출 (Base64 문자열의 헤더에서)
        String contentType = parts[0].split(":")[1].split(";")[0];

        MultipartFile multipartFile = new Base64MultipartFile(
                imageBytes,
                "image." + getExtensionFromContentType(contentType),  // 확장자 추출
                contentType
        );

        String imagePath = s3Service.uploadFile(multipartFile);
        ChatMessage message = ChatMessage.createFileMessage(room, currentUser, imageRequest.getContent(), imagePath);

        chatMessageRepository.save(message);
        int unReadCount = chatMessageRepository.countUnreadMessages(roomId, message.getId());
        messagingTemplate.convertAndSend("/sub/chat/room/" + roomId, ChatMessageResponse.from(message, unReadCount));
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
            chatRoomMemberRepository.save(member);
        }

        ChatMessage enterMessage = ChatMessage.createEnterMessage(room, user);
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

        ChatMessage leaveMessage = ChatMessage.createLeaveMessage(room, user);
        chatMessageRepository.save(leaveMessage);
        int unReadCount = chatMessageRepository.countUnreadMessages(roomId, leaveMessage.getId());
        messagingTemplate.convertAndSend("/sub/chat/room/" + roomId, ChatMessageResponse.from(leaveMessage, unReadCount));
    }

    @Override
    public void handleTyping(ChatTypingMessage typingRequest) {
        ChatRoomMember member = validateRoomAndMember(typingRequest.getRoomId(), typingRequest.getUserId());

        TypingStatus status = new TypingStatus(
                typingRequest.getRoomId(),
                typingRequest.getUserId(),
                member.getNickname(),
                typingRequest.isTyping()
        );

        messagingTemplate.convertAndSend("/sub/chat/room/" + typingRequest.getRoomId() + "/typing", status);
    }

    @Override
    @Transactional
    public void handleMessageRead(ChatReadRequest readRequest) {
        ChatRoomMember member = validateRoomAndMember(readRequest.getRoomId(), readRequest.getUserId());

        member.updateLastReadMessageId(readRequest.getMessageId());
        chatRoomMemberRepository.save(member);

        messagingTemplate.convertAndSend("/sub/chat/room/" + readRequest.getRoomId() + "/read",
                new ReadStatus(readRequest.getRoomId(), readRequest.getUserId(), readRequest.getMessageId()));
    }

    private ChatRoom getChatRoom(int roomId) {
        return chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CHATROOM_NOT_FOUND, "존재하지 않는 채팅방입니다."));
    }

    private void updateUnreadCount(ChatMessage message) {
        List<ChatRoomMember> members = chatRoomMemberRepository.findAllByRoomId(message.getRoom().getId());
        for (ChatRoomMember member : members) {
            if (member.getUser().getId() != message.getSender().getId()) {
                int unreadCount = chatMessageRepository.countUnreadMessages(
                        message.getRoom().getId(),
                        member.getLastReadMessageId()
                );
                messagingTemplate.convertAndSend(
                        "/sub/chat/unread/" + member.getUser().getId(),
                        unreadCount
                );
            }
        }
    }

    private ChatRoomMember validateRoomAndMember(int roomId, int userId) {
        log.info("validateRoomAndMember roomId={}, userId={}", roomId, userId);
        ChatRoom room = getChatRoom(roomId);
        log.info("채팅방 존재: {}", room != null);

        if (room.getStatus() == ChatRoom.Status.INACTIVE) {
            throw new BusinessException(ErrorCode.CHATROOM_INACTIVE, "비활성화된 채팅방입니다.");
        }

        return chatRoomMemberRepository.findByRoomIdAndUserId(roomId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CHATROOM_MEMBER_NOT_FOUND, "채팅방 멤버가 아닙니다."));
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