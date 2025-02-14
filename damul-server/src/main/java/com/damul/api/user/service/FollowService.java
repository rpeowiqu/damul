package com.damul.api.user.service;

import com.damul.api.common.scroll.dto.request.ScrollRequest;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.user.dto.response.FollowList;
import com.damul.api.user.dto.response.FollowResponse;
import com.damul.api.user.dto.response.UserList;

public interface FollowService {
    FollowResponse toggleFollow(int userId, int targetId);

    // 팔로워 목록 조회
    ScrollResponse<FollowList> getFollowers(String keyword, int cursorId, int size, int userId);

    // 팔로잉 목록 조회
    ScrollResponse<FollowList> getFollowings(String keyword, int cursorId, int size, int userId);

    // 팔로워 삭제
    void deleteFollower(int userId, int followId);
}
