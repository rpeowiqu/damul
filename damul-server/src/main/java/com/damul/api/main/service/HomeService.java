package com.damul.api.main.service;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.main.dto.request.UserIngredientUpdate;
import com.damul.api.main.dto.response.HomeIngredientDetail;
import com.damul.api.main.dto.response.HomeSuggestedResponse;
import com.damul.api.main.dto.response.IngredientResponse;
import com.damul.api.main.dto.response.SelectedIngredientList;
import com.damul.api.receipt.dto.request.UserIngredientPost;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface HomeService {

    IngredientResponse getUserIngredientList(int targetId, int userId);

    IngredientResponse getSearchUserIngredientList(int userId, String keyword, String orderByDir, String orderBy);

    HomeIngredientDetail getUserIngredientDetail(int ingredientId);

    void updateQuantity(int ingredientId, UserIngredientUpdate update);

    SelectedIngredientList getSelectedIngredientList(List<Integer> ingredientIds);

    void deleteIngredient(int userIngredientId, int userId, Integer warningEnable);

    HomeSuggestedResponse getRecommendedRecipes(int userId);

//    UserIngredientPost processImage(MultipartFile file, UserInfo user);

}
