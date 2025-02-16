package com.damul.api.ingredient.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IngredientsProductNameList {
    private int categoryId;
    private String ingredientName;
    private String itemCode;
    private String kindCode;
}
