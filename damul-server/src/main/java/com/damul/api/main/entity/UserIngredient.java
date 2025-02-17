package com.damul.api.main.entity;

import com.damul.api.main.dto.IngredientStorage;
import com.damul.api.receipt.entity.UserReceipt;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_ingredients")
@Getter
@NoArgsConstructor
public class UserIngredient {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receipt_id", referencedColumnName = "id")
    private UserReceipt userReciept;  // int userId → User 객체로 변경

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int userIngredientId;

    @Column(name = "category_id", nullable = false)
    private int categoryId;

    @Column(name = "ingredient_quantity", nullable = false)
    private int ingredientQuantity = 100;

    @Column(name = "ingredient_up")
    private LocalDateTime ingredientUp = LocalDateTime.now();

    @Column(name = "ingredient_name", length = 100)
    private String ingredientName;

    @Column(name = "expiration_date")
    private LocalDateTime expirationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "ingredient_storage", nullable = false)
    private IngredientStorage ingredientStorage;

    @Column(name = "price")
    private int price;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;  // 삭제 상태 필드 추가

    @Builder
    public UserIngredient(UserReceipt userReciept, int userIngredientId, int categoryId,
                          int ingredientQuantity, LocalDateTime ingredientUp,
                          String ingredientName, LocalDateTime expirationDate,
                          IngredientStorage ingredientStorage, int price) {
        this.userReciept = userReciept;
        this.userIngredientId = userIngredientId;
        this.categoryId = categoryId;
        this.ingredientQuantity = ingredientQuantity;
        this.ingredientUp = (ingredientUp != null) ? ingredientUp : LocalDateTime.now();  // null 체크 추가
        this.ingredientName = ingredientName;
        this.expirationDate = expirationDate;
        this.ingredientStorage = ingredientStorage;
        this.price = price;
        this.isDeleted = false;
    }

    // 논리적 삭제를 위한 메서드
    public void delete() {
        this.isDeleted = true;
    }

    public void updateQuantity(int quantity) {
        this.ingredientQuantity = quantity;
    }

    public void updateCreatedAt(LocalDateTime createdAt) {
        this.ingredientUp = createdAt;
    }

}
