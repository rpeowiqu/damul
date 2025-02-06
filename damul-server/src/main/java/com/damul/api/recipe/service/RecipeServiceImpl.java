package com.damul.api.recipe.service;

import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.common.scroll.dto.request.ScrollRequest;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.common.scroll.util.ScrollUtil;
import com.damul.api.recipe.dto.request.RecipeRequest;
import com.damul.api.recipe.dto.response.*;
import com.damul.api.recipe.entity.Recipe;
import com.damul.api.recipe.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.xml.stream.events.Comment;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecipeServiceImpl implements RecipeService {

    private final RedisTemplate<String, String> redisTemplate;
    private final RecipeRepository recipeRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;
    private final RecipeStepRepository recipeStepRepository;
    private final RecipeCommentRepository recipeCommentRepository;
    private final RecipeBookmarkRepository bookmarkRepository;
    private final RecipeLikeRepository likeRepository;

    private static final String VIEW_COUNT_KEY = "recipe:view";
    private static final long REDIS_DATA_EXPIRE_TIME = 60 * 60 * 24; // 24시간

    // 레시피 전체 조회 및 검색
    @Override
    public ScrollResponse getRecipes(ScrollRequest scrollRequest, String searchType, String keyword, String orderBy) {

        // 검색어가 있는데 검색 타입이 없는 경우 예외 처리
        if (keyword != null && searchType == null) {
            log.error("검색어는 존재, 검색타입 없음");
            throw new BusinessException(ErrorCode.SEARCHTYPE_NOT_FOUND);
        }

        List<RecipeList> recipes;
        boolean hasSearch = (searchType != null && keyword != null);
        boolean hasOrder = (orderBy != null);

        // 1. 기본 전체 조회
        if (!hasSearch && !hasOrder) {
            recipes = recipeRepository.findAllRecipes(
                    scrollRequest.getCursorId(),
                    scrollRequest.getSize() + 1
            );
        }
        // 2. 검색어만 있는 경우
        else if (hasSearch && !hasOrder) {
            recipes = recipeRepository.findBySearch(
                    scrollRequest.getCursorId(),
                    scrollRequest.getSize() + 1,
                    searchType,
                    keyword
            );
        }

        // 3. 정렬 조건만 있는 경우
        else if (!hasSearch && hasOrder) {
            recipes = recipeRepository.findAllWithOrder(
                    scrollRequest.getCursorId(),
                    scrollRequest.getSize() + 1,
                    orderBy
            );
        }

        // 4. 검색어와 정렬 조건이 모두 있는 경우
        else {
            recipes = recipeRepository.findBySearchWithOrder(
                    scrollRequest.getCursorId(),
                    scrollRequest.getSize() + 1,
                    searchType,
                    keyword,
                    orderBy
            );
        }

        if (recipes.size() > scrollRequest.getSize()) {
            recipes = recipes.subList(0, scrollRequest.getSize());
        }

        return ScrollUtil.createScrollResponse(recipes, scrollRequest);
    }

    @Override
    public RecipeDetail getRecipeDetail(int recipeId, int userId) {
        log.info("레시피 상세조회 및 조회수 증가 시작 - recipeId: {}, userId: {}", recipeId, userId);

        // 1. Redis에서 조회수 확인 및 증가
        String redisKey = VIEW_COUNT_KEY + recipeId;
        ValueOperations<String, String> ops = redisTemplate.opsForValue();


        log.info("Redis에서 해당 키 찾기 - 키: {}", redisKey);
        // Redis에 해당 키가 없으면 DB에서 조회수를 가져와서 설정
        if (!Boolean.TRUE.equals(redisTemplate.hasKey(redisKey))) {
            Recipe recipe = recipeRepository.findById(recipeId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.BOARD_NOT_FOUND));
            ops.set(redisKey, String.valueOf(recipe.getViewCnt()));
            redisTemplate.expire(redisKey, REDIS_DATA_EXPIRE_TIME, TimeUnit.SECONDS);
        }


        // 조회수 증가 (Redis의 atomic increment 사용)
        Long newViewCount = ops.increment(redisKey);
        log.info("조회수 증가 - newViewCount: {}", newViewCount);

        // 2. Recipe 정보 조회
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.BOARD_NOT_FOUND));

        // 3. 북마크/좋아요 상태 확인
        boolean isBookmarked = false;
        boolean isLiked = false;
        if (userId != 0) {  // null 체크는 여전히 필요
            isBookmarked = bookmarkRepository.existsByRecipe_IdAndUser_Id(recipeId, userId);
            isLiked = likeRepository.existsByRecipe_IdAndUser_Id(recipeId, userId);
        }

        log.info("재료 목록 조회 시작");
        // 4. 재료 목록 조회
        List<IngredientList> ingredients = recipeIngredientRepository
                .findByRecipeOrderByIngredientOrder(recipe)
                .stream()
                .map(ingredient -> IngredientList.builder()
                        .id(ingredient.getId())
                        .name(ingredient.getIngredientName())
                        .amount(String.valueOf(ingredient.getAmount()))
                        .unit(ingredient.getUnit())
                        .build())
                .collect(Collectors.toList());

        log.info("재료 목록 조회 완료");


        log.info("조리 순서 조회 시작");
        // 5. 조리 순서 조회
        List<CookingOrderList> cookingOrders = recipeStepRepository
                .findByRecipeOrderByStepNumber(recipe)
                .stream()
                .map(step -> CookingOrderList.builder()
                        .id(step.getId())
                        .content(step.getContent())
                        .imageUrl(step.getImageUrl())
                        .build())
                .collect(Collectors.toList());
        log.info("조리 순서 조회 완료");


        log.info("댓글 목록 조회 시작");
        // 6. 댓글 목록 조회
        List<CommentList> comments = recipeCommentRepository
                .findByRecipeOrderByCreatedAtDesc(recipe)
                .stream()
                .map(comment -> CommentList.builder()
                        .id(comment.getId())
                        .userId(comment.getWriter().getId())
                        .nickname(comment.getWriter().getNickname())
                        .profileImageUrl(comment.getWriter().getProfileImageUrl())
                        .comment(comment.getComment())
                        .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                        .createdAt(comment.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                        .build())
                .collect(Collectors.toList());

        log.info("댓글 목록 조회 완료");

        // 6. RecipeDetail 객체 생성 및 반환
        return RecipeDetail.builder()
                .recipeId(recipe.getRecipeId())
                .title(recipe.getTitle())
                .bookmarked(isBookmarked)
                .liked(isLiked)
                .createdAt(recipe.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .authorId(recipe.getUser().getId())
                .authorName(recipe.getUser().getNickname())
                .profileImageUrl(recipe.getUser().getProfileImageUrl())
                .viewCnt(newViewCount != null ? newViewCount.intValue() : recipe.getViewCnt())
                .likeCnt(recipe.getLikeCnt())
                .contentImageUrl(recipe.getThumbnailUrl())
                .ingredients(ingredients)
                .cookingOrders(cookingOrders)
                .comments(comments)
                .build();
    }

    // 레시피 작성
    @Override
    public void addRecipe(RecipeRequest recipeRequest, MultipartFile mainImage, List<MultipartFile> cookingImages) {

    }

    @Override
    public void updateRecipe(RecipeRequest recipeRequest, MultipartFile mainImage, List<MultipartFile> cookingImages) {

    }

    @Override
    public void deleteRecipe(int recipeId) {

    }

    @Override
    public void toggleRecipeLike(int recipeId) {

    }

    @Override
    public void addRecipeComment(int recipeId, Comment comment) {

    }

    @Override
    public void toggleRecipeBookmark(int recipeId) {

    }


    private boolean checkSearch(String searchType, String keyword) {
        return searchType != null && keyword != null;
    }

    private boolean checkOrderBy(String orderByDir, String orderBy) {
        return orderByDir != null && orderBy != null;
    }
}
