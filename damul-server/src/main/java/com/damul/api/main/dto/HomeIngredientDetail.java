package com.damul.api.main.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class HomeIngredientDetail {

    private int userIngredientId;
    private int categoryId;
    private int ingredientQuantity;
    private LocalDateTime ingredientUp;
    private String ingredientName;
    private LocalDateTime dueDate;
    private boolean warning;

}
