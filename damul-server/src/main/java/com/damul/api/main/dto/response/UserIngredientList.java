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
@Builder
public class UserIngredientList {
    private int userIngredientId;
    private int categoryId;
    private String ingredientName;
    private int ingredientQuantity;
    private int expirationDate;
    private String storage;
    private LocalDate purchaseDate;

    public static UserIngredientList from(UserIngredient entity) {
        LocalDate expirationDate = entity.getExpirationDate().toLocalDate();
        LocalDate now = LocalDateTime.now().toLocalDate();

        long daysBetween = ChronoUnit.DAYS.between(now, expirationDate);

        return new UserIngredientList(
                entity.getUserIngredientId(),
                entity.getCategoryId(),
                entity.getIngredientName(),
                entity.getIngredientQuantity(),
                (int) daysBetween,
                convertStorage(entity.getIngredientStorage()),
                entity.getIngredientUp().toLocalDate()
        );
    }

    private static String convertStorage(IngredientStorage storage) {
        return switch (storage) {
            case FREEZER -> "freezer";
            case FRIDGE -> "fridge";
            case ROOM_TEMPERATURE -> "roomTemp";
        };
    }
}