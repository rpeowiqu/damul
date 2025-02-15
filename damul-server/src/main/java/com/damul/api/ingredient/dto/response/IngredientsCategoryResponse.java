package com.damul.api.ingredient.dto.response;

import com.damul.api.mypage.entity.FoodCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IngredientsCategoryResponse {
    private List<FoodCategory> categories;
}
