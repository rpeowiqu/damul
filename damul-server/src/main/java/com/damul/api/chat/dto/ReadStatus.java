package com.damul.api.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReadStatus {

    private int roomId;
    private int userId;
    private int messageId;

}
