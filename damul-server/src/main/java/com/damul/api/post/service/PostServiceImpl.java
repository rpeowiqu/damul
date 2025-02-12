package com.damul.api.post.service;


import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.auth.entity.User;
import com.damul.api.chat.entity.ChatRoom;
import com.damul.api.chat.repository.ChatRoomRepository;
import com.damul.api.chat.service.ChatRoomService;
import com.damul.api.common.comment.CommentCreate;
import com.damul.api.common.dto.response.CreateResponse;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.common.scroll.util.ScrollUtil;
import com.damul.api.config.service.S3Service;
import com.damul.api.post.dto.PostStatus;
import com.damul.api.post.dto.request.PostRequest;
import com.damul.api.post.dto.response.CommentList;
import com.damul.api.post.dto.response.PostDetail;
import com.damul.api.post.dto.response.PostList;
import com.damul.api.post.entity.Post;
import com.damul.api.post.entity.PostComment;
import com.damul.api.post.repository.PostCommentRepository;
import com.damul.api.post.repository.PostRepository;
import com.damul.api.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final RedisTemplate<String, String> redisTemplate;
    private static final String VIEW_COUNT_KEY = "post:view";
    private static final long REDIS_DATA_EXPIRE_TIME = 60 * 60 * 24; // 24시간

    private final PostRepository postRepository;
    private final PostCommentRepository postCommentRepository;
    private final UserRepository userRepository;
    private final ChatRoomRepository chatRoomRepository;

    private final S3Service s3Service;
    private final ChatRoomService chatRoomService;


    // 게시글 전체 조회/검색
    @Override
    public ScrollResponse getPosts(UserInfo userInfo, int cursor, int size, String searchType, String keyword, String status, String orderBy) {

        log.info("Posts search start");
        log.info("Parameters: cursor={}, size={}, searchType={}, keyword={}, status={}, orderBy={}",
                cursor, size, searchType, keyword, status, orderBy);

        List<PostList> posts = List.of();
        List<PostStatus> allStatus = new ArrayList<PostStatus>(Arrays.asList(PostStatus.ACTIVE, PostStatus.COMPLETED));
        List<PostStatus> activeStatus = new ArrayList<PostStatus>(Arrays.asList(PostStatus.ACTIVE));

        Pageable pageable = PageRequest.of(0, size + 1);

        // 검색어가 있는데 검색 타입이 없는 경우 예외 처리
        if (keyword != null && searchType == null) {
            log.error("검색어는 존재, 검색타입 없음");
            throw new BusinessException(ErrorCode.BOARD_NOT_FOUND);
        }

        // 전체 조회 검색 x
        if (searchType == null) {
//            // 정렬 x
//            if (orderBy == null) {
//                // 활성화 x
//                if (status == null) {
//                    log.info("검색x 정렬x 활성화x");
//                    posts = postRepository.findAllPosts(
//                            allStatus, cursor, pageable
//                    );
//                }
//                // 활성화 o
//                else if (status.equals("active")) {
//                    log.info("검색x 정렬x 활성화o");
//                    posts = postRepository.findAllPosts(
//                            activeStatus, cursor, pageable
//                    );
//                }
//            }
            // 정렬 o
            // 활성화 x
            if (status == null) {
                log.info("검색x 정렬o 활성화x");
                posts = postRepository.findAllWithOrder(
                        allStatus, cursor, pageable, orderBy
                );
            }
            // 활성화 o
            else if (status.equals("active")) {
                log.info("검색x 정렬o 활성화o");
                posts = postRepository.findAllWithOrder(
                        activeStatus, cursor, pageable, orderBy
                );
            }
        }
        // 전체 조회 검색 o
        else {
//            // 정렬 x
//            if (orderBy == null) {
//                // 활성화 x
//                if (status == null) {
//                    log.info("검색o 정렬x 활성화x");
//                    posts = postRepository.findBySearch(
//                            allStatus, cursor, pageable, searchType, keyword
//                    );
//                }
//                // 활성화 o
//                else if (status.equals("active")) {
//                    log.info("검색o 정렬x 활성화o");
//                    posts = postRepository.findBySearch(
//                            activeStatus, cursor, pageable, searchType, keyword
//                    );
//                }
//            }
            // 정렬 o
            // 활성화 x
            if (status == null) {
                log.info("검색o 정렬o 활성화x");
                posts = postRepository.findBySearchWithOrder(
                        allStatus, cursor, pageable, searchType, keyword, orderBy
                );
            }
            // 활성화 o
            else if (status.equals("active")) {
                log.info("검색o 정렬o 활성화o");
                posts = postRepository.findBySearchWithOrder(
                        activeStatus, cursor, pageable, searchType, keyword, orderBy
                );
            }
        }

        if (posts.size() > size) {
            posts = posts.subList(0, size);
        }

        if (posts.isEmpty()) {
            log.info("No posts found in JPA query result");
        } else {
            log.info("Found {} posts in JPA query", posts.size());
            log.info("First posts data: id={}, title={}, userId={} viewCnt={}",
                    posts.get(0).getId(),
                    posts.get(0).getTitle(),
                    posts.get(0).getAuthorId(),
                    posts.get(0).getViewCnt());
        }

        return ScrollUtil.createScrollResponse(posts, cursor, size);
    }

    // 게시글 상세조회
    @Override
    @Transactional
    public PostDetail getPostDetail(int postId, UserInfo userInfo) {
        if (userInfo == null) {
            log.error("userInfo 없음 - userInfo is null");
            throw new BusinessException(ErrorCode.USER_FORBIDDEN);
        }
        int userId = checkUserInfo(userInfo);
        log.info("게시글 상세조회 및 조회수 증가 - postId: {}, userId: {}", postId, userInfo.getId());
        if(userId == 0) {
            log.error("UserInfo Id값 조회 불가 - userId: {}", userId);
            throw new BusinessException(ErrorCode.USER_FORBIDDEN);
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
        Post post = postRepository.findByPostIdAndStatusNot(postId, PostStatus.DELETED)
                .orElseThrow(() -> new BusinessException(ErrorCode.BOARD_NOT_FOUND));


        // 채팅방 정보 조회
        Optional<ChatRoom> chatRoom = chatRoomRepository.findChatRoomByPost_PostId(postId);



        // 댓글 목록 조회
        List<CommentList> comments = postCommentRepository
                .findByPost_PostIdAndIsDeletedFalseOrderByCreatedAtAsc(postId)
                .stream()
                .map(comment -> CommentList.builder()
                        .id(comment.getPostCommentId())
                        .userId(comment.getUser().getId())
                        .nickname(comment.getUser().getNickname())
                        .profileImageUrl(comment.getUser().getProfileImageUrl())
                        .comment(comment.getComment())
                        .parentId(comment.getParentPostComment() != null ? comment.getParentPostComment().getPostCommentId() : null)
                        .createdAt(comment.getCreatedAt())
                        .build())
                .collect(Collectors.toList());


        // PostDetail 객체 생성 및 반환
        return PostDetail.builder()
                .id(post.getPostId())
                .title(post.getTitle())
                .authorId(post.getUser().getId())
                .authorName(post.getUser().getNickname())
                .profileImageUrl(post.getUser().getProfileImageUrl())
                .status(post.getStatus())
                .contentImageUrl(post.getThumbnailUrl())
                .content(post.getContent())
                .createdAt(post.getCreatedAt())
                .viewCnt(post.getViewCnt())
                .currentChatNum(chatRoom.get().getId())
                .chatSize(chatRoom.get().getMemberLimit())
                .comments(comments)
                .build();
    }


    // 게시글 작성
    @Override
    public CreateResponse addPost(UserInfo userInfo, PostRequest postRequest, MultipartFile thumbnailImage) {
        log.info("게시글 작성 시작 - 제목: {}, 내용: {}, 인원수: {}", postRequest.getTitle(), postRequest.getContent(), postRequest.getChatSize());
        // 유저 조회
        if (checkUserInfo(userInfo) == 0) {
            throw new BusinessException(ErrorCode.USER_FORBIDDEN);
        }
        User user = userRepository.findById(userInfo.getId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_FORBIDDEN));

        // 썸네일 업로드 처리
        String thumbnailUrl = null;
        if (thumbnailImage != null && !thumbnailImage.isEmpty()) {
            validateImageFile(thumbnailImage);
            thumbnailUrl = s3Service.uploadFile(thumbnailImage);  // 업로드 후 URL 반환하는 메서드 추가
            log.info("사진 업로드 완료");
        }

        // 게시글 저장
        Post post = Post.builder()
                .user(user)
                .title(postRequest.getTitle())
                .content(postRequest.getContent())
                .thumbnailUrl(thumbnailUrl)
                .build();

        Post savedPost = postRepository.save(post);
        log.info("게시글 작성 완료 - ID: {}", savedPost.getPostId());

        // 채팅방 연결
        chatRoomService.createMultiChatRoomInPost(userInfo.getId(), post, post.getTitle(), postRequest.getChatSize());

        return new CreateResponse(savedPost.getPostId());
    }

    // 게시글 수정
    @Override
    public CreateResponse updatePost(int postId, UserInfo userInfo, PostRequest postRequest, MultipartFile thumbnailImage) {
        log.info("게시글 수정 시작 - 제목: {}, 내용: {}, 인원수: {}", postRequest.getTitle(), postRequest.getContent(), postRequest.getChatSize());
        // 유저 조회
        if (checkUserInfo(userInfo) == 0) {
            throw new BusinessException(ErrorCode.USER_FORBIDDEN);
        }
        User user = userRepository.findById(userInfo.getId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_FORBIDDEN));

        // 게시글 조회 및 작성자 확인
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.BOARD_NOT_FOUND));

        if (post.getUser().getId() != user.getId()) {
            throw new BusinessException(ErrorCode.USER_FORBIDDEN);
        }

        // 썸네일 업데이트 처리
        String thumbnailUrl = post.getThumbnailUrl(); // 기존 썸네일 유지
        if (thumbnailImage != null && !thumbnailImage.isEmpty()) {
            validateImageFile(thumbnailImage);
            thumbnailUrl = s3Service.uploadFile(thumbnailImage);  // 새 썸네일 업로드
            log.info("새로운 썸네일 업로드 완료");
        }

        // 게시글 수정
        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        post.setThumbnailUrl(thumbnailUrl);

        // 채팅방 인원 수정

        Post updatedPost = postRepository.save(post);
        log.info("게시글 수정 완료 - ID: {}", updatedPost.getPostId());

        return new CreateResponse(updatedPost.getPostId());
    }

    // 게시글 삭제
    @Override
    public void deletePost(int postId, UserInfo userInfo) {
        log.info("게시글 삭제 시작 - postI: {}", postId);
        // 유저 조회
        if (checkUserInfo(userInfo) == 0) {
            throw new BusinessException(ErrorCode.USER_FORBIDDEN);
        }
        User user = userRepository.findById(userInfo.getId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_FORBIDDEN));

        // 게시글 조회 및 작성자 확인
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.BOARD_NOT_FOUND));

        if (post.getUser().getId() != user.getId()) {
            throw new BusinessException(ErrorCode.USER_FORBIDDEN);
        }

        // 논리적 삭제
        if (post.getStatus() != PostStatus.DELETED) {
            post.changeStatus(PostStatus.DELETED);
            postRepository.save(post);
            log.info("게시글 삭제 완료");
        }
        else {
            log.info("이미 삭제된 게시글 입니다.");
        }
    }

    // 댓글 작성
    @Override
    public CreateResponse addPostComment (int postId, CommentCreate commentCreate, UserInfo userInfo) {
        log.info("댓글 작성 시작");
        if(commentCreate == null) {
            log.error("commentCreate 존재하지 않음");
            throw new BusinessException(ErrorCode.INVALID_COMMENT);
        }

        User user = userRepository.findById(userInfo.getId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_FORBIDDEN));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.BOARD_NOT_FOUND));

        PostComment parent = null;
        if (commentCreate.getParentId() != 0) {
            parent = postCommentRepository.findById(commentCreate.getParentId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.PARENT_ID_NOT_FOUND));
        }

        PostComment comment = PostComment.builder()
                .post(post)
                .user(user)
                .parentPostComment(parent)
                .comment(commentCreate.getComment())
                .build();

        PostComment savedComment = postCommentRepository.save(comment);
        return new CreateResponse(savedComment.getPostCommentId());
    }

    // 댓글 삭제
    public void deletePostComment(int postId, int commentId, UserInfo userInfo) {
        log.info("댓글 삭제 시작 - postId: {}, commentId: {}", postId, commentId);
        // 유저 조회
        if (checkUserInfo(userInfo) == 0) {
            throw new BusinessException(ErrorCode.USER_FORBIDDEN);
        }
        User user = userRepository.findById(userInfo.getId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_FORBIDDEN));

        // 댓글 조회 및 작성자 확인
        PostComment comment = postCommentRepository.findById(commentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.BOARD_NOT_FOUND));

        if (comment.getUser().getId() != user.getId()) {
            throw new BusinessException(ErrorCode.USER_FORBIDDEN);
        }

        // 논리적 삭제
        if (!comment.isDeleted()) {
            comment.delete();
            postCommentRepository.save(comment);
            log.info("게시글 삭제 완료");
        }
        else {
            log.info("이미 삭제된 댓글 입니다.");
        }
    }

    // 게시글 현황 변경
    @Override
    public boolean changePostStatus(int postId, UserInfo userInfo) {
        log.info("게시글 상태 변경 시작 - postId: {}", postId);

        // 유저 조회
        if (checkUserInfo(userInfo) == 0) {
            throw new BusinessException(ErrorCode.USER_FORBIDDEN);
        }
        User user = userRepository.findById(userInfo.getId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_FORBIDDEN));

        // 게시글 조회 및 작성자 확인
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.BOARD_NOT_FOUND));

        if (post.getUser().getId() != user.getId()) {
            throw new BusinessException(ErrorCode.USER_FORBIDDEN);
        }

        // 게시글 active -> completed
        if (post.getStatus() != PostStatus.DELETED) {
            post.changeStatus(PostStatus.COMPLETED);
            postRepository.save(post);
            log.info("게시글 상태 변경 완료");
        }
        else {
            log.info("이미 삭제된 게시글 입니다.");
        }
        return true;
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
