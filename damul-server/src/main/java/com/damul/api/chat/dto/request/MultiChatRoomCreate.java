package com.damul.api.chat.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MultiChatRoomCreate {

    private List<ChatRoomEntryExitCreate> users;

}
