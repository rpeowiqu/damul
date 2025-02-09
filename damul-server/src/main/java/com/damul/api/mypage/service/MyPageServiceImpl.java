package com.damul.api.mypage.service;

import com.damul.api.auth.entity.User;
import com.damul.api.auth.entity.type.AccessRange;
import com.damul.api.mypage.dto.response.ProfileHeaderDetail;
import com.damul.api.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class MyPageServiceImpl implements MyPageService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public ProfileHeaderDetail getProfileHeader(int userId, User currentUser) {
        log.info("서비스: 마이페이지 헤더 조회 시작 - userId: {}", userId);

        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 사용자입니다."));

        validateAccessPermission(targetUser, currentUser);

        log.info("서비스: 마이페이지 헤더 조회 완료 - userId: {}", userId);

        return ProfileHeaderDetail.from(targetUser);
    }

    private void validateAccessPermission(User targetUser, User currentUser) {
        if (!targetUser.isActive()) {
            throw new IllegalStateException("비활성화된 사용자입니다.");
        }

        if (targetUser.getAccessRange() == AccessRange.PRIVATE
                && (targetUser.getId() != currentUser.getId())) {
            throw new IllegalStateException("비공개 프로필입니다.");
        }
    }
}
