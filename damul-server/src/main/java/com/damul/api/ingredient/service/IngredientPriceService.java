package com.damul.api.ingredient.service;

import com.damul.api.ingredient.dto.response.IngredientPriceResponse;
import com.damul.api.ingredient.dto.response.IngredientsCategoryResponse;

public interface IngredientPriceService {

    IngredientPriceResponse getIngredientPrice(String period, String productNo);
    IngredientsCategoryResponse getIngredientsCategory();
}
