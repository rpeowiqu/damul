package com.damul.api.receipt.repository;

import com.damul.api.receipt.entity.UserReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserReceiptRepository extends JpaRepository<UserReceipt, Integer> {
}