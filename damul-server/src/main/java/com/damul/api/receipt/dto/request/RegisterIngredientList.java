package com.damul.api.receipt.dto.request;

import com.damul.api.main.dto.IngredientStorage;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterIngredientList {

    private String ingredientName;
    private int categoryId;
    private int productPrice;
    private LocalDate expirationDate;
    private IngredientStorage ingredientStorage;

}
