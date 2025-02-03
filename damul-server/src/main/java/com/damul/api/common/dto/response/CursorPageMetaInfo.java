package com.damul.api.common.dto.response;

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
