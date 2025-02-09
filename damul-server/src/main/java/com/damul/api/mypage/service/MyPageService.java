package com.damul.api.mypage.service;

import com.damul.api.auth.entity.User;
import com.damul.api.mypage.dto.response.ProfileHeaderDetail;

public interface MyPageService {

    ProfileHeaderDetail getProfileHeader(int userId, User currentUser);

}
