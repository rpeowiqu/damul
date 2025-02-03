package com.damul.api.user.service;

import com.damul.api.user.dto.response.FollowResponse;

public interface FollowService {
    FollowResponse toggleFollow(int userId, int targetId);
}
