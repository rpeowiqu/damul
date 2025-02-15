package com.damul.api.receipt.service;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.receipt.dto.request.UserIngredientPost;
import com.damul.api.receipt.dto.response.ReceiptCalendarResponse;
import com.damul.api.receipt.dto.response.ReceiptDetailResponse;

public interface UserReceiptService {

    void registerIngredients(int userId, UserIngredientPost request);

    ReceiptCalendarResponse getMonthlyReceipt(int userId, int year, int month);

    ReceiptDetailResponse getReceiptDetail(int userId, int receiptId);

}
