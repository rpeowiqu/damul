package com.damul.api.receipt.service;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.receipt.dto.request.UserIngredientPost;
import com.damul.api.receipt.dto.response.ReceiptCalendarResponse;

public interface UserReceiptService {

    void registerIngredients(int userId, UserIngredientPost request);

    ReceiptCalendarResponse getMonthlyReceipt(UserInfo userInfo, int year, int month);


}
