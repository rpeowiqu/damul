package com.damul.api.recipe.service;

import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.recipe.dto.request.RecipeRequest;
import com.damul.api.recipe.dto.response.RecipeDetail;
import com.damul.api.recipe.dto.response.RecipeList;
import com.damul.api.recipe.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.xml.stream.events.Comment;
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

    @Override
    public RecipeDetail getRecipeDetail(int recipeId) {
        return null;
    }

    @Override
    public void addRecipe(RecipeRequest recipeRequest, MultipartFile mainImage, List<MultipartFile> cookingImages) {

    }

    @Override
    public void updateRecipe(RecipeRequest recipeRequest, MultipartFile mainImage, List<MultipartFile> cookingImages) {

    }

    @Override
    public void deleteRecipe(int recipeId) {

    }

    @Override
    public void toggleRecipeLike(int recipeId) {

    }

    @Override
    public void addRecipeComment(int recipeId, Comment comment) {

    }

    @Override
    public void toggleRecipeBookmark(int recipeId) {

    }
}
