package com.damul.api.user.service;

import com.damul.api.auth.entity.User;
import com.damul.api.user.dto.response.FollowResponse;
import com.damul.api.user.entity.Follow;
import com.damul.api.user.repository.FollowRepository;
import com.damul.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class FollowServiceImpl implements FollowService {
    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public FollowResponse toggleFollow(int userId, int targetId) {
        log.info("팔로우/언팔로우 시작");
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("현재 유저가 존재하지 않습니다."));
        User targetUser = userRepository.findById(targetId)
                .orElseThrow(() -> new RuntimeException(("타겟 유저가 존재하지 않습니다.")));

        Optional<Follow> existingFollow = followRepository.findByFollowerAndFollowing(currentUser, targetUser);
        if(existingFollow.isPresent()) {
            log.info("팔로우 중입니다, 언팔로우 합니다.");
            followRepository.delete(existingFollow.get());
            return new FollowResponse(false);
        } else {
            log.info("언팔로우 중입니다. 팔로우 합니다.");
            // 팔로우 처리
            Follow newFollow = Follow.builder()
                    .follower(currentUser)
                    .following(targetUser)
                    .createdAt(LocalDateTime.now())
                    .build();
            followRepository.save(newFollow);
            return new FollowResponse(true);
        }
    }
}
