package com.damul.api.common.scroll.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SearchResponse<T> {

    private ScrollResponse<T> results;
    private int count;

    public SearchResponse<T> make(ScrollResponse<T> res, int count) {
        return new SearchResponse<>(res, count);
    }

}
