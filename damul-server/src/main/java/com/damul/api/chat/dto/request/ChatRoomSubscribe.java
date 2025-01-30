package com.damul.api.chat.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomSubscribe {

    private int userId;
    private int roomId;
    private int lastReadId;

}
