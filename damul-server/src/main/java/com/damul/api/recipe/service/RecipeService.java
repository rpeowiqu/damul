package com.damul.api.recipe.service;

import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.recipe.dto.response.RecipeList;

import java.util.List;

public interface RecipeService {

    ScrollResponse<List<RecipeList>> getRecipeList();
}
