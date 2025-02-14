package com.damul.api.recipe.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "recipe_ingredients")
@Getter
@Setter
@NoArgsConstructor
public class RecipeIngredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", referencedColumnName = "id")
    private Recipe recipe;

    @Column(name = "ingredient_name", length = 50, nullable = false)
    private String ingredientName;

    @Column(name = "amount", nullable = false, precision = 5, scale = 1)
    private String amount;

    @Column(name = "unit", length = 10)
    private String unit;
}
