package com.damul.api.chat.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMember {

    private int id;
    private String nickname;
    private String profileImageUrl;

}
