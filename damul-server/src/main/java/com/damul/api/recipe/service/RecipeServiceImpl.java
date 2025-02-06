package com.damul.api.recipe.service;

import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.recipe.dto.response.RecipeList;
import com.damul.api.recipe.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecipeServiceImpl implements RecipeService {

    private final RecipeRepository recipeRepository;

    @Override
    public ScrollResponse<List<RecipeList>> getRecipeList() {

        return null;
    }
}
