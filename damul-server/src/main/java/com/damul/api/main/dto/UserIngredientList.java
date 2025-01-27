package com.damul.api.main.dto;

import com.damul.api.main.entity.UserIngredient;
import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserIngredientList {

    private int ingredientId;
    private int categoryId;
    private String ingredientName;
    private int ingredientQuantity;
    private IngredientStorage ingredientStorage;

    public static UserIngredientList from(UserIngredient entity) {
        return new UserIngredientList(
                entity.getId(),
                entity.getCategoryId(),
                entity.getIngredientName(),
                entity.getIngredientQuantity(),
                entity.getIngredientStorage()
        );
    }

}
