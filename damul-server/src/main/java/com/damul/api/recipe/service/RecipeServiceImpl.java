package com.damul.api.recipe.service;

import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.common.scroll.dto.request.ScrollRequest;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.common.scroll.util.ScrollUtil;
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

    // 레시피 전체 조회 및 검색
    @Override
    public ScrollResponse getRecipes(ScrollRequest scrollRequest, String searchType, String keyword, String orderByDir, String orderBy) {

        // 검색어가 있는데 검색 타입이 없는 경우 예외 처리
        if (keyword != null && searchType == null) {
            log.error("검색어는 존재, 검색타입 없음");
            throw new BusinessException(ErrorCode.SEARCHTYPE_NOT_FOUND);
        }

        List<RecipeList> recipes;

        // 1. 기본 전체 조회
        if(checkSearch(searchType, keyword) && !checkOrderBy(orderByDir, orderBy)) {
            recipes = recipeRepository.findAllRecipes(
                    scrollRequest.getCursorId(),
                    scrollRequest.getSize() + 1
            );
        }

        // 2. 검색어만 있는 경우
        else if(checkSearch(searchType, keyword) && (orderByDir != null && orderBy == null)) {
            recipes = recipeRepository.findBySearch(
                    scrollRequest.getCursorId(),
                    scrollRequest.getSize() + 1,
                    searchType,
                    keyword
            );
        }

        // 3. 정렬 조건만 있는 경우
        else if(!checkSearch(searchType, keyword)&& checkOrderBy(orderByDir, orderBy)) {
            recipes = recipeRepository.findAllWithOrder(
                    scrollRequest.getCursorId(),
                    scrollRequest.getSize() + 1,
                    orderBy,
                    orderByDir
            );
        }

        // 4. 검색어와 정렬 조건이 모두 있는 경우
        else {
            recipes = recipeRepository.findBySearchWithOrder(
                    scrollRequest.getCursorId(),
                    scrollRequest.getSize() + 1,
                    searchType,
                    keyword,
                    orderBy,
                    orderByDir
            );
        }

        if (recipes.size() > scrollRequest.getSize()) {
            recipes = recipes.subList(0, scrollRequest.getSize());
        }

        return ScrollUtil.createScrollResponse(recipes, scrollRequest);
    }

    @Override
    public RecipeDetail getRecipeDetail(int recipeId) {
        return null;
    }

    @Override
    public RecipeDetail getRecipeDetail(ScrollRequest scrollRequest,
                                        String searchType,
                                        String keyword,
                                        String orderByDir,
                                        String orderBy) {




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


    private boolean checkSearch(String searchType, String keyword) {
        return searchType != null && keyword != null;
    }

    private boolean checkOrderBy(String orderByDir, String orderBy) {
        return orderByDir != null && orderBy != null;
    }
}
