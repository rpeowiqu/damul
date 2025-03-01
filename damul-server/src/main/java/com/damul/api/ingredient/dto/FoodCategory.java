package com.damul.api.ingredient.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum FoodCategory {
    GRAIN(1, "곡물"),
    FRUIT(2, "과일"),
    OIL(3, "기름"),
    EGG(4, "달걀류"),
    SEAFOOD(5, "수산물"),
    SEASONING(6, "양념"),
    DAIRY(7, "유제품"),
    MEAT(8, "육류"),
    VEGETABLE(9, "채소"),
    OTHER(10, "기타");

    private final int id;
    private final String name;
}