package com.damul.api.main.service;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.auth.entity.User;
import com.damul.api.auth.entity.type.AccessRange;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.common.sse.service.SseService;
import com.damul.api.common.util.IngredientNormalizerUtil;
import com.damul.api.main.dto.IngredientStorage;
import com.damul.api.main.dto.OcrDto;
import com.damul.api.main.dto.OcrList;
import com.damul.api.main.dto.request.UserIngredientUpdate;
import com.damul.api.main.dto.response.*;
import com.damul.api.main.entity.UserIngredient;
import com.damul.api.main.repository.UserIngredientRepository;
import com.damul.api.recipe.dto.response.RecipeList;
import com.damul.api.recipe.entity.Recipe;
import com.damul.api.recipe.entity.RecipeIngredient;
import com.damul.api.recipe.repository.RecipeIngredientRepository;
import com.damul.api.recipe.repository.RecipeRepository;
import com.damul.api.recipe.repository.RecipeTagRepository;
import com.damul.api.recipe.service.RecipeService;
import com.damul.api.user.repository.FollowRepository;
import com.damul.api.user.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class HomeServiceImpl implements HomeService {

    private final ObjectMapper objectMapper;
    private final SseService sseService;
    private final RedisTemplate<String, Object> redisTemplate;
    @Value("${fastapi.server.url}")
    private String fastApiServerUrl;
    private static final String SSE_KEY_PREFIX = "sse:emitter:";

    private final RecipeService recipeService;
    private final RecipeRepository recipeRepository;
    private final UserIngredientRepository userIngredientRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;
    private final RecipeTagRepository recipeTagRepository;
    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final RestTemplate restTemplate;
    private final IngredientNormalizerUtil ingredientNormalizerUtil;


    public String normalizeIngredient(String originalName) {
        return ingredientNormalizerUtil.normalize(originalName);
    }

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
    public void updateQuantity(int ingredientId, UserIngredientUpdate update, UserInfo user) {
        validateIngredientQuantity(update.getIngredientQuantity());
        validateUpdateUser(user, ingredientId);

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
        if (ingredient.getUserReceipt().getUser().getId() != userId) {
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

        final int DESIRED_RECIPE_COUNT = 5; // 원하는 총 레시피 수를 상수로 정의

        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));

        // 1. 사용자가 보유한 유효한 식재료 조회 (삭제되지 않고, 유통기한이 지나지 않은 것만)
        List<UserIngredient> userIngredients = userIngredientRepository
                .findByUserReceipt_User_IdAndIsDeletedFalseAndExpirationDateGreaterThan(userId, now);

        if (userIngredients.isEmpty()) {
            log.info("사용자의 보유 식재료가 없습니다. 좋아요 순으로 레시피를 추천합니다.");
            return recipeService.getFamousRecipe();
        }

        // 2. 사용자의 정규화된 식재료 이름들
        Set<String> userNormalizedIngredients = userIngredients.stream()
                .map(UserIngredient::getNormalizedIngredientName)
                .collect(Collectors.toSet());

        log.info("사용자 보유 식재료 수: {}", userNormalizedIngredients.size());

        // 3. 사용자의 식재료를 포함하는 레시피 조회 (DB에서 필터링)
        List<Recipe> matchingRecipes = recipeRepository.findRecipesContainingIngredients(userNormalizedIngredients);
        log.info("매칭되는 레시피 수: {}", matchingRecipes.size());

        List<SuggestedRecipeList> suggestedRecipes = new ArrayList<>();

        // 매칭되는 레시피 추가
        if (!matchingRecipes.isEmpty()) {
            List<SuggestedRecipeList> matchingSuggestions = matchingRecipes.stream()
                    .map(recipe -> SuggestedRecipeList.builder()
                            .recipeId(recipe.getId())
                            .title(recipe.getTitle())
                            .thumbnailUrl(recipe.getThumbnailUrl())
                            .build())
                    .collect(Collectors.toList());

            Collections.shuffle(matchingSuggestions); // 매칭된 레시피들을 랜덤으로 섞기
            suggestedRecipes.addAll(matchingSuggestions);
        }

        // 만약 매칭된 레시피가 원하는 수보다 적다면, 인기 레시피로 나머지를 채우기
        if (suggestedRecipes.size() < DESIRED_RECIPE_COUNT) {
            List<SuggestedRecipeList> topRecipes = recipeService.getFamousRecipe().getSuggestedRecipes();

            // 이미 추천된 레시피는 제외
            Set<Integer> existingRecipeIds = suggestedRecipes.stream()
                    .map(SuggestedRecipeList::getRecipeId)
                    .collect(Collectors.toSet());

            List<SuggestedRecipeList> remainingTopRecipes = topRecipes.stream()
                    .filter(recipe -> !existingRecipeIds.contains(recipe.getRecipeId()))
                    .limit(DESIRED_RECIPE_COUNT - suggestedRecipes.size())
                    .collect(Collectors.toList());

            suggestedRecipes.addAll(remainingTopRecipes);
        }

        log.info("레시피 추천 완료 - 매칭된 레시피 수: {}, 총 추천 레시피 수: {}",
                matchingRecipes.size(), suggestedRecipes.size());

        return new HomeSuggestedResponse(suggestedRecipes);
    }

    private List<SuggestedRecipeList> getTopLikedRecipes() {
        // 좋아요 순으로 상위 레시피 조회
        List<Recipe> topRecipes = recipeRepository.findTopByOrderByLikeCntDesc();

        return topRecipes.stream()
                .map(recipe -> SuggestedRecipeList.builder()
                        .recipeId(recipe.getId())
                        .title(recipe.getTitle())
                        .thumbnailUrl(recipe.getThumbnailUrl())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteBulkIngredients(List<Integer> userIngredientIds, int userId, Integer warningEnable) {
        if (userIngredientIds == null || userIngredientIds.isEmpty()) {
            throw new BusinessException(ErrorCode.EMPTY_INGREDIENT_LIST);
        }

        // 모든 식자재가 현재 사용자의 것인지 확인
        List<Integer> ownerIds = userIngredientRepository.findUserIdsByUserIngredientIds(userIngredientIds);
        boolean hasUnauthorizedAccess = ownerIds.stream().anyMatch(ownerId -> ownerId != userId);

        if (hasUnauthorizedAccess) {
            throw new BusinessException(ErrorCode.INGREDIENT_ACCESS_DENIED);
        }

        List<UserIngredient> ingredients = userIngredientRepository.findAllByIdsAndNotDeleted(userIngredientIds);

        if (ingredients.isEmpty()) {
            throw new BusinessException(ErrorCode.INGREDIENT_NOT_FOUND);
        }

        if (warningEnable != null && warningEnable == 0) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.USER_FORBIDDEN));
            user.updateWarningEnabled(false);
        }

        // 모든 식자재 삭제 처리
        ingredients.forEach(UserIngredient::delete);
    }

    public OcrList processImage(MultipartFile file, int userId) {
        try {
            log.info("서비스: 이미지 처리 시작 - userId: {}", userId);
            log.info("SSE 연결 상태 확인 - userId: {}, 연결됨: {}", userId,
                    redisTemplate.hasKey(SSE_KEY_PREFIX + userId));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("image", createFileResource(file));
            body.add("user_id", userId);

            HttpEntity<MultiValueMap<String, Object>> requestEntity =
                    new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    fastApiServerUrl,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                log.error("서비스: FastAPI 서버 응답 실패 - userId: {}, statusCode: {}",
                        userId, response.getStatusCode());
                throw new BusinessException(ErrorCode.FILE_SIZE_EXCEEDED, "OCR 서버 처리 실패");
            }

            // FastAPI 응답의 userIngredients 배열을 OcrDto 리스트로 변환
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            JsonNode userIngredientsNode = rootNode.get("userIngredients");

            List<OcrDto> ocrResults = objectMapper.convertValue(
                    userIngredientsNode,
                    new TypeReference<List<OcrDto>>() {}
            );

            log.info("SSE 연결 상태 확인 - userId: {}, 연결됨: {}", userId,
                    redisTemplate.hasKey(SSE_KEY_PREFIX + userId));
            log.info("서비스: 이미지 처리 완료 - userId: {}", userId);
            return new OcrList(ocrResults);

        } catch (IOException e) {
            log.error("서비스: 이미지 처리 중 에러 발생 - userId: {}", userId, e);
            throw new BusinessException(ErrorCode.BAD_REQUEST, "이미지 처리 중 오류가 발생했습니다");
        } catch (Exception e) {
            log.error("서비스: 예상치 못한 에러 발생 - userId: {}", userId, e);
            throw new BusinessException(ErrorCode.BAD_REQUEST, "이미지 처리 중 오류가 발생했습니다");
        }
    }

    private ByteArrayResource createFileResource(MultipartFile file) throws IOException {
        return new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        };
    }

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

//    private SuggestedRecipeList convertToSuggestedRecipeList(RecipeList recipe) {
//        return SuggestedRecipeList.builder()
//                .recipeId(recipe.getId())
//                .title(recipe.getTitle())
//                .thumbnailUrl(recipe.getThumbnailUrl())
//                .recipeTags(recipeTagRepository.findByRecipeId(recipe.getId()).stream()
//                        .map(recipeTag -> new RecipeTagList(
//                                recipeTag.getTag().getId(),
//                                recipeTag.getTag().getTagName()
//                        ))
//                        .collect(Collectors.toList()))
//                .build();
//    }

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

    private void validateUpdateUser(UserInfo user, int ingredientId) {
        int targetUserId = userIngredientRepository.findUserIdByUserIngredientId(ingredientId);
        if(user.getId() != targetUserId) throw new BusinessException(ErrorCode.INVALID_ID, "다른 유저의 식자재를 수정할 수 없습니다.");
    }

}
