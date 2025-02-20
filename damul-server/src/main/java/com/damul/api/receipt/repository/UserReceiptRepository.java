package com.damul.api.receipt.repository;

import com.damul.api.receipt.dto.response.DailyReceiptInfo;
import com.damul.api.receipt.dto.response.ReceiptDetail;
import com.damul.api.receipt.entity.UserReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface UserReceiptRepository extends JpaRepository<UserReceipt, Integer> {

    @Query(value = "SELECT DAY(ur.purchase_at) AS dayOfMonth, GROUP_CONCAT(ur.id) AS receiptIds " +
            "FROM user_receipts ur " +
            "WHERE ur.user_id = :userId " +
            "AND YEAR(ur.purchase_at) = :year " +
            "AND MONTH(ur.purchase_at) = :month " +
            "GROUP BY DAY(ur.purchase_at)", nativeQuery = true)
    List<DailyReceiptInfo> findDailyReceipts(int userId, int year, int month);


    @Query("SELECT SUM(ur.totalAmount) " +
            "FROM UserReceipt ur " +
            "WHERE ur.user.id = :userId " +
            "AND YEAR(ur.purchaseAt) = :year " +
            "AND MONTH(ur.purchaseAt) = :month")
    Integer calculateMonthlyTotal(
            @Param("userId") int userId,
            @Param("year") int year,
            @Param("month") int month);



    @Query("""
            SELECT new com.damul.api.receipt.dto.response.ReceiptDetail(
            ui.ingredientName, fc.categoryName, ui.price)
            FROM UserIngredient ui 
            JOIN FoodCategory fc
            ON fc.id = ui.categoryId
            AND ui.userReceipt.id = :receiptId
            """)
    List<ReceiptDetail> findReceiptDetailsByReceiptId(int receiptId);


    UserReceipt findUserReceiptById(Integer id);
}