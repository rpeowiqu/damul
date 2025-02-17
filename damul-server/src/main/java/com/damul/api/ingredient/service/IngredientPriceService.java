package com.damul.api.ingredient.service;

import com.damul.api.ingredient.dto.response.IngredientPriceResponse;
import com.damul.api.ingredient.dto.response.IngredientsProductNameResponse;

public interface IngredientPriceService {

    IngredientPriceResponse getIngredientPrice(String period, String itemCode, String kindCode, boolean ecoFlag);
    IngredientsProductNameResponse getIngredientsProductName();
}
