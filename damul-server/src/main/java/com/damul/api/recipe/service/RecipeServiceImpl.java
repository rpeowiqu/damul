package com.damul.api.recipe.service;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.auth.entity.User;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.common.scroll.dto.request.ScrollRequest;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.common.scroll.util.ScrollUtil;
import com.damul.api.recipe.dto.request.RecipeRequest;
import com.damul.api.recipe.dto.response.*;
import com.damul.api.recipe.entity.Recipe;
import com.damul.api.recipe.entity.RecipeBookmark;
import com.damul.api.recipe.entity.RecipeLike;
import com.damul.api.recipe.repository.*;
import com.damul.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.xml.stream.events.Comment;
import java.time.Duration;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
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
    private final UserRepository userRepository;
    private final RecipeLikeRepository recipeLikeRepository;
    private final RecipeBookmarkRepository recipeBookmarkRepository;

    // 레시피 전체 조회 및 검색
    @Override
    public ScrollResponse getRecipes(ScrollRequest scrollRequest, String searchType, String keyword, String orderBy) {

        log.debug("=== Recipe Search Start ===");
        log.debug("Parameters: cursorId={}, size={}, searchType={}, keyword={}, orderBy={}", scrollRequest.getCursorId(),
                scrollRequest.getSize(), searchType, keyword, orderBy);
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
            log.info("기본 전체 조회");
            recipes = recipeRepository.findAllRecipes(
                    scrollRequest.getCursorId(),
                    scrollRequest.getSize() + 1
            );
        }
        // 2. 검색어만 있는 경우
        else if (hasSearch && !hasOrder) {
            log.info("검색어만 존재");
            recipes = recipeRepository.findBySearch(
                    scrollRequest.getCursorId(),
                    scrollRequest.getSize() + 1,
                    searchType,
                    keyword
            );
        }

        // 3. 정렬 조건만 있는 경우
        else if (!hasSearch && hasOrder) {
            log.info("정렬 조건만 존재");
            recipes = recipeRepository.findAllWithOrder(
                    scrollRequest.getCursorId(),
                    scrollRequest.getSize() + 1,
                    orderBy
            );
        }

        // 4. 검색어와 정렬 조건이 모두 있는 경우
        else {
            log.info("모두 존재");
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

        if (recipes.isEmpty()) {
            log.debug("No recipes found in JPA query result");
        } else {
            log.debug("Found {} recipes in JPA query", recipes.size());
            log.debug("First recipe data: id={}, title={}, userId={}",
                    recipes.get(0).getId(),
                    recipes.get(0).getTitle(),
                    recipes.get(0).getUserId());
        }

        return ScrollUtil.createScrollResponse(recipes, scrollRequest);
    }

    @Override
    @Transactional
    public RecipeDetail getRecipeDetail(int recipeId, UserInfo userInfo) {
        log.info("레시피 상세조회 및 조회수 증가 시작 - recipeId: {}, userId: {}", recipeId, userInfo.getId());
        int userId = checkUserInfo(userInfo);
        if(userId == 0) {
            log.error("UserInfo Id값 조회 불가 - userId: {}", userId);
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }


        // 1. Redis에서 조회수 확인 및 증가
        String redisKey = VIEW_COUNT_KEY + recipeId;
        String userViewKey = VIEW_COUNT_KEY + recipeId + ":user:" + userId;
        ValueOperations<String, String> ops = redisTemplate.opsForValue();


        log.info("Redis에서 해당 키 찾기 - 키: {}", redisKey);
        // Redis에 해당 키가 없으면 DB에서 조회수를 가져와서 설정
        if (!Boolean.TRUE.equals(redisTemplate.hasKey(redisKey))) {
            Recipe recipe = recipeRepository.findById(recipeId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.BOARD_NOT_FOUND));
            ops.set(redisKey, String.valueOf(recipe.getViewCnt()));
            redisTemplate.expire(redisKey, REDIS_DATA_EXPIRE_TIME, TimeUnit.SECONDS);
        }

        // 사용자별 중복 조회 방지
        Boolean alreadyViewed = redisTemplate.opsForValue().setIfAbsent(
                userViewKey,
                "viewed",
                Duration.ofDays(1) // 1일 동안만 유효
        );

        // 처음 조회하는 경우에만 조회수 증가
        Long newViewCount = null;
        if (Boolean.TRUE.equals(alreadyViewed)) {
            newViewCount = ops.increment(redisKey);
            // 즉시 데이터베이스 업데이트 (소규모 서비스에 적합)
            recipeRepository.updateViewCount(recipeId, newViewCount.intValue());
            log.info("조회수 증가 - newViewCount: {}", newViewCount);
        }

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
                .recipeId(recipe.getId())
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
        log.info("레시피 삭제 시작 - recipeId: {}", recipeId);
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.BOARD_NOT_FOUND));
        recipeRepository.delete(recipe);
        log.info("레시피 삭제 완료");
    }

    // 레시피 좋아요
    @Override
    public boolean toggleRecipeLike(int recipeId, UserInfo userInfo) {
        log.info("레시피 좋아요 시작");
        int userId = checkUserInfo(userInfo);
        if(userId == 0) {
            log.error("UserInfo Id값 조회 불가 - userId: {}", userId);
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }

        log.info("레시피 존재 유무 확인");
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.BOARD_NOT_FOUND));

        log.info("레시피 좋아요 유무 확인");
        Optional<RecipeLike> recipeLike = recipeLikeRepository.findByRecipe_IdAndUser_Id(recipeId, userId);

        log.info("레시피 존재함");
        // 좋아요 있으면 삭제 -> 없으면 생성
        if (recipeLike.isPresent()) {
            log.info("좋아요 했음 -> 좋아요 취소");
            recipeLikeRepository.delete(recipeLike.get());
            return false;
        } else {
            log.info("좋아요 추가");
            RecipeLike newLike = RecipeLike.builder()
                    .recipe(recipe)
                    .user(userRepository.getReferenceById(userId))  // 실제 조회 없이 참조만 가져옴
                    .build();
            recipeLikeRepository.save(newLike);
            return true;
        }



    }

    @Override
    public void addRecipeComment(int recipeId, Comment comment) {

    }

    @Override
    public boolean toggleRecipeBookmark(int recipeId, UserInfo userInfo) {
        log.info("레시피 북마크 시작");
        int userId = checkUserInfo(userInfo);
        if(userId == 0) {
            log.error("UserInfo Id값 조회 불가 - userId: {}", userId);
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }

        log.info("레시피 존재 확인");
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.BOARD_NOT_FOUND));


        Optional<RecipeBookmark> recipeBookmark = recipeBookmarkRepository.findByRecipe_IdAndUser_Id(recipeId, userId);
        
        log.info("레시피 존재함");
        // 북마크 있으면 삭제 -> 없으면 생성
        if (recipeBookmark.isPresent()) {
            log.info("북마크 했음 -> 북마크 취소");
            recipeBookmarkRepository.delete(recipeBookmark.get());
            return false;
        } else {
            log.info("북마크 추가");
            RecipeBookmark newBookmark = RecipeBookmark.builder()
                    .recipe(recipe)
                    .user(userRepository.getReferenceById(userId))
                    .build();
            recipeBookmarkRepository.save(newBookmark);
            return true;
        }

    }


    private boolean checkSearch(String searchType, String keyword) {
        return searchType != null && keyword != null;
    }

    private boolean checkOrderBy(String orderByDir, String orderBy) {
        return orderByDir != null && orderBy != null;
    }

    private int checkUserInfo(UserInfo userInfo) { return userInfo != null ? userInfo.getId() : 0; }
}
