package com.damul.api.common.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ScrollResponse<T> {

    private List<T> data;
    private CursorPageMetaInfo meta;

}
