package com.damul.api.mypage.service;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.auth.entity.User;
import com.damul.api.auth.entity.type.AccessRange;
import com.damul.api.common.scroll.dto.response.CursorPageMetaInfo;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
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
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

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
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 사용자입니다."));

        validateAccessPermission(targetUser, currentUser);

        log.info("서비스: 마이페이지 헤더 조회 완료 - userId: {}", userId);

        return ProfileHeaderDetail.from(targetUser);
    }

    @Override
    @Transactional(readOnly = true)
    public ProfileDetail getProfileDetail(int userId, UserInfo currentUser) {
        log.info("서비스: 마이페이지 프로필 조회 시작 - userId: {}", userId);

        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 사용자입니다."));

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
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 사용자입니다."));

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
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 사용자입니다."));

        validateAccessPermission(targetUser, currentUser);

        UserBadge userBadge = userBadgeRepository.findByUserIdAndBadgeId(userId, badgeId)
                .orElseThrow(() -> new EntityNotFoundException("획득하지 않은 뱃지입니다."));

        Badge badge = userBadge.getBadge();
        double rankPercentage = calculateRankPercentage(badgeId, userBadge.getLevel());
        String achieveCondition = generateAchieveCondition(badge);

        return BadgeDetail.builder()
                .id(badge.getId())
                .title(badge.getName())
                .description(badge.getDescription())
                .createdAt(userBadge.getCreatedAt())
                .rank(rankPercentage)
                .achieveCond(achieveCondition)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ScrollResponse<MyRecipeList> getMyRecipes(int userId, int cursor, int size, UserInfo currentUser) {
        log.info("서비스: 마이페이지 레시피 조회 시작 - userId: {}", userId);

        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 사용자입니다."));

        validateAccessPermission(targetUser, currentUser);

        List<MyRecipeList> recipes = recipeRepository.findMyRecipes(userId, cursor, size);

        if (recipes.isEmpty()) {
            return new ScrollResponse<>(
                    Collections.emptyList(),
                    new CursorPageMetaInfo(0, false)
            );
        }

        int nextCursor = recipes.get(recipes.size() - 1).getId();
        boolean hasNext = recipeRepository.existsByUserIdAndIdLessThan(userId, nextCursor);

        return new ScrollResponse<>(
                recipes,
                new CursorPageMetaInfo(nextCursor, hasNext)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ScrollResponse<RecipeList> getBookmarkedRecipes(int userId, int cursor, int size, UserInfo currentUser) {
        log.info("서비스: 마이페이지 북마크 조회 시작 - userId: {}", userId);

        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 사용자입니다."));

        validateAccessPermission(targetUser, currentUser);

        List<RecipeList> bookmarks = bookmarkRepository.findBookmarkedRecipes(userId, cursor, size);

        if (bookmarks.isEmpty()) {
            return new ScrollResponse<>(
                    Collections.emptyList(),
                    new CursorPageMetaInfo(0, false)
            );
        }

        int nextCursor = bookmarks.get(bookmarks.size() - 1).getId();
        boolean hasNext = bookmarkRepository.existsByUserIdAndIdLessThan(userId, nextCursor);

        return new ScrollResponse<>(
                bookmarks,
                new CursorPageMetaInfo(nextCursor, hasNext)
        );
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
            throw new IllegalStateException("비활성화된 사용자입니다.");
        }
    }
}
