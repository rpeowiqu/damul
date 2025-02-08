package com.damul.api.recipe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeDetail {
    private int recipeId;
    private String title;
    private boolean bookmarked;
    private boolean liked;
    private String createdAt;
    private int authorId;
    private String authorName;
    private String profileImageUrl;
    private int viewCnt;
    private int likeCnt;
    private String contentImageUrl;
    private List<IngredientList> ingredients;
    private List<CookingOrderList> cookingOrders;
    private List<CommentList> comments;
}
