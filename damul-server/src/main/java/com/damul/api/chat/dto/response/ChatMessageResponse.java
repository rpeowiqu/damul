package com.damul.api.chat.dto.response;

import com.damul.api.chat.dto.MessageType;
import com.damul.api.chat.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageResponse {

    private int id;                // 메시지 ID
    private int roomId;           // 채팅방 ID
    private Integer senderId;         // 발신자 ID
    private String profileImageUrl; // 프로필 이미지
    private String nickname;        // 발신자 닉네임
    private MessageType messageType; // 메시지 타입
    private String content;         // 메시지 내용
    private String fileUrl;         // 파일 URL (있는 경우)
    private LocalDateTime createdAt; // 생성 시간
    private int unReadCount;        // 안 읽은 사용자 수

    public static ChatMessageResponse from(ChatMessage message, int unReadCount) {
        ChatMessageResponse.ChatMessageResponseBuilder builder = ChatMessageResponse.builder()
                .id(message.getId())
                .roomId(message.getRoom().getId())
                .messageType(message.getMessageType())
                .content(message.getContent())
                .fileUrl(message.getFileUrl())
                .createdAt(message.getCreatedAt())
                .unReadCount(unReadCount);

        if (message.getSender() == null) {
            builder.senderId(0)
                    .profileImageUrl(null)
                    .nickname("System");
        } else {
            builder.senderId(message.getSender().getId())
                    .profileImageUrl(message.getSender().getProfileImageUrl())
                    .nickname(message.getSender().getNickname());
        }

        return builder.build();
    }

}
