package com.damul.api.mypage.service;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.auth.entity.User;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.common.scroll.dto.response.CursorPageMetaInfo;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.common.scroll.util.ScrollUtil;
import com.damul.api.mypage.dto.response.*;
import com.damul.api.mypage.entity.Badge;
import com.damul.api.mypage.entity.UserBadge;
import com.damul.api.mypage.repository.BookmarkRepository;
import com.damul.api.mypage.repository.FoodPreferenceRepository;
import com.damul.api.mypage.repository.UserBadgeRepository;
import com.damul.api.recipe.dto.response.RecipeList;
import com.damul.api.recipe.repository.RecipeRepository;
import com.damul.api.user.dto.response.FollowResponse;
import com.damul.api.user.repository.FollowRepository;
import com.damul.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class MyPageServiceImpl implements MyPageService {

    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final FoodPreferenceRepository foodPreferenceRepository;
    private final RecipeRepository recipeRepository;
    private final BookmarkRepository bookmarkRepository;
    private final UserBadgeRepository userBadgeRepository;

    @Override
    @Transactional(readOnly = true)
    public ProfileHeaderDetail getProfileHeader(int userId, UserInfo currentUser) {
        log.info("서비스: 마이페이지 헤더 조회 시작 - userId: {}", userId);

        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "존재하지 않는 사용자입니다."));

        validateAccessPermission(targetUser, currentUser);

        log.info("서비스: 마이페이지 헤더 조회 완료 - userId: {}", userId);

        return ProfileHeaderDetail.from(targetUser);
    }

    @Override
    @Transactional(readOnly = true)
    public ProfileDetail getProfileDetail(int userId, UserInfo currentUser) {
        log.info("서비스: 마이페이지 프로필 조회 시작 - userId: {}", userId);

        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "존재하지 않는 사용자입니다."));

        validateAccessPermission(targetUser, currentUser);

        int followerCount = followRepository.countByFollowingId(userId);
        int followingCount = followRepository.countByFollowerId(userId);
        Boolean followed = followRepository.existsByFollowerIdAndFollowingId(currentUser.getId(), userId);
        List<FoodPreferenceList> foodPreferences = foodPreferenceRepository.findPreferencesByUserId(userId);

        return ProfileDetail.builder()
                .followerCount(followerCount)
                .followingCount(followingCount)
                .followed(followed)
                .selfIntroduction(targetUser.getSelfIntroduction())
                .foodPreference(foodPreferences)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public FollowResponse getFollowStatus(int targetUserId, int currentUserId) {
        boolean isFollowing = followRepository.existsByFollowerIdAndFollowingId(currentUserId, targetUserId);
        return new FollowResponse(isFollowing);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BadgeList> getUserBadges(int userId, UserInfo currentUser) {
        log.info("서비스: 마이페이지 뱃지 조회 시작 - userId: {}", userId);

        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "존재하지 않는 사용자입니다."));

        validateAccessPermission(targetUser, currentUser);

        List<BadgeList> badges = userBadgeRepository.findBadgesByUserId(userId);

        log.info("서비스: 마이페이지 뱃지 조회 완료 - userId: {}", userId);

        return badges;
    }

    @Override
    @Transactional(readOnly = true)
    public BadgeDetail getBadgeDetail(int userId, int badgeId, UserInfo currentUser) {
        log.info("서비스: 마이페이지 뱃지 상세 조회 시작 - userId: {}, badgeId: {}", userId, badgeId);

        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "존재하지 않는 사용자입니다."));

        validateAccessPermission(targetUser, currentUser);

        UserBadge userBadge = userBadgeRepository.findByUserIdAndBadgeId(userId, badgeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_BADGE_NOT_FOUND, "획득하지 않은 뱃지입니다."));

        Badge badge = userBadge.getBadge();
        double rankValue = Optional.ofNullable(userBadge.getRank())
                .orElse(0.0);

        return BadgeDetail.builder()
                .id(badge.getId())
                .title(badge.getTitle())
                .description(badge.getDescription())
                .createdAt(userBadge.getCreatedAt())
                .level(badge.getLevel())
                .rank(rankValue)
                .catchPhrase(badge.getCatchPhrase())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ScrollResponse<RecipeList> getMyRecipes(int userId, int cursor, int size, String sortType, UserInfo currentUser) {
        log.info("서비스: 마이페이지 레시피 조회 시작 - userId: {}", userId);

        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "존재하지 않는 사용자입니다."));

        validateAccessPermission(targetUser, currentUser);
        validateSortType(sortType);

        List<RecipeList> recipes = recipeRepository.findMyRecipes(userId, cursor, size + 1, sortType);
        log.info("recipes Size: {}", recipes.size());

        return ScrollUtil.createScrollResponse(recipes, cursor, size);
    }

    @Override
    @Transactional(readOnly = true)
    public ScrollResponse<MyBookmarkList> getBookmarkedRecipes(int userId, int cursor, int size, String sortType, UserInfo currentUser) {
        log.info("서비스: 마이페이지 북마크 조회 시작 - userId: {}", userId);

        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "존재하지 않는 사용자입니다."));

        validateAccessPermission(targetUser, currentUser);
        validateSortType(sortType);


        // 커서가 0이 아닐 경우 커서에 해당하는 북마크를 조회하여 정렬 기준값을 가져옴
        LocalDateTime cursorCreatedAt = LocalDateTime.now();
        int cursorViewCnt = 0;
        int cursorLikeCnt = 0;

        List<MyBookmarkList> bookmarks = bookmarkRepository.findBookmarkedRecipes(userId, cursor, size + 1, sortType);

        return ScrollUtil.createScrollResponse(bookmarks, cursor, size);
    }

    private double calculateRankPercentage(int badgeId, int userLevel) {
        int totalUsers = userRepository.countActiveUsers();
        int higherLevelUsers = userBadgeRepository.countUsersWithHigherLevel(badgeId, userLevel);

        return (higherLevelUsers * 100.0) / totalUsers;
    }

    private String generateAchieveCondition(Badge badge) {
        return String.format("%d회 달성 시 획득 가능", badge.getStandard());
    }

    private void validateAccessPermission(User targetUser, UserInfo currentUser) {
        if (!targetUser.isActive()) {
            throw new BusinessException(ErrorCode.USER_INACTIVE, "비활성화된 사용자입니다.");
        }
    }

    private void validateSortType(String sortType) {
        boolean isValid = switch (sortType) {
            case "created_at", "view_cnt", "like_cnt" -> true;
            default -> false;
        };
        if(!isValid) {
            throw new BusinessException(ErrorCode.INVALID_SEARCH_TYPE, "존재하지 않는 정렬 타입입니다.");
        }
    }
}
