package com.damul.api.receipt.service;

import com.damul.api.receipt.dto.request.UserIngredientPost;

public interface UserReceiptService {

    void registerIngredients(int userId, UserIngredientPost request);



}
