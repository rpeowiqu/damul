package com.damul.api.main.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuggestedRecipeList {

    private int recipeId;
    private String title;
    private String thumbnailUrl;
    private List<RecipeTagList> recipeTags;


    // JPQL을 위한 생성자 추가
    public SuggestedRecipeList(int recipeId, String title, String thumbnailUrl) {
        this.recipeId = recipeId;
        this.title = title;
        this.thumbnailUrl = thumbnailUrl;
        this.recipeTags = new ArrayList<>();  // 빈 리스트로 초기화
    }
}
