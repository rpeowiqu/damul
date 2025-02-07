package com.damul.api.recipe.service;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.common.scroll.dto.request.ScrollRequest;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.recipe.dto.request.RecipeRequest;
import com.damul.api.recipe.dto.response.RecipeDetail;
import com.damul.api.recipe.dto.response.RecipeList;
import org.springframework.web.multipart.MultipartFile;

import javax.xml.stream.events.Comment;
import java.util.List;

public interface RecipeService {

    // 레시피 전체 조회 및 검색
    ScrollResponse<RecipeList> getRecipes(ScrollRequest scrollRequest,
                                                   String searchType,
                                                   String keyword,
                                                   String orderBy);
    

    // 인기 레시피 조회

    // 레시피 상세 조회
    RecipeDetail getRecipeDetail(int recipeId, UserInfo userInfo);

    // 레시피 작성
    void addRecipe(RecipeRequest recipeRequest,
                   MultipartFile thumbnailImage, List<MultipartFile> cookingImages);

    // 레시피 수정
    void updateRecipe(RecipeRequest recipeRequest,
                      MultipartFile thumbnailImage, List<MultipartFile> cookingImages);

    // 레시피 삭제
    void deleteRecipe(int recipeId);

    // 레시피 좋아요
    boolean toggleRecipeLike(int recipeId, UserInfo userInfo);

    // 댓글 작성
    void addRecipeComment(int recipeId, Comment comment);

    // 레시피 북마크 추가/삭제
    boolean toggleRecipeBookmark(int recipeId, UserInfo userInfo);
}
