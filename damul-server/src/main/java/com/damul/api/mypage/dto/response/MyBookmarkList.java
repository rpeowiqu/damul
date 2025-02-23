package com.damul.api.mypage.dto.response;

import com.damul.api.common.scroll.util.ScrollCursor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MyBookmarkList implements ScrollCursor  {
    @JsonIgnore
    private int bookmarkId;    // ScrollCursor용
    @Getter(onMethod_ = {@JsonProperty("id")})
    private int recipeId;
    private String title;
    private String thumbnailUrl;
    private String content;
    private LocalDateTime createdAt;
    private int userId;
    private String nickname;
    private int viewCnt;
    private int likeCnt;
    private boolean bookmarked;
    private boolean liked;

    @JsonIgnore
    @Override
    public int getId() {
        return this.bookmarkId;
    }
}
