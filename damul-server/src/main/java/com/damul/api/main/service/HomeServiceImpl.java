package com.damul.api.main.service;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.auth.entity.User;
import com.damul.api.auth.entity.type.AccessRange;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.main.dto.IngredientStorage;
import com.damul.api.main.dto.request.UserIngredientUpdate;
import com.damul.api.main.dto.response.*;
import com.damul.api.main.entity.UserIngredient;
import com.damul.api.main.repository.UserIngredientRepository;
import com.damul.api.receipt.dto.request.UserIngredientPost;
import com.damul.api.recipe.dto.response.RecipeList;
import com.damul.api.recipe.entity.Recipe;
import com.damul.api.recipe.entity.RecipeTag;
import com.damul.api.recipe.repository.RecipeRepository;
import com.damul.api.recipe.repository.RecipeTagRepository;
import com.damul.api.user.repository.FollowRepository;
import com.damul.api.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.http.HttpHeaders;
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

    @Value("${fastapi.server.url}")
    private String fastApiServerUrl;

    private final UserIngredientRepository userIngredientRepository;
    private final RecipeRepository recipeRepository;
    private final RecipeTagRepository recipeTagRepository;
    private final UserRepository userRepository;
    private final FollowRepository followRepository;

    @Override
    public IngredientResponse getUserIngredientList(int targetId, int userId) {
        log.info("사용자 식자재 전체 가져오기 시작 - userId: {}", userId);

        validateUserId(targetId);
        if(targetId != userId) {
            validateUserAccessRange(targetId, userId);
        }

        List<UserIngredient> userIngredients = userIngredientRepository.findAllByUserId(targetId);

        return new IngredientResponse(
                filterByStorage(userIngredients, "freezer"),
                filterByStorage(userIngredients, "fridge"),
                filterByStorage(userIngredients, "roomTemp")
        );
    }

    @Override
    @Transactional(readOnly = true)
    public IngredientResponse getSearchUserIngredientList(int userId, String keyword,
                                                          String orderByDir, String orderBy) {
        validateUserId(userId);
        validateSortParameters(orderByDir, orderBy);

        Sort.Direction direction = getSortDirection(orderByDir);
        String sortBy = determineSortField(orderBy);
        Sort sort = Sort.by(direction, sortBy);

        List<UserIngredient> userIngredients = userIngredientRepository
                .findByUserIdAndIngredientNameContaining(userId, keyword != null ? keyword : "", sort);

        return categorizeIngredients(userIngredients.stream()
                .map(UserIngredientList::from)
                .collect(Collectors.toList()));
    }

    @Override
    public HomeIngredientDetail getUserIngredientDetail(int ingredientId) {
        log.info("사용자 식자재 상세 가져오기 시작");
        HomeIngredientDetail detail = userIngredientRepository.findHomeIngredientDetailById(ingredientId);
        if (detail == null) {
            throw new BusinessException(ErrorCode.INGREDIENT_NOT_FOUND);
        }
        return detail;
    }

    @Override
    @Transactional
    public void updateQuantity(int ingredientId, UserIngredientUpdate update) {
        validateIngredientQuantity(update.getIngredientQuantity());

        UserIngredient ingredient = userIngredientRepository.findById(ingredientId)
                .orElseThrow(() -> new BusinessException(ErrorCode.INGREDIENT_NOT_FOUND));

        ingredient.updateQuantity(update.getIngredientQuantity());
    }

    @Override
    public SelectedIngredientList getSelectedIngredientList(List<Integer> ingredientIds) {
        if (ingredientIds == null || ingredientIds.isEmpty()) {
            throw new BusinessException(ErrorCode.EMPTY_INGREDIENT_LIST);
        }

        List<UserIngredient> ingredients = userIngredientRepository.findAllById(ingredientIds);

        if (ingredients.isEmpty()) {
            throw new BusinessException(ErrorCode.INGREDIENT_NOT_FOUND);
        }

        return SelectedIngredientList.from(ingredients);
    }

    @Override
    @Transactional
    public void deleteIngredient(int userIngredientId, int userId, Integer warningEnable) {
        UserIngredient ingredient = userIngredientRepository.findByIdAndNotDeleted(userIngredientId)
                .orElseThrow(() -> new BusinessException(ErrorCode.INGREDIENT_NOT_FOUND));

        // 권한 검증
        if (ingredient.getUserReciept().getUser().getId() != userId) {
            throw new BusinessException(ErrorCode.INGREDIENT_ACCESS_DENIED);
        }

        if (warningEnable != null && warningEnable == 0) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.USER_FORBIDDEN));
            user.updateWarningEnabled(false);
        }

        ingredient.delete();
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

