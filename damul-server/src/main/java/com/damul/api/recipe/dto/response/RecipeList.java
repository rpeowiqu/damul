package com.damul.api.recipe.dto.response;

import com.damul.api.common.scroll.util.ScrollCursor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecipeList implements ScrollCursor {
    private int id;
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

    @Override
    public int getId() {
        return this.id;
    }
}

