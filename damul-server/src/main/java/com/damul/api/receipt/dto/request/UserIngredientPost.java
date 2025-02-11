package com.damul.api.receipt.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserIngredientPost {

    private LocalDate purchaseAt;
    private String storeName;
    private List<RegisterIngredientList> userIngredients;

}
