package com.damul.api.common.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ScrollRequest {

    private int cursorId = 0;
    private int size = 10;

}
