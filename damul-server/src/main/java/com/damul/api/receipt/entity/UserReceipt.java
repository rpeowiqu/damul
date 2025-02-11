package com.damul.api.receipt.entity;

import com.damul.api.auth.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// UserReceipt.java
@Entity
@Table(name = "user_receipts")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserReceipt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "store_name")
    private String storeName;

    @Column(name = "purchase_at")
    private LocalDateTime purchaseAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Builder
    public UserReceipt(User user, String storeName, LocalDateTime purchaseAt) {
        this.user = user;
        this.storeName = storeName;
        this.purchaseAt = purchaseAt;
        this.createdAt = LocalDateTime.now();
    }
}