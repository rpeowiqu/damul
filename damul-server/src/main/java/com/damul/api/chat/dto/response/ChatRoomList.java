package com.damul.api.chat.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomList {

    private int id;
    private String title;
    private String thumbnailUrl;
    private int memberNum;
    private String lastMessage;
    private String lastMessageTime;
    private int unReadNum;

}
