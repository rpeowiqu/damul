package com.damul.api.chat.service;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.auth.entity.User;
import com.damul.api.chat.dto.MemberRole;
import com.damul.api.chat.dto.response.ChatImageUploadResponse;
import com.damul.api.chat.dto.response.ChatMessageResponse;
import com.damul.api.chat.dto.response.ChatScrollResponse;
import com.damul.api.chat.dto.response.UnReadResponse;
import com.damul.api.chat.entity.ChatMessage;
import com.damul.api.chat.entity.ChatRoom;
import com.damul.api.chat.entity.ChatRoomMember;
import com.damul.api.chat.repository.ChatMessageRepository;
import com.damul.api.chat.repository.ChatRoomMemberRepository;
import com.damul.api.chat.repository.ChatRoomRepository;
import com.damul.api.common.TimeZoneConverter;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.common.scroll.dto.response.CursorPageMetaInfo;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.common.scroll.util.ScrollUtil;
import com.damul.api.config.service.S3Service;
import com.damul.api.post.entity.Post;
import com.damul.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class ChatMessageServiceImpl extends ChatValidation implements ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;
    private final UnreadMessageService unreadMessageService;
    private final SimpMessageSendingOperations messagingTemplate;
    private final S3Service s3Service;
    private final TimeZoneConverter timeZoneConverter;

    @Override
    @Transactional  // ✨ readOnly 제거 (멤버 추가 필요할 수 있으므로)
    public ChatScrollResponse<ChatMessageResponse> getChatMessages(int roomId, int cursor, int size, int userId) {
        log.info("서비스: 채팅 메시지 조회 시작 - roomId: {}, cursor: {}, size: {}, userId: {}", roomId, cursor, size, userId);

        validateRoomId(roomId);
        validateUserId(userId);
        validateMessageParams(cursor, size);

        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CHATROOM_NOT_FOUND, "존재하지 않는 채팅방입니다."));
        int currentMemberCount = chatRoomMemberRepository.countMembersByRoomId(roomId);;

        // ✨ 내가 속한 채팅방인지 검증
        Optional<ChatRoomMember> member = chatRoomMemberRepository.findByRoomIdAndUserId(roomId, userId);

        // ✨ 멤버십 확인 및 신규 멤버 처리 로직 추가
        if (member.isEmpty()) {
            if (chatRoom.getStatus() == ChatRoom.Status.INACTIVE) {
                throw new BusinessException(ErrorCode.CHATROOM_INACTIVE, "비활성화된 채팅방입니다.");
            }

            if (currentMemberCount >= chatRoom.getMemberLimit()) {
                throw new BusinessException(ErrorCode.CHATROOM_FULL, "채팅방 인원이 가득 찼습니다.");
            }

            User user = userRepository.getReferenceById(userId);

            ChatMessage lastMessage = chatMessageRepository
                    .findFirstByRoomIdOrderByCreatedAtDesc(roomId)
                    .orElse(null);

            int lastMessageId = lastMessage != null ? lastMessage.getId() : 0;

            ChatRoomMember newMember = ChatRoomMember.create(
                    chatRoom,
                    user,
                    user.getNickname(), // ✨ 기본 닉네임으로 유저 닉네임 사용
                    MemberRole.MEMBER,
                    lastMessageId
            );

            chatRoomMemberRepository.save(newMember);

            ChatMessage systemMessage = ChatMessage.createSystemMessage(
                    chatRoom,
                    String.format("%s님이 입장하셨습니다.", user.getNickname())
            );
            chatMessageRepository.save(systemMessage);
            log.info("서비스: 새로운 멤버 추가 완료 - roomId: {}, userId: {}", roomId, userId);
        }

        int lastReadMessageId = chatRoomMemberRepository.findLastReadMessageIdByUserIdAndRoomId(userId, roomId);
        List<ChatMessage> messages = fetchMessages(roomId, cursor, size, lastReadMessageId);

        if (messages.isEmpty()) {
            return createEmptyResponse();
        }

        Collections.reverse(messages);
        List<ChatMessageResponse> messageResponses = messages.stream()
                .map(this::convertToChatMessageResponse)
                .collect(Collectors.toList());

        // ✨ 현재 채팅방의 가장 최신 메시지 ID 조회
        ChatMessage latestMessage = chatMessageRepository
                .findFirstByRoomIdOrderByCreatedAtDesc(roomId)
                .orElse(null);

        // 최신 메시지가 있다면 사용자의 lastReadMessageId 업데이트
        if (latestMessage != null) {
            // 이전에 읽지 않은 메시지 수 계산
            int unreadCount = chatMessageRepository.countUnreadMessagesInRoom(
                    roomId,
                    lastReadMessageId,
                    latestMessage.getId()
            );

            // Redis의 안 읽은 메시지 수 감소
            if (unreadCount > 0) {
                unreadMessageService.decrementUnreadCount(userId, unreadCount);

                // 업데이트된 전체 안 읽은 메시지 수 전송
                int totalUnread = unreadMessageService.getUnreadCount(userId);
                messagingTemplate.convertAndSend(
                        "/sub/chat/" + userId + "/count",
                        totalUnread
                );
            }

            chatRoomMemberRepository.updateLastReadMessageId(
                    userId,
                    roomId,
                    latestMessage.getId()
            );
            log.info("서비스: 사용자의 마지막 읽은 메시지 ID 업데이트 - userId: {}, roomId: {}, messageId: {}",
                    userId, roomId, latestMessage.getId());
        }

        Post post = chatRoom.getPost();

        log.info("서비스: 채팅 메시지 조회 성공 - roomId: {}", roomId);
        return createScrollResponse(
                messageResponses,
                cursor,
                size,
                chatRoom.getRoomName(),
                currentMemberCount,
                post == null ? 0 : post.getPostId()
        );
    }

    @Override
    public UnReadResponse getUnreadMessageCount(int userId) {
        log.info("서비스: 전체 안 읽은 메시지 수 조회 시작 - userId: {}", userId);

        validateUserId(userId);

        int unreadCount = chatMessageRepository.countAllUnreadMessages(userId);

        log.info("서비스: 전체 안 읽은 메시지 수 조회 완료 - count: {}", unreadCount);

        return new UnReadResponse(unreadCount);
    }

    @Override
    public ChatImageUploadResponse uploadChatImage(int roomId, String content, MultipartFile image, UserInfo currentUser) {
        log.info("서비스: 채팅 이미지 업로드 시작 - roomId: {}, userId: {}",
                roomId, currentUser.getId());

        // 유효성 검증
        validateRoomId(roomId);
        validateUserId(currentUser.getId());
        validateImage(image);

        // 채팅방 및 사용자 조회
        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CHATROOM_NOT_FOUND, "존재하지 않는 채팅방입니다."));

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "존재하지 않는 사용자입니다."));

        try {
            // S3에 이미지 업로드
            String imagePath = s3Service.uploadFile(image);
            log.info("서비스: S3 이미지 업로드 완료 - path: {}", imagePath);

            // 채팅 메시지 생성 및 저장
            ChatMessage message = createImageMessage(room, user, content, imagePath);
            chatMessageRepository.save(message);

            // 웹소켓으로 메시지 전송
            sendMessageToSubscribers(message);

            // 안 읽은 메시지 수 업데이트
            updateUnreadCount(message);

            return new ChatImageUploadResponse(imagePath);
        } catch (Exception e) {
            log.error("서비스: 채팅 이미지 업로드 실패", e);
            throw new BusinessException(ErrorCode.FILE_UPLOAD_ERROR, "이미지 업로드에 실패했습니다.");
        }
    }

    private ChatMessage createImageMessage(ChatRoom room, User user, String content, String imagePath) {
        ChatMessage message = ChatMessage.createFileMessage(room, user, (content != null) ? content : "", imagePath);
        message.updateCreatedAt(timeZoneConverter.convertUtcToSeoul(LocalDateTime.now()));
        return message;
    }

    private void sendMessageToSubscribers(ChatMessage message) {
        int unReadCount = chatMessageRepository.countUnreadMessages(
                message.getRoom().getId(), message.getId());

        messagingTemplate.convertAndSend(
                "/sub/chat/room/" + message.getRoom().getId(),
                ChatMessageResponse.from(message, unReadCount)
        );
    }

    private void updateUnreadCount(ChatMessage message) {
        // 채팅방의 모든 멤버를 조회하고 발신자를 제외한 모든 멤버의 안 읽은 메시지 수 증가
        chatRoomMemberRepository.findAllByRoomId(message.getRoom().getId()).stream()
                .filter(member -> member.getUser().getId() != message.getSender().getId())
                .forEach(member -> unreadMessageService.incrementUnreadCount(member.getUser().getId()));
    }

    private void validateImage(Object image) {
        if (image == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE, "이미지가 필요합니다.");
        }
    }

    private ChatMessageResponse convertToChatMessageResponse(ChatMessage chatMessage) {
        int unReadCount = calculateUnreadCount(chatMessage);  // 읽지 않은 수를 계산하는 메서드
        return ChatMessageResponse.from(chatMessage, unReadCount);
    }

    private int calculateUnreadCount(ChatMessage chatMessage) {
        return chatRoomMemberRepository.countUnreadMembers(
                chatMessage.getRoom().getId(),
                chatMessage.getId()
        );
    }

    private List<ChatMessage> fetchMessages(int roomId, int cursor, int size, int lastReadMessageId) {
        Pageable pageable = PageRequest.of(0, size + 1);

        if (cursor == 0) { // 초기 로딩
            return chatMessageRepository.findInitialMessages(
                    roomId,
                    lastReadMessageId,
                    pageable
            );
        } else { // 스크롤 시 이전 메시지 로딩
            return chatMessageRepository.findPreviousMessages(
                    roomId,
                    cursor,
                    pageable
            );
        }
    }

    private ChatScrollResponse<ChatMessageResponse> createEmptyResponse() {
        return new ChatScrollResponse<>(
                Collections.emptyList(),
                new CursorPageMetaInfo(0, false),
                null,
                0,
                0
        );
    }

    private ChatScrollResponse<ChatMessageResponse> createScrollResponse(
            List<ChatMessageResponse> messages,
            int cursor,  // 추가
            int size,    // 추가
            String roomName,
            int memberNum,
            Integer postId
    ) {
        // ScrollUtil 사용
        ScrollResponse<ChatMessageResponse> scrollResponse = ScrollUtil.createScrollResponse(messages, cursor, size);

        return new ChatScrollResponse<>(
                scrollResponse.getData(),
                scrollResponse.getMeta(),
                roomName,
                memberNum,
                postId
        );
    }
}
