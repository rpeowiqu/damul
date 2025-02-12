package com.damul.api.user.service;

import com.damul.api.auth.entity.User;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.common.scroll.util.ScrollUtil;
import com.damul.api.user.dto.response.FollowResponse;
import com.damul.api.user.dto.response.UserList;
import com.damul.api.user.entity.Follow;
import com.damul.api.user.repository.FollowRepository;
import com.damul.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
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

        // 자기 자신을 팔로우 하는 경우 체크
        if(userId == targetId) {
            log.error("자기 자신을 팔로우 할 수 없습니다.");
            throw new BusinessException(ErrorCode.INVALID_TARGET_ID);
        }

        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_FORBIDDEN));
        User targetUser = userRepository.findById(targetId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_FORBIDDEN));

        try {
            Optional<Follow> existingFollow = followRepository.findByFollowerAndFollowing(currentUser, targetUser);

            if(existingFollow.isPresent()) {
                log.info("팔로우 중입니다, 언팔로우 합니다.");
                followRepository.delete(existingFollow.get());
                return new FollowResponse(false);
            } else {
                log.info("언팔로우 중입니다. 팔로우 합니다.");
                Follow newFollow = Follow.builder()
                        .follower(currentUser)
                        .following(targetUser)
                        .createdAt(LocalDateTime.now())
                        .build();
                followRepository.save(newFollow);
                return new FollowResponse(true);
            }
        } catch (DataIntegrityViolationException e) {
            log.error("팔로우 처리 중 데이터베이스 제약조건 위반", e);
            throw new BusinessException(ErrorCode.DATABASE_ERROR, "팔로우 처리 중 데이터베이스 오류가 발생했습니다.");
        } catch (DataAccessException e) {
            log.error("팔로우 처리 중 데이터베이스 오류", e);
            throw new BusinessException(ErrorCode.DATABASE_ERROR, "팔로우 처리 중 데이터베이스 오류가 발생했습니다.");
        }
    }

    @Override
    public ScrollResponse<UserList> getFollowers(String keyword, int cursor, int size, int followingId ) {
        log.info("팔로워 목록 조회 시작");
        List<UserList> userList = null;
        Pageable pageable = PageRequest.of(0, size + 1);

        if(keywordIsNull(keyword)) {
            log.info("검색할 닉네임 없음, 전체 조회");
            userList = followRepository.findFollowersByUserIdAndCursorId(
                    followingId,
                    cursor,
                    pageable
            );
        } else {
            log.info("검색할 닉네임 - keyword: {}", keyword);

            String exactMatch = keyword; // 정확히 일치하는 경우
            String startsWith = keyword + "%"; // 검색어로 시작하는 경우
            String contains = "%" + keyword + "%"; // 검색어가 포함된 경우

            userList = followRepository.findFollowerByUserIdAndCursorIdAndNickname(
                    followingId,
                    contains,
                    exactMatch,
                    startsWith,
                    cursor,
                    pageable
            );
        }

        // 마지막 하나를 더 조회했으므로 size보다 큰 경우 다음 데이터가 있다는 의미
        if (userList.size() > size) {
            userList = userList.subList(0, size);
        }

        log.info("팔로워 목록 조회 완료");
        return ScrollUtil.createScrollResponse(userList, cursor, size);
    }

    @Override
    public ScrollResponse<UserList> getFollowings(String keyword, int cursor, int size, int followerId) {
        log.info("팔로잉 목록 조회 시작");
        Pageable pageable = PageRequest.of(0, size + 1);
        List<UserList> userList = null;

        if(keywordIsNull(keyword)) {
            log.info("검색할 닉네임 없음, 전체 조회 - keyword: {}", keyword);
            userList = followRepository.findFollowingsByUserIdAndCursorId(
                    followerId,
                    cursor,
                    pageable
            );
        } else {
            log.info("검색할 닉네임 - keyword: {}", keyword);
            String exactMatch = keyword; // 정확히 일치하는 경우
            String startsWith = keyword + "%"; // 검색어로 시작하는 경우
            String contains = "%" + keyword + "%"; // 검색어가 포함된 경우

            userList = followRepository.findFollowingsByUserIdAndCursorIdAndNickname(
                    followerId,
                    contains,
                    exactMatch,
                    startsWith,
                    cursor,
                    pageable
            );
        }


        if (userList.size() > size) {
            userList = userList.subList(0, size);
        }
        log.info("팔로잉 목록 조회 완료");
        return ScrollUtil.createScrollResponse(userList, cursor, size);
    }

    // 팔로워 강제 삭제
    @Override
    public void deleteFollower(int followingId, int followerId) {
        log.info("팔로워 강제 삭제 시작 - userId: {}, followId: {}", followingId, followerId);
        // followingId: 팔로우 당하는 사람 (나)
        // followerId: 팔로우 하는 사람 (삭제하고 싶은 팔로워)
        Follow follow = followRepository.findByFollower_IdAndFollowing_Id(followerId, followingId)
                .orElseThrow(() -> {
                    log.error("팔로우 관계가 존재하지 않습니다. followingId: {}, followerId: {}", followingId, followerId);
                    return new BusinessException(ErrorCode.FOLLOW_NOT_FOUND);
                });

        followRepository.delete(follow);
        log.info("팔로워 강제 삭제 성공 - followingId: {}, followerId: {}", followingId, followerId);
    }


    private boolean keywordIsNull(String keyword) { return keyword == null || keyword.isEmpty(); }
}
