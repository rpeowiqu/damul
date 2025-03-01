package com.damul.api.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomCreatedEvent {
    private Integer roomId;
    private String roomName;
    private String creatorNickname;

}