package com.damul.api.chat.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMembersResponse {

    private List<ChatMember> content;
    private int totalMembers;

}
