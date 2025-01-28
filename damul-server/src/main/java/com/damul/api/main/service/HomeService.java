package com.damul.api.main.service;

import com.damul.api.main.dto.HomeIngredientDetail;
import com.damul.api.main.dto.IngredientResponse;

public interface HomeService {

    IngredientResponse getUserIngredientList(int userId);

    IngredientResponse getSearchUserIngredientList(int userId, String keyword, String orderByDir, String orderBy);

    HomeIngredientDetail getUserIngredientDetail(int ingredientId);

}