//    public UserIngredientPost processImage(MultipartFile file, UserInfo user) {
//        try {
//            log.info("서비스: 이미지 처리 시작 - userId: {}", user.getId());
//
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
//
//            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
//            body.add("file", createFileResource(file));
//            body.add("user_id", user.getId()); // JWT에서 얻은 사용자 ID 전달
//
//            HttpEntity<MultiValueMap<String, Object>> requestEntity =
//                    new HttpEntity<>(body, headers);
//
//            ResponseEntity<String> response = restTemplate.exchange(
//                    fastApiServerUrl + "/api/v1/ocr",
//                    HttpMethod.POST,
//                    requestEntity,
//                    String.class
//            );
//
//            if (!response.getStatusCode().is2xxSuccessful()) {
//                log.error("서비스: FastAPI 서버 응답 실패 - userId: {}, statusCode: {}",
//                        user.getId(), response.getStatusCode());
//                throw new BusinessException(ErrorCode.FILE_SIZE_EXCEEDED, "OCR 서버 처리 실패");
//            }
//
//            log.info("서비스: 이미지 처리 완료 - userId: {}", user.getId());
//            return response.getBody();
//
//        } catch (IOException e) {
//            log.error("서비스: 이미지 처리 중 에러 발생 - userId: {}", user.getId(), e);
//            throw new ImageProcessingException("이미지 처리 중 오류가 발생했습니다");
//        } catch (Exception e) {
//            log.error("서비스: 예상치 못한 에러 발생 - userId: {}", user.getId(), e);
//            throw new ImageProcessingException("이미지 처리 중 오류가 발생했습니다");
//        }
//    }
//
//    private ByteArrayResource createFileResource(MultipartFile file) throws IOException {
//        return new ByteArrayResource(file.getBytes()) {
//            @Override
//            public String getFilename() {
//                return file.getOriginalFilename();
//            }
//        };
//    }

    private void validateUserId(int userId) {
        if (userId <= 0) {
            throw new BusinessException(ErrorCode.INVALID_ID);
        }
        if (!userRepository.existsById(userId)) {
            throw new BusinessException(ErrorCode.USER_FORBIDDEN);
        }
    }

    private void validateSortParameters(String orderByDir, String orderBy) {
        if (orderByDir != null && !orderByDir.equalsIgnoreCase("asc") && !orderByDir.equalsIgnoreCase("desc")) {
            throw new BusinessException(ErrorCode.INVALID_SORT_DIRECTION);
        }
        if (orderBy != null && !isValidSortField(orderBy)) {
            throw new BusinessException(ErrorCode.INVALID_SORT_FIELD);
        }
    }

    // 이거 프론트랑 상의 필요
    private boolean isValidSortField(String orderBy) {
        return orderBy.equalsIgnoreCase("quantity") ||
                orderBy.equalsIgnoreCase("date") ||
                orderBy.equalsIgnoreCase("name");
    }

    private void validateIngredientQuantity(Integer quantity) {
        if (quantity == null || quantity < 0) {
            throw new BusinessException(ErrorCode.INVALID_INGREDIENT_QUANTITY);
        }
    }

    private Sort.Direction getSortDirection(String orderByDir) {
        return (orderByDir != null && orderByDir.equalsIgnoreCase("desc"))
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
    }

    private List<UserIngredientList> filterByStorage(List<UserIngredient> ingredients, String storage) {
        return ingredients.stream()
                .map(UserIngredientList::from)
                .filter(i -> i.getStorage().equals(storage))
                .collect(Collectors.toList());
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

    private void validateUserAccessRange(int targetId, int userId) {
        AccessRange range = userRepository.findAccessRangeById(targetId);
        switch (range) {
            case PUBLIC -> {
                return;
            }
            case PRIVATE -> throw new BusinessException(ErrorCode.ACCESS_DENIED, "비공개된 사용자입니다.");
            case FRIENDS -> {
                if(followRepository.existsByFollowerIdAndFollowingId(userId, targetId)
                        && followRepository.existsByFollowerIdAndFollowingId(targetId, userId)) {
                    return;
                }

                throw new BusinessException(ErrorCode.ACCESS_DENIED, "비공개된 사용자입니다.");
            }
        }
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
