package com.damul.api.common.scroll.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CursorPageMetaInfo {

    private int nextCursor;
    private boolean hasNextData;
}
