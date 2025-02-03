package com.damul.api.user.service;

import com.damul.api.auth.entity.User;
import com.damul.api.common.dto.request.ScrollRequest;
import com.damul.api.common.dto.response.CursorPageMetaInfo;
import com.damul.api.common.dto.response.ScrollResponse;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.user.dto.response.FollowResponse;
import com.damul.api.user.dto.response.UserList;
import com.damul.api.user.entity.Follow;
import com.damul.api.user.repository.FollowRepository;
import com.damul.api.user.repository.UserRepository;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
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
            throw new BusinessException(ErrorCode.INVALED_TARGETID);
        }

        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        User targetUser = userRepository.findById(targetId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

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
            // ErrorCode에 DATABASE_ERROR 추가 필요
            throw new BusinessException(ErrorCode.DATABASE_ERROR, "팔로우 처리 중 데이터베이스 오류가 발생했습니다.");
        } catch (DataAccessException e) {
            log.error("팔로우 처리 중 데이터베이스 오류", e);
            throw new BusinessException(ErrorCode.DATABASE_ERROR, "팔로우 처리 중 데이터베이스 오류가 발생했습니다.");
        }
    }

    @Override
    public ScrollResponse<UserList> getFollowers(ScrollRequest request, int userId) {
        log.info("팔로워 목록 조회 시작");
        List<UserList> userLists = followRepository.findFollowersByUserIdAndCursorId(
                userId,
                request.getCursorId(),
                request.getSize() + 1
        );
        return createScrollResponse(userLists, request);
    }

    @Override
    public ScrollResponse<UserList> getFollowings(ScrollRequest request, int userId) {
        log.info("팔로잉 목록 조회 시작");
        List<UserList> userLists = followRepository.findFollowingsByUserIdAndCursorId(
                userId,
                request.getCursorId(),
                request.getSize() + 1
        );
        return createScrollResponse(userLists, request);
    }

    // 무한스크롤 응답 데이터를 생성
    private ScrollResponse<UserList> createScrollResponse(List<UserList> userLists, ScrollRequest request) {
        log.info("무한 스크롤 생성 시작");
        // 다음 페이지 존재 여부 확인
        // size + 1개를 조회했으므로, size보다 크다면 다음 데이터가 존재한다는 의미
        boolean hasNextData = userLists.size() > request.getSize();

        log.info("다음 데이터 존재 여부: {}", hasNextData);
        // 실제 응답할 데이터 리스트 생성
        // 다음 데이터가 있다면 요청한 size만큼만 잘라서 반환, 없다면 전체 리스트 반환
        List<UserList> resultList = hasNextData
                ? userLists.subList(0, request.getSize())
                : userLists;


        // 다음 커서 값 계산
        // 결과 리스트가 비어있지 않다면 마지막 항목의 userId를 다음 커서 값으로 사용
        // 비어있다면 현재 커서값 유지
        int nextCursor = !resultList.isEmpty()
                ? resultList.get(resultList.size() - 1).getUserId()
                : request.getCursorId();


        // 최종 스크롤 응답 생성 및 반환
        return new ScrollResponse<>(
                resultList,
                new CursorPageMetaInfo(nextCursor, hasNextData)
        );
    }
}
