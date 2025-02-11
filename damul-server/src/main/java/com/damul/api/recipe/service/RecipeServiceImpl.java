package com.damul.api.recipe.service;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.auth.entity.User;
import com.damul.api.common.comment.CommentCreate;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.common.dto.response.CreateResponse;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.common.scroll.util.ScrollUtil;
import com.damul.api.recipe.dto.request.RecipeRequest;
import com.damul.api.recipe.dto.response.*;
import com.damul.api.recipe.entity.*;
import com.damul.api.recipe.repository.*;
import com.damul.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cglib.core.Local;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.time.LocalDateTime;
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
    public ScrollResponse getRecipes(UserInfo userInfo, int cursor, int size, String searchType, String keyword, String orderBy) {
        log.debug("=== Recipe Search Start ===");
        log.debug("Parameters: cursor={}, size={}, searchType={}, keyword={}, orderBy={}", cursor,
                size, searchType, keyword, orderBy);

        if(userInfo == null) {
            log.error("사용자 정보를 찾을 수 없습니다.");
            throw new BusinessException(ErrorCode.USER_FORBIDDEN);
        }

        // 현재 로그인한 사용자 ID 가져오기 (인증 컨텍스트에서)
        int currentUserId = userInfo.getId();

        // 검색어가 있는데 검색 타입이 없는 경우 예외 처리
        if (keyword != null && searchType == null) {
            log.error("검색어는 존재, 검색타입 없음");
            throw new BusinessException(ErrorCode.INVALID_SEARCH_TYPE);
        }

        List<RecipeList> recipes;
        boolean hasSearch = (searchType != null && keyword != null);
        boolean hasOrder = (orderBy != null);

        // Limit 대신 pageable
        Pageable pageable = PageRequest.of(0, size + 1);

        // 1. 기본 전체 조회
        if (!hasSearch && !hasOrder) {
            log.info("기본 전체 조회");
            recipes = recipeRepository.findAllRecipes(
                    cursor,
                    currentUserId,
                    pageable
            );
        }
        // 2. 검색어만 있는 경우
        else if (hasSearch && !hasOrder) {
            log.info("검색어만 존재");
            recipes = recipeRepository.findBySearch(
                    cursor,
                    currentUserId,
                    pageable,
                    searchType,
                    keyword
            );
        }

        // 3. 정렬 조건만 있는 경우
        else if (!hasSearch && hasOrder) {
            log.info("정렬 조건만 존재");
            recipes = recipeRepository.findAllWithOrder(
                    cursor,
                    currentUserId,
                    pageable,
                    orderBy
            );
        }

        // 4. 검색어와 정렬 조건이 모두 있는 경우
        else {
            log.info("모두 존재");
            recipes = recipeRepository.findBySearchWithOrder(
                    cursor,
                    currentUserId,
                    pageable,
                    searchType,
                    keyword,
                    orderBy
            );
        }

        if (recipes.size() > size) {
            recipes = recipes.subList(0, size);
        }

        if (recipes.isEmpty()) {
            log.debug("레시피 없음");
        } else {
            log.debug("First recipe data: id={}, title={}, userId={}, viewCnt={}, likeCnt={}, bookmarked={}, liked={}",
                    recipes.get(0).getId(),
                    recipes.get(0).getTitle(),
                    recipes.get(0).getUserId(),
                    recipes.get(0).getViewCnt(),
                    recipes.get(0).getLikeCnt(),
                    recipes.get(0).isBookmarked(),
                    recipes.get(0).isLiked());
        }

        return ScrollUtil.createScrollResponse(recipes, cursor, size);
    }

    // 인기 급상승 레시피 조회 (5개)
    @Override
    public List<FamousRecipe> getFamousRecipe() {
        log.info("인기 급상승 조회 시작");
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusDays(3);
        log.info("시작일 - startDate: {}", startDate);
        log.info("종료일 - endDate: {}", endDate);

        Pageable pageable = PageRequest.of(0, 5);
        List<FamousRecipe> topRecipes = recipeRepository.findTop5LikedRecipes(
            startDate, endDate);

        log.info("인기 급상승 조회 완료");

        topRecipes.forEach(recipe -> {
            List<TagDto> tags = recipeRepository.findTagDtosByRecipeId(recipe.getId());
            recipe.setTag(tags);
        });


        return topRecipes;
    }

    // 레시피 상세보기
    @Override
    @Transactional
    public RecipeDetail getRecipeDetail(int recipeId, UserInfo userInfo) {
        if(userInfo == null) {
            log.error("userInfo 없음 - userInfo is null");
            throw new BusinessException(ErrorCode.USER_FORBIDDEN);
        }
        int userId = checkUserInfo(userInfo);
        log.info("레시피 상세조회 및 조회수 증가 시작 - recipeId: {}, userId: {}", recipeId, userInfo.getId());
        if(userId == 0) {
            log.error("UserInfo Id값 조회 불가 - userId: {}", userId);
            throw new BusinessException(ErrorCode.USER_FORBIDDEN);
        }


        // 1. Redis에서 조회수 확인 및 증가
        String redisKey = VIEW_COUNT_KEY + recipeId;
        String userViewKey = VIEW_COUNT_KEY + recipeId + ":user:" + userId;
        ValueOperations<String, String> ops = redisTemplate.opsForValue();

        // Redis에 해당 키가 없으면 DB에서 조회수를 가져와서 설정
        if (!Boolean.TRUE.equals(redisTemplate.hasKey(redisKey))) {
            Recipe recipe = recipeRepository.findById(recipeId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.RECIPE_ID_NOT_FOUND));
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
        Recipe recipe = recipeRepository.findByIdAndDeletedFalse(recipeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RECIPE_ID_NOT_FOUND));

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
                .findByRecipe_IdAndDeletedFalseOrderByCreatedAtAsc(recipeId)
                .stream()
                .map(comment -> CommentList.builder()
                        .id(comment.getId())
                        .userId(comment.getUser().getId())
                        .nickname(comment.getUser().getNickname())
                        .profileImageUrl(comment.getUser().getProfileImageUrl())
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
                .content(recipe.getContent())
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
    public void addRecipe(RecipeRequest recipeRequest, MultipartFile thumbnailImage, List<MultipartFile> cookingImages) {
        log.info("레시피 작성 시작");

    }

    // 레시피 수정
    @Override
    public void updateRecipe(RecipeRequest recipeRequest, MultipartFile thumbnailImage, List<MultipartFile> cookingImages) {

    }

    @Override
    public void deleteRecipe(int recipeId) {
        log.info("레시피 삭제 시작 - recipeId: {}", recipeId);
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RECIPE_ID_NOT_FOUND));
        recipeRepository.softDeleteRecipe(recipeId);
        log.info("레시피 삭제 완료");
    }

    // 레시피 좋아요
    @Override
    public boolean toggleRecipeLike(int recipeId, UserInfo userInfo) {
        log.info("레시피 좋아요 시작");
        int userId = checkUserInfo(userInfo);
        if(userId == 0) {
            log.error("UserInfo Id값 조회 불가 - userId: {}", userId);
            throw new BusinessException(ErrorCode.USER_FORBIDDEN);
        }

        log.info("레시피 존재 유무 확인");
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RECIPE_ID_NOT_FOUND));

        log.info("레시피 좋아요 유무 확인");
        Optional<RecipeLike> recipeLike = recipeLikeRepository.findByRecipe_IdAndUser_Id(recipeId, userId);

        log.info("레시피 존재함");
        // 좋아요 있으면 삭제 -> 없으면 생성
        if (recipeLike.isPresent()) {
            log.info("좋아요 했음 -> 좋아요 취소");
            recipeLikeRepository.delete(recipeLike.get());
            recipe.decrementLikeCnt();  // likeCnt 감소
            recipeRepository.save(recipe);  // 변경사항 저장
            return false;
        } else {
            log.info("좋아요 추가");
            RecipeLike newLike = RecipeLike.builder()
                    .recipe(recipe)
                    .user(userRepository.getReferenceById(userId))  // 실제 조회 없이 참조만 가져옴
                    .build();
            recipeLikeRepository.save(newLike);
            recipe.incrementLikeCnt();  // likeCnt 증가
            recipeRepository.save(recipe);  // 변경사항 저장
            return true;
        }



    }

    // 댓글 작성
    @Override
    public CreateResponse addRecipeComment(int recipeId, CommentCreate commentCreate, UserInfo userInfo) {
        log.info("댓글 작성 시작");
        if(commentCreate == null) {
            log.error("commentCreate 존재하지 않음");
            throw new BusinessException(ErrorCode.INVALID_COMMENT);
        }

        if(userInfo == null) {
            log.error("유저가 존재하지 않습니다");
            throw new BusinessException(ErrorCode.USER_FORBIDDEN);
        }

        User user = userRepository.findById(userInfo.getId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_FORBIDDEN));

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.BOARD_NOT_FOUND));

        RecipeComment parent = null;
        if(commentCreate.getParentId() != 0) {
            parent = recipeCommentRepository.findById(commentCreate.getParentId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.PARENT_ID_NOT_FOUND));
        }


        RecipeComment comment = RecipeComment.builder()
                .recipe(recipe)
                .user(user)
                .parent(parent)
                .comment(commentCreate.getComment())
                .build();

        RecipeComment savedComment = recipeCommentRepository.save(comment);
        return new CreateResponse(savedComment.getId());
    }

    // 댓글 삭제
    @Override
    public void deleteComment(int recipeId, int commentId) {
        log.info("댓글 삭제 시작 - recipeId: {}, commentId: {}", recipeId, commentId);

        log.info("레시피 조회 시작 - recipeId: {}", recipeId);
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> {
                    log.error("해당 레시피는 존재하지 않습니다.");
                    throw new BusinessException(ErrorCode.RECIPE_ID_NOT_FOUND);
                });

        RecipeComment comment = recipeCommentRepository.findById(commentId)
                .orElseThrow(() -> {
                    log.error("해당 댓글은 존재하지 않습니다.");
                    throw new BusinessException(ErrorCode.COMMENT_ID_NOT_FOUND);
                });

        log.info("댓글 삭제 시작 - commentId: {}", commentId);
        recipeCommentRepository.softDeleteComment(commentId);
        log.info("댓글 삭제 완료 - commentId: {}", commentId);
    }

    @Override
    public boolean toggleRecipeBookmark(int recipeId, UserInfo userInfo) {
        log.info("레시피 북마크 시작");
        int userId = checkUserInfo(userInfo);
        if(userId == 0) {
            log.error("UserInfo Id값 조회 불가 - userId: {}", userId);
            throw new BusinessException(ErrorCode.USER_FORBIDDEN);
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


    // 이미지 유효성 검사 메서드
    private void validateImageFile(MultipartFile file) {
        // 파일 크기 제한 (예: 10MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            log.error("파일 사이즈 ERROR - fileSize: {}", file.getSize());
            throw new BusinessException(ErrorCode.FILE_SIZE_EXCEEDED);
        }

        // 파일 이름에서 확장자 추출
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new BusinessException(ErrorCode.INVALID_FILE_TYPE);
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
        List<String> allowedExtensions = List.of("jpg", "jpeg", "png", "gif", "bmp", "webp");

        if (!allowedExtensions.contains(extension)) {
            throw new BusinessException(ErrorCode.INVALID_FILE_TYPE);
        }
    }
}
