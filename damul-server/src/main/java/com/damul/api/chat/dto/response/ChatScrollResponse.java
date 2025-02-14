package com.damul.api.chat.dto.response;

import com.damul.api.common.scroll.dto.response.CursorPageMetaInfo;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class ChatScrollResponse<T> extends ScrollResponse<T> {

    private String roomName;
    private int memberNum;

    public ChatScrollResponse(List<T> data, CursorPageMetaInfo meta, String roomName, int memberNum) {
        super(data, meta);
        this.roomName = roomName;
        this.memberNum = memberNum;
    }

}
