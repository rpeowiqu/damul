package com.damul.api.common.scroll.util;

import com.damul.api.common.scroll.dto.request.ScrollRequest;
import com.damul.api.common.scroll.dto.response.CursorPageMetaInfo;
import com.damul.api.common.scroll.dto.response.ScrollResponse;

import java.util.List;

public class ScrollUtil {
    public static <T extends ScrollCursor> ScrollResponse<T> createScrollResponse(List<T> items, int cursorId, int size) {
        if (items.isEmpty()) {
            return new ScrollResponse<>(items, new CursorPageMetaInfo(cursorId, false));
        }

        // items.size()가 size(원래 요청한 크기)보다 크면 다음 페이지 존재
        boolean hasNext = items.size() > size;

        // 실제로 보여줄 아이템들
        List<T> resultItems = hasNext ? items.subList(0, size) : items;

        // 실제 보여줄 아이템들의 마지막 ID를 nextCursor로 사용
        int lastItemId = resultItems.get(resultItems.size() - 1).getId();

        return new ScrollResponse<>(resultItems, new CursorPageMetaInfo(lastItemId, hasNext));
    }
}
