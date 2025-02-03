package com.damul.api.recipe.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "recipe_steps")
@Getter
@NoArgsConstructor
public class RecipeStep {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id")
    private Recipe recipe;

    @Column(name = "step_number", nullable = false)
    private int stepNumber;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "image_url")
    private String imageUrl;
}
