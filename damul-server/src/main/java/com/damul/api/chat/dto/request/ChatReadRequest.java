package com.damul.api.chat.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatReadRequest {

    private int userId;
    private int roomId;
    private int messageId;

}
