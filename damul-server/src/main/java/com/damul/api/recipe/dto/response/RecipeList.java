package com.damul.api.recipe.dto.response;

import com.damul.api.common.scroll.util.ScrollCursor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeList implements ScrollCursor {
    private int recipeId;
    private String title;
    private String thumbnailUrl;
    private String content;
    private LocalDateTime createdAt;
    private int authorId;
    private String authorName;

    @Override
    public int getId() {
        return this.recipeId;
    }
}
