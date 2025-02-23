package com.damul.api.chat.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatReadRequest {

    private Integer userId;
    private Integer roomId;
    private Integer messageId;

}
