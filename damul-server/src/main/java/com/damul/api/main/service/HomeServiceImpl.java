package com.damul.api.main.service;

import com.damul.api.auth.entity.User;
import com.damul.api.main.dto.IngredientStorage;
import com.damul.api.main.dto.request.UserIngredientUpdate;
import com.damul.api.main.dto.response.*;
import com.damul.api.main.entity.UserIngredient;
import com.damul.api.main.repository.UserIngredientRepository;
import com.damul.api.recipe.dto.response.RecipeList;
import com.damul.api.recipe.entity.Recipe;
import com.damul.api.recipe.entity.RecipeTag;
import com.damul.api.recipe.repository.RecipeRepository;
import com.damul.api.recipe.repository.RecipeTagRepository;
import com.damul.api.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class HomeServiceImpl implements HomeService {

    private final UserIngredientRepository userIngredientRepository;
    private final RecipeRepository recipeRepository;
    private final RecipeTagRepository recipeTagRepository;
    private final UserRepository userRepository;

    @Override
    public IngredientResponse getUserIngredientList(int userId) {
        log.info("사용자 식자재 전체 가져오기 시작 - userId: {}", userId);

        List<UserIngredient> userIngredients = userIngredientRepository.findAllByUserId(userId);

        if (userIngredients.isEmpty()) {
            return new IngredientResponse(
                    Collections.emptyList(),
                    Collections.emptyList(),
                    Collections.emptyList()
            );
        }

        List<UserIngredientList> ingredients = userIngredients.stream()
                .map(UserIngredientList::from)
                .collect(Collectors.toList());

        return new IngredientResponse(
                ingredients.stream()
                        .filter(i -> i.getStorage().equals("freezer"))
                        .collect(Collectors.toList()),
                ingredients.stream()
                        .filter(i -> i.getStorage().equals("fridge"))
                        .collect(Collectors.toList()),
                ingredients.stream()
                        .filter(i -> i.getStorage().equals("roomTemp"))
                        .collect(Collectors.toList())
        );
    }

    @Override
    @Transactional(readOnly = true)
    public IngredientResponse getSearchUserIngredientList(int userId, String keyword,
                                                          String orderByDir, String orderBy) {
        log.info("사용자 식자재 검색 가져오기 시작");

        Sort.Direction direction = Sort.Direction.ASC;
        if (orderByDir != null && orderByDir.equalsIgnoreCase("desc")) {
            direction = Sort.Direction.DESC;
        }

        String sortBy = determineSortField(orderBy);
        Sort sort = Sort.by(direction, sortBy);

        List<UserIngredient> userIngredients = userIngredientRepository
                .findByUserIdAndIngredientNameContaining(userId, keyword, sort);

        List<UserIngredientList> ingredientDtos = userIngredients.stream()
                .map(UserIngredientList::from)
                .collect(Collectors.toList());

        return categorizeIngredients(ingredientDtos);
    }

    @Override
    public HomeIngredientDetail getUserIngredientDetail(int ingredientId) {
        log.info("사용자 식자재 상세 가져오기 시작");
        HomeIngredientDetail homeIngredientDetail = userIngredientRepository.findHomeIngredientDetailById(ingredientId);
        log.info("사용자 식자재 상세 가져오기 성공");
        return homeIngredientDetail;
    }

    @Override
    @Transactional
    public void updateQuantity(int ingredientId, UserIngredientUpdate update) {
        log.info("식자재 양 업데이트 시작");
        UserIngredient ingredient = userIngredientRepository.findById(ingredientId)
                .orElseThrow(() -> new EntityNotFoundException("재료를 찾을 수 없습니다."));

        ingredient.updateQuantity(update.getIngredientQuantity());
        log.info("식자재 양 업데이트 성공");
    }

    @Override
    public SelectedIngredientList getSelectedIngredientList(List<Integer> ingredientIds) {
        log.info("선택된 식자재 조회 시작");
        List<UserIngredient> ingredients = userIngredientRepository.findAllById(ingredientIds);

        if (ingredients.isEmpty()) {
            throw new EntityNotFoundException("선택된 식자재가 없습니다.");
        }

        log.info("선택된 식자재 조회 성공");
        return SelectedIngredientList.from(ingredients);
    }

    @Override
    @Transactional
    public void deleteIngredient(int userIngredientId, int userId, Integer warningEnable) {
        log.info("식자재 삭제 시작");
        UserIngredient ingredient = userIngredientRepository.findByIdAndNotDeleted(userIngredientId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 재료입니다."));

        // warningEnable 값이 존재하고 0일 경우 (false로 설정하려는 경우)
        if (warningEnable != null && warningEnable == 0) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));
            user.updateWarningEnabled(false);
        }

        log.info("식자재 삭제 성공");
        ingredient.delete();  // 논리적 삭제 처리
    }

    @Override
    @Transactional(readOnly = true)
    public HomeSuggestedResponse getRecommendedRecipes(int userId) {
        log.info("서비스: 레시피 추천 시작 - userId: {}", userId);

        List<RecipeList> recommendedRecipes = new ArrayList<>();

        // 1. 재료 유사도 기반으로 레시피 조회
        List<RecipeList> similarRecipes = recipeRepository.findRecipesByIngredientSimilarity(userId);
        recommendedRecipes.addAll(similarRecipes);

        // 2. 5개가 안되면 인기있는 레시피로 채우기
        if (recommendedRecipes.size() < 5) {
            List<RecipeList> popularRecipes = recipeRepository.findPopularRecipes().stream()
                    .filter(recipe -> recommendedRecipes.stream()
                            .noneMatch(r -> r.getId() == recipe.getId()))
                    .limit(5 - recommendedRecipes.size())
                    .collect(Collectors.toList());
            recommendedRecipes.addAll(popularRecipes);
        }

        List<SuggestedRecipeList> suggestedRecipes = recommendedRecipes.stream()
                .limit(5)
                .map(this::convertToSuggestedRecipeList)
                .collect(Collectors.toList());

        return new HomeSuggestedResponse(suggestedRecipes);
    }

    private SuggestedRecipeList convertToSuggestedRecipeList(RecipeList recipe) {
        return SuggestedRecipeList.builder()
                .recipeId(recipe.getId())
                .title(recipe.getTitle())
                .thumbnailUrl(recipe.getThumbnailUrl())
                .recipeTags(recipeTagRepository.findByRecipeId(recipe.getId()).stream()
                        .map(recipeTag -> new RecipeTagList(
                                recipeTag.getTag().getId(),
                                recipeTag.getTag().getTagName()
                        ))
                        .collect(Collectors.toList()))
                .build();
    }

    private int calculateDaysUntilExpiration(LocalDateTime expirationDate) {
        return (int) ChronoUnit.DAYS.between(LocalDateTime.now(), expirationDate);
    }

    private IngredientResponse categorizeIngredients(List<UserIngredientList> ingredients) {
        List<UserIngredientList> freezer = new ArrayList<>();
        List<UserIngredientList> fridge = new ArrayList<>();
        List<UserIngredientList> roomTemp = new ArrayList<>();

        for (UserIngredientList ingredient : ingredients) {
            IngredientStorage storage = determineStorage(ingredient.getCategoryId());
            switch (storage) {
                case FREEZER -> freezer.add(ingredient);
                case FRIDGE -> fridge.add(ingredient);
                case ROOM_TEMPERATURE -> roomTemp.add(ingredient);
            }
        }

        return new IngredientResponse(freezer, fridge, roomTemp);
    }

    private IngredientStorage determineStorage(int categoryId) {
        if (categoryId <= 10) return IngredientStorage.FREEZER;
        else if (categoryId <= 20) return IngredientStorage.FRIDGE;
        else return IngredientStorage.ROOM_TEMPERATURE;
    }

    private String determineSortField(String orderBy) {
        if (orderBy == null) return "ingredientName";
        return switch (orderBy.toLowerCase()) {
            case "quantity" -> "ingredientQuantity";
            case "date" -> "expirationDate";
            default -> "ingredientName";
        };
    }

}
