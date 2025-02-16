package com.damul.api.ingredient.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IngredientPriceResponse {
    private String productName;
    private List<PriceData> prices;
}
