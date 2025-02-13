package com.damul.api.chat.dto.response;

import com.damul.api.common.scroll.dto.response.CursorPageMetaInfo;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ChatCursorPageMetaInfo extends CursorPageMetaInfo {

    private final LocalDateTime nextCursorTime;

    public ChatCursorPageMetaInfo(LocalDateTime nextCursorTime, int nextCursor, boolean hasNext) {
        super(nextCursor, hasNext);
        this.nextCursorTime = nextCursorTime;
    }

}
