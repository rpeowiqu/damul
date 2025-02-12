package com.damul.api.ingredient.service;

import com.damul.api.ingredient.dto.response.IngredientPriceResponse;

public interface IngredientPriceService {

    IngredientPriceResponse getIngredientPrice(String period, String productNo);
}
