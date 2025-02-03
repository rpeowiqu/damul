package com.damul.api.user.service;

import com.damul.api.common.dto.request.ScrollRequest;
import com.damul.api.common.dto.response.ScrollResponse;
import com.damul.api.user.dto.response.FollowResponse;
import com.damul.api.user.dto.response.UserList;

public interface FollowService {
    FollowResponse toggleFollow(int userId, int targetId);

    // 팔로워 목록 조회
    ScrollResponse<UserList> getFollowers(ScrollRequest request, int userId);

    // 팔로잉 목록 조회
    ScrollResponse<UserList> getFollowings(ScrollRequest request, int userId);
}
