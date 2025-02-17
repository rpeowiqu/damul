package com.damul.api.ingredient.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "food_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class FoodItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "category_id")
    private int categoryId;

    @Column(name = "item_name", length = 100)
    private String itemName;

    @Column(name = "kind_name", length = 100)
    private String kindName;

    @Column(name = "item_code", length = 10)
    private String itemCode;

    @Column(name = "kind_code", length = 10)
    private String kindCode;

    @Column(name = "unit")
    private String unit;

    @Column(name = "eco_flag")
    private boolean ecoFlag;
}