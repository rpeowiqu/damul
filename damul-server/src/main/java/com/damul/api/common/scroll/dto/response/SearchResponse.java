package com.damul.api.common.scroll.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class SearchResponse<T> extends ScrollResponse<T> {

    private int count;

    public SearchResponse(ScrollResponse<T> result, int count) {
        super(result.getData(), result.getMeta());
        this.count = count;
    }

}
