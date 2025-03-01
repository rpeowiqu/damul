package com.damul.api.recipe.dto.request;

import com.damul.api.recipe.dto.response.CookingOrderList;
import com.damul.api.recipe.dto.response.IngredientList;
import lombok.*;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeRequest {
    private String title;
    private String content;
    private List<IngredientList> ingredients;
    private List<CookingOrderList> cookingOrders;
}
