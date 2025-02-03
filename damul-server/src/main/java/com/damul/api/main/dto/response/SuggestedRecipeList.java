package com.damul.api.main.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SuggestedRecipeList {

    private int recipeId;
    private String title;
    private String thumbnailUrl;
    private List<RecipeTagList> recipeTags;

}
