package com.damul.api.chat.dto.response;

import com.damul.api.chat.dto.MessageType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {

    private int id;                // 메시지 ID
    private int roomId;           // 채팅방 ID
    private int senderId;         // 발신자 ID
    private String profileImageUrl; // 프로필 이미지
    private String nickname;        // 발신자 닉네임
    private MessageType messageType; // 메시지 타입
    private String content;         // 메시지 내용
    private String fileUrl;         // 파일 URL (있는 경우)
    private LocalDateTime createdAt; // 생성 시간
    private int unReadCount;        // 안 읽은 사용자 수

}
