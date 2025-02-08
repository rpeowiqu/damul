package com.damul.api.post.service;


import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.common.scroll.dto.request.ScrollRequest;
import com.damul.api.common.scroll.dto.response.CreateResponse;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.common.scroll.util.ScrollUtil;
import com.damul.api.post.dto.PostStatus;
import com.damul.api.post.dto.request.PostRequest;
import com.damul.api.post.dto.response.PostDetail;
import com.damul.api.post.dto.response.PostList;
import com.damul.api.post.entity.Post;
import com.damul.api.post.repository.PostRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class PostServiceImpl implements PostService {

    private final RedisTemplate<String, String> redisTemplate;
    private static final String VIEW_COUNT_KEY = "recipe:view";
    private static final long REDIS_DATA_EXPIRE_TIME = 60 * 60 * 24; // 24시간

    private final PostRepository postRepository;


    // 게시글 전체 조회/검색
    @Override
    public ScrollResponse getPosts(ScrollRequest scrollRequest, String searchType, String keyword, String status, String orderBy) {

        List<PostList> posts = List.of();
        List<PostStatus> allStatus = new ArrayList<PostStatus>(Arrays.asList(PostStatus.ACTIVE, PostStatus.COMPLETED));
        List<PostStatus> activeStatus = new ArrayList<PostStatus>(Arrays.asList(PostStatus.ACTIVE));

        log.debug("Posts search");
        log.debug("Parameters: cursorId={}, size={}, searchType={}, keyword={}, status={}, orderBy={}", scrollRequest.getCursorId(),
                scrollRequest.getSize(), searchType, keyword, status, orderBy);

        // 검색어가 있는데 검색 타입이 없는 경우 예외 처리
        if (keyword != null && searchType == null) {
            log.error("검색어는 존재, 검색타입 없음");
            throw new BusinessException(ErrorCode.SEARCHTYPE_NOT_FOUND);
        }

        // 전체 조회 검색 x
        if (searchType == null) {
            // 정렬 x
            if (orderBy == null) {
                // 활성화 x
                if (status == null) {
                    log.info("검색x 정렬x 활성화x");
                    posts = postRepository.findAllPosts(
                            allStatus, scrollRequest.getCursorId(), scrollRequest.getSize() + 1
                    );
                }
                // 활성화 o
                else if (status.equals("active")) {
                    log.info("검색x 정렬x 활성화o");
                    posts = postRepository.findAllPosts(
                            activeStatus, scrollRequest.getCursorId(), scrollRequest.getSize() + 1
                    );
                }
            }
            // 정렬 o
            else {
                // 활성화 x
                if (status == null) {
                    log.info("검색x 정렬o 활성화x");
                    posts = postRepository.findAllWithOrder(
                            allStatus, scrollRequest.getCursorId(), scrollRequest.getSize() + 1, orderBy
                    );
                }
                // 활성화 o
                else if (status.equals("active")) {
                    log.info("검색x 정렬o 활성화o");
                    posts = postRepository.findAllWithOrder(
                            activeStatus, scrollRequest.getCursorId(), scrollRequest.getSize() + 1, orderBy
                    );
                }
            }
        }
        // 전체 조회 검색 o
        else {
            // 정렬 x
            if (orderBy == null) {
                // 활성화 x
                if (status == null) {
                    log.info("검색o 정렬x 활성화x");
                    posts = postRepository.findBySearch(
                            allStatus, scrollRequest.getCursorId(), scrollRequest.getSize() + 1, searchType, keyword
                    );
                }
                // 활성화 o
                else if (status.equals("active")) {
                    log.info("검색o 정렬x 활성화o");
                    posts = postRepository.findBySearch(
                            activeStatus, scrollRequest.getCursorId(), scrollRequest.getSize() + 1, searchType, keyword
                    );
                }
            }
            // 정렬 o
            else {
                // 활성화 x
                if (status == null) {
                    log.info("검색o 정렬o 활성화x");
                    posts = postRepository.findBySearchWithOrder(
                            allStatus, scrollRequest.getCursorId(), scrollRequest.getSize() + 1, orderBy, searchType, keyword
                    );
                }
                // 활성화 o
                else if (status.equals("active")) {
                    log.info("검색o 정렬o 활성화o");
                    posts = postRepository.findBySearchWithOrder(
                            activeStatus, scrollRequest.getCursorId(), scrollRequest.getSize() + 1, orderBy, searchType, keyword
                    );
                }
            }
        }

        if (posts.size() > scrollRequest.getSize()) {
            posts = posts.subList(0, scrollRequest.getSize());
        }

        if (posts.isEmpty()) {
            log.debug("No posts found in JPA query result");
        } else {
            log.debug("Found {} posts in JPA query", posts.size());
            log.debug("First posts data: id={}, title={}, userId={}",
                    posts.get(0).getId(),
                    posts.get(0).getTitle(),
                    posts.get(0).getAuthorId());
        }

        return ScrollUtil.createScrollResponse(posts, scrollRequest);
    }

    // 게시글 상세조회
    @Override
    @Transactional
    public PostDetail getPostDetail(int postId, UserInfo userInfo) {
        int userId = checkUserInfo(userInfo);
        log.info("게시글 상세조회 및 조회수 증가 - postId: {}, userId: {}", postId, userInfo.getId());
        if(userId == 0) {
            log.error("UserInfo Id값 조회 불가 - userId: {}", userId);
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }

        // Redis에서 조회수 확인 및 증가
        String redisKey = VIEW_COUNT_KEY + postId;
        String userViewKey = VIEW_COUNT_KEY + postId + ":user:" + userId;
        ValueOperations<String, String> ops = redisTemplate.opsForValue();

        // Redis에 해당 키가 없으면 DB에서 조회수를 가져와서 설정
        if (!Boolean.TRUE.equals(redisTemplate.hasKey(redisKey))) {
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.BOARD_NOT_FOUND));
            ops.set(redisKey, String.valueOf(post.getViewCnt()));
            redisTemplate.expire(redisKey, REDIS_DATA_EXPIRE_TIME, TimeUnit.SECONDS);
        }

        // 사용자별 중복 조회 방지
        Boolean alreadyViewed = redisTemplate.opsForValue().setIfAbsent(
                userViewKey,
                "viewed",
                Duration.ofDays(1) // 1일 동안만 유효
        );

        // 처음 조회하는 경우에만 조회수 증가
        Long newViewCount = null;
        if (Boolean.TRUE.equals(alreadyViewed)) {
            newViewCount = ops.increment(redisKey);
            // 즉시 데이터베이스 업데이트 (소규모 서비스에 적합)
            postRepository.updateViewCount(postId, newViewCount.intValue());
            log.info("조회수 증가 - newViewCount: {}", newViewCount);
        }

        // 게시글 정보 조회
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.BOARD_NOT_FOUND));

        // 채팅방 정보 확인 (참여중 or 인원수(미참여))


        // 댓글 목록 조회

        // PostDetail 객체 생성 및 반환
        return PostDetail.builder()

    }


    // 게시글 작성
    @Override
    public void addPost(PostRequest postRequest, MultipartFile thumbnailImage) {

    }

    // 게시글 수정
    @Override
    public void updatePost(PostRequest postRequest, MultipartFile thumbnailImage) {

    }

    // 게시글 삭제
    @Override
    public void deletePost(int postId) {
        log.info("게시글 삭제 시작 - postI: {}", postId);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.BOARD_NOT_FOUND));
        postRepository.delete(post);
        log.info("게시글 삭제 완료");
    }

    // 댓글 작성
    @Override
    public CreateResponse addPostComment () {

    }

    // 게시글 현황 변경
    @Override
    public void changePostStatus() {

    }

    // 유저 조회
    private int checkUserInfo(UserInfo userInfo) { return userInfo != null ? userInfo.getId() : 0; }

    // 이미지 유효성 검사 메서드
    private void validateImageFile(MultipartFile file) {
        // 파일 크기 제한 (예: 10MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            log.error("파일 사이즈 ERROR - fileSize: {}", file.getSize());
            throw new BusinessException(ErrorCode.FILE_SIZE_EXCEEDED);
        }

        // 파일 이름에서 확장자 추출
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new BusinessException(ErrorCode.INVALID_FILE_TYPE);
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
        List<String> allowedExtensions = List.of("jpg", "jpeg", "png", "gif", "bmp", "webp");

        if (!allowedExtensions.contains(extension)) {
            throw new BusinessException(ErrorCode.INVALID_FILE_TYPE);
        }
    }

}
