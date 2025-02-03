package com.damul.api.main.dto.response;

import com.damul.api.main.dto.IngredientStorage;
import com.damul.api.main.entity.UserIngredient;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserIngredientList {

    private int userIngredientId;
    private int categoryId;
    private String ingredientName;
    private int ingredientQuantity;
    private int expirationDate;
    private IngredientStorage ingredientStorage;

    public static UserIngredientList from(UserIngredient entity) {
        LocalDate dueDate = entity.getDueDate().toLocalDate();
        LocalDate now = LocalDateTime.now().toLocalDate();

        long daysBetween = ChronoUnit.DAYS.between(dueDate, now);
        int expirationDate = (int) daysBetween;

        return new UserIngredientList(
                entity.getUserIngredientId(),
                entity.getCategoryId(),
                entity.getIngredientName(),
                entity.getIngredientQuantity(),
                expirationDate,
                entity.getIngredientStorage()
        );
    }

}
