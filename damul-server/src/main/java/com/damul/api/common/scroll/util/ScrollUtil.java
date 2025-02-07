package com.damul.api.common.scroll.util;

import com.damul.api.common.scroll.dto.request.ScrollRequest;
import com.damul.api.common.scroll.dto.response.CursorPageMetaInfo;
import com.damul.api.common.scroll.dto.response.ScrollResponse;

import java.util.List;

public class ScrollUtil {
    public static <T extends ScrollCursor> ScrollResponse<T> createScrollResponse(List<T> items, ScrollRequest request) {
        boolean hasNext = items.size() == request.getSize();
        int nextCursor = hasNext && !items.isEmpty()
                ? items.get(items.size() - 1).getId()  // 일반적인 엔티티의 경우
                : request.getCursorId();

        return new ScrollResponse<>(items, new CursorPageMetaInfo(nextCursor, hasNext));
    }
}
