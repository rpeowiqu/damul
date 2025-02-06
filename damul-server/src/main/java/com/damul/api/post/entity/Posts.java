package com.damul.api.post.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "posts")
@Getter
@NoArgsConstructor
public class Posts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id", unique = true, nullable = false)
    private int postId;

    @ManyToOne
    @JoinColumn
    private 

    @Column(length = 200, nullable = false)
    private String title;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "receipt_id", referencedColumnName = "id")
//    private UserReceipt userReciept;  // int userId → User 객체로 변경
//
//    @Id
//    @Column(name = "id")
//    private int userIngredientId;
//
//    @Column(name = "category_id", nullable = false)
//    private int categoryId;
//
//    @Column(name = "ingredient_quantity", nullable = false)
//    private int ingredientQuantity;
//
//    @Column(name = "ingredient_up", nullable = false)
//    private LocalDateTime ingredientUp;
//
//    @Column(name = "ingredient_name", length = 100, nullable = false)
//    private String ingredientName;
//
//    @Column(name = "due_date", nullable = false)
//    private LocalDateTime dueDate;
//
//    @Enumerated(EnumType.STRING)
//    @Column(name = "ingredient_storage", nullable = false)
//    private IngredientStorage ingredientStorage;
//
//    @Column(name = "price")
//    private double price;
//
//    @Column(name = "is_deleted", nullable = false)
//    private boolean isDeleted = false;  // 삭제 상태 필드 추가
//
//    // 논리적 삭제를 위한 메서드
//    public void delete() {
//        this.isDeleted = true;
//    }
//
//    public void updateQuantity(int quantity) {
//        this.ingredientQuantity = quantity;
//    }
}
