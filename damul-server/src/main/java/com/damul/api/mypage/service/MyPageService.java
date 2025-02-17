package com.damul.api.mypage.service;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.auth.entity.User;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.mypage.dto.response.*;
import com.damul.api.recipe.dto.response.RecipeList;
import com.damul.api.user.dto.response.FollowResponse;

import java.util.List;

public interface MyPageService {

    ProfileHeaderDetail getProfileHeader(int userId, UserInfo currentUser);

    ProfileDetail getProfileDetail(int userId, UserInfo currentUser);

    FollowResponse getFollowStatus(int targetUserId, int currentUserId);

    List<BadgeList> getUserBadges(int userId, UserInfo currentUser);

    BadgeDetail getBadgeDetail(int userId, int badgeId, UserInfo currentUser);

    ScrollResponse<RecipeList> getMyRecipes(int userId, int cursor, int size, UserInfo currentUser);

    ScrollResponse<RecipeList> getBookmarkedRecipes(int userId, int cursor, int size, UserInfo currentUser);

}
