package com.damul.api.chat.dto;

import com.damul.api.chat.dto.response.ChatMessageResponse;
import com.damul.api.chat.entity.ChatMessage;
import com.damul.api.chat.entity.ChatRoom;
import com.damul.api.auth.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor  // 이거 추가
@AllArgsConstructor // 이것도 추가
public class ChatMessageRedisDTO {
    private Integer id;
    private Integer roomId;
    private Integer senderId;
    private String senderNickname;
    private String profileImageUrl;
    private MessageType messageType;
    private String content;
    private String fileUrl;
    private LocalDateTime createdAt;

    public static ChatMessageRedisDTO from(ChatMessage message) {
        return ChatMessageRedisDTO.builder()
                .id(null)
                .roomId(message.getRoom().getId())
                .senderId(message.getSender() != null ? message.getSender().getId() : null)
                .senderNickname(message.getSender() != null ? message.getSender().getNickname() : null)
                .profileImageUrl(message.getSender() != null ? message.getSender().getProfileImageUrl() : null)  // 추가
                .messageType(message.getMessageType())
                .content(message.getContent())
                .fileUrl(message.getFileUrl())
                .createdAt(message.getCreatedAt())
                .build();
    }

    public ChatMessageResponse toResponse(int unReadCount) {
        ChatMessageResponse.ChatMessageResponseBuilder builder = ChatMessageResponse.builder()
                .id(id == null ? 0 : id)
                .roomId(roomId)
                .messageType(messageType)
                .content(content)
                .fileUrl(fileUrl)
                .createdAt(createdAt)
                .unReadCount(unReadCount);

        if (senderId == null) {
            builder.senderId(0)
                    .profileImageUrl(null)
                    .nickname("System");
        } else {
            builder.senderId(senderId)
                    .profileImageUrl(profileImageUrl)
                    .nickname(senderNickname);
        }

        return builder.build();
    }

    public ChatMessage toEntity(ChatRoom room, User sender) {
        ChatMessage message;
        if (messageType == MessageType.IMAGE) {
            message = ChatMessage.createFileMessage(room, sender, content, fileUrl);
        } else if (messageType == MessageType.SYSTEM) {
            message = ChatMessage.createSystemMessage(room, content);
        } else {
            message = ChatMessage.createMessage(room, sender, content, messageType);
        }

        if (id != null) {
            // ID 필드에 리플렉션으로 접근해 설정
            try {
                java.lang.reflect.Field idField = ChatMessage.class.getDeclaredField("id");
                idField.setAccessible(true);
                idField.set(message, id);
            } catch (Exception e) {
                throw new RuntimeException("Failed to set message ID", e);
            }
        }

        message.updateCreatedAt(createdAt);
        return message;
    }
}
