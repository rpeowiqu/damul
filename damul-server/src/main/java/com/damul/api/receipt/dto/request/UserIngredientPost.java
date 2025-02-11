package com.damul.api.receipt.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserIngredientPost {

    private String purchaseAt;
    private String storeName;
    private List<RegisterIngredientList> userIngredients;

}
