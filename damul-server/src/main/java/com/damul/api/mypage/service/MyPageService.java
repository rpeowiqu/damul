package com.damul.api.mypage.service;

import com.damul.api.auth.entity.User;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.mypage.dto.response.*;
import com.damul.api.recipe.dto.response.RecipeList;
import com.damul.api.user.dto.response.FollowResponse;

import java.util.List;

public interface MyPageService {

    ProfileHeaderDetail getProfileHeader(int userId, User currentUser);

    ProfileDetail getProfileDetail(int userId, User currentUser);

    FollowResponse getFollowStatus(int targetUserId, int currentUserId);

    List<BadgeList> getUserBadges(int userId, User currentUser);

    BadgeDetail getBadgeDetail(int userId, int badgeId, User currentUser);

    ScrollResponse<MyRecipeList> getMyRecipes(int userId, int cursor, int size, User currentUser);

    ScrollResponse<RecipeList> getBookmarkedRecipes(int userId, int cursor, int size, User currentUser);

}
