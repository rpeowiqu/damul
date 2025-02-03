package com.damul.api.chat.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatTypingMessage {

    private int userId;
    private String nickname;
    private boolean isTyping;

}
