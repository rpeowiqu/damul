package com.damul.api.receipt.entity;

import com.damul.api.auth.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_receipts")
@Getter
@NoArgsConstructor
public class UserReceipt {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;  // int userId → User 객체로 변경

    @Id
    @Column(name = "id")
    private int userReceiptId;

    @Column(name = "store_name", length = 100)
    private String storeName;

    @Column(name = "purchase_at")
    private LocalDateTime purchaseAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

}
