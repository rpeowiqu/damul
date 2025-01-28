package com.damul.api.main.entity;

import com.damul.api.auth.entity.User;
import com.damul.api.main.dto.IngredientStorage;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_ingredients")
@Getter
@NoArgsConstructor
public class UserIngredient {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;  // int userId → User 객체로 변경

    @Id
    @Column(name = "id")
    private int userIngredientId;

    @Column(name = "category_id", nullable = false)
    private int categoryId;

    @Column(name = "ingredient_quantity", nullable = false)
    private int ingredientQuantity;

    @Column(name = "ingredient_up", nullable = false)
    private LocalDateTime ingredientUp;

    @Column(name = "ingredient_name", length = 100, nullable = false)
    private String ingredientName;

    @Column(name = "due_date", nullable = false)
    private LocalDateTime dueDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "ingredient_storage", nullable = false)
    private IngredientStorage ingredientStorage;

    public void updateQuantity(int quantity) {
        this.ingredientQuantity = quantity;
    }
}
