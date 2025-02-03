package com.damul.api.main.service;

import com.damul.api.main.dto.request.UserIngredientUpdate;
import com.damul.api.main.dto.response.HomeIngredientDetail;
import com.damul.api.main.dto.response.IngredientResponse;
import com.damul.api.main.dto.response.SelectedIngredientList;

import java.util.List;

public interface HomeService {

    IngredientResponse getUserIngredientList(int userId);

    IngredientResponse getSearchUserIngredientList(int userId, String keyword, String orderByDir, String orderBy);

    HomeIngredientDetail getUserIngredientDetail(int ingredientId);

    void updateQuantity(int ingredientId, UserIngredientUpdate update);

    SelectedIngredientList getSelectedIngredientList(List<Integer> ingredientIds);

    void deleteIngredient(int userIngredientId);

}
