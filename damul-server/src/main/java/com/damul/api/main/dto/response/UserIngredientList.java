package com.damul.api.main.dto.response;

import com.damul.api.main.dto.IngredientStorage;
import com.damul.api.main.entity.UserIngredient;
import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserIngredientList {

    private int userIngredientId;
    private int categoryId;
    private String ingredientName;
    private int ingredientQuantity;
    private IngredientStorage ingredientStorage;

    public static UserIngredientList from(UserIngredient entity) {
        return new UserIngredientList(
                entity.getUserIngredientId(),
                entity.getCategoryId(),
                entity.getIngredientName(),
                entity.getIngredientQuantity(),
                entity.getIngredientStorage()
        );
    }

}
