package com.damul.api.chat.service;

import com.damul.api.auth.entity.User;
import com.damul.api.chat.dto.MessageType;
import com.damul.api.chat.dto.ReadStatus;
import com.damul.api.chat.dto.TypingStatus;
import com.damul.api.chat.dto.request.ChatMessageCreate;
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

    @Override
    @Transactional
    public void handleMessage(int roomId, ChatMessageCreate messageRequest, User sender) {
        ChatRoom room = getChatRoom(roomId);
        validateRoomAndMember(roomId, sender.getId());

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
            message = ChatMessage.createFileMessage(room, sender, messageRequest.getContent(), imagePath);
        }
        // 일반 텍스트 메시지인 경우
        else {
            message = ChatMessage.createMessage(
                    room,
                    sender,
                    messageRequest.getContent(),
                    messageRequest.getMessageType() != null ? messageRequest.getMessageType() : MessageType.TEXT
            );
        }

        chatMessageRepository.save(message);
        messagingTemplate.convertAndSend("/sub/chat/room/" + roomId, message);
        updateUnreadCount(message);

        // 멘션된 사용자들 추출 및 알림 전송
//        List<User> mentionedUsers = extractMentionedUsers(messageRequest.getContent());
//        for (User mentionedUser : mentionedUsers) {
//            sendMentionNotification(message, mentionedUser);
//        }
    }

    @Override
    @Transactional
    public void handleImageMessage(int roomId, ChatMessageCreate imageRequest, User user) {
        ChatRoom room = getChatRoom(roomId);
        validateRoomAndMember(roomId, user.getId());

        // Base64 디코딩 및 MultipartFile 변환
        String[] parts = imageRequest.getImage().split(",");
        byte[] imageBytes = Base64.getDecoder().decode(parts[1]);

// Content-Type 추출 (Base64 문자열의 헤더에서)
        String contentType = parts[0].split(":")[1].split(";")[0];

        MultipartFile multipartFile = new Base64MultipartFile(
                imageBytes,
                "image." + getExtensionFromContentType(contentType),  // 확장자 추출
                contentType
        );

        String imagePath = s3Service.uploadFile(multipartFile);
        ChatMessage message = ChatMessage.createFileMessage(room, user, imageRequest.getContent(), imagePath);

        chatMessageRepository.save(message);
        messagingTemplate.convertAndSend("/sub/chat/room/" + roomId, message);
        updateUnreadCount(message);
    }

    @Override
    @Transactional
    public void handleEnter(int roomId, User user) {
        ChatRoom room = getChatRoom(roomId);
        validateRoomAndMember(roomId, user.getId());

        ChatMessage enterMessage = ChatMessage.createEnterMessage(room, user);
        chatMessageRepository.save(enterMessage);
        messagingTemplate.convertAndSend("/sub/chat/room/" + roomId, enterMessage);
    }

    @Override
    @Transactional
    public void handleLeave(int roomId, User user) {
        ChatRoom room = getChatRoom(roomId);
        validateRoomAndMember(roomId, user.getId());

        ChatMessage leaveMessage = ChatMessage.createLeaveMessage(room, user);
        chatMessageRepository.save(leaveMessage);
        messagingTemplate.convertAndSend("/sub/chat/room/" + roomId, leaveMessage);
    }

    @Override
    public void handleTyping(int roomId, User user, boolean isTyping) {
        ChatRoomMember member = validateRoomAndMember(roomId, user.getId());

        TypingStatus status = new TypingStatus(
                roomId,
                user.getId(),
                member.getNickname(),
                isTyping
        );

        messagingTemplate.convertAndSend("/sub/chat/room/" + roomId + "/typing", status);
    }

    @Override
    @Transactional
    public void handleMessageRead(int roomId, User user, int messageId) {
        ChatRoomMember member = validateRoomAndMember(roomId, user.getId());

        member.updateLastReadMessageId(messageId);
        chatRoomMemberRepository.save(member);

        messagingTemplate.convertAndSend("/sub/chat/room/" + roomId + "/read",
                new ReadStatus(roomId, user.getId(), messageId));
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
        ChatRoom room = getChatRoom(roomId);

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