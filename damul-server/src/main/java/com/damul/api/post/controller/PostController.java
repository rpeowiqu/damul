package com.damul.api.post.controller;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.common.comment.CommentCreate;
import com.damul.api.common.dto.response.CreateResponse;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.common.user.CurrentUser;
import com.damul.api.post.dto.request.PostRequest;
import com.damul.api.post.dto.response.PostDetail;
import com.damul.api.post.dto.response.PostList;
import com.damul.api.post.repository.PostRepository;
import com.damul.api.post.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final PostRepository postRepository;

    // 게시글 전체 조회/검색
    @GetMapping
    public ResponseEntity<?> getAllPosts(@CurrentUser UserInfo userInfo,
                                         @RequestParam int cursor,
                                         @RequestParam int size,
                                         @RequestParam(required = false) String searchType,
                                         @RequestParam(required = false) String keyword,
                                         @RequestParam(required = false) String status,
                                         @RequestParam(defaultValue = "createdAt") String orderBy) {
            log.info("게시글 목록 검색 시작");
            log.info("Searching posts with searchType: {}, keyword: {}, status: {}, orderBy: {}", searchType, keyword, status, orderBy);

        ScrollResponse<PostList> scrollResponse = postService.getPosts(userInfo, cursor, size, searchType, keyword, status, orderBy);
        if (scrollResponse.getData() == null || scrollResponse.getData().isEmpty()) {
            log.info("게시글 목록 조회 완료 - 데이터 없음");
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(scrollResponse);
    }

    // 게시글 상세조회
    @GetMapping("/{postId}")
    public ResponseEntity<PostDetail> getPostDetail(@PathVariable int postId, @CurrentUser UserInfo userInfo) {
        log.info("게시글 상세 조회 시작");
        PostDetail detail = postService.getPostDetail(postId, userInfo);
        if (detail == null) {
            log.error("게시글 상세 조회 실패 - postId: {}", postId);
            throw new BusinessException(ErrorCode.BOARD_NOT_FOUND);
        }

        return ResponseEntity.ok(detail);
    }

    // 게시글 작성
    @PostMapping
    public ResponseEntity<?> addPost(@CurrentUser UserInfo userInfo,
                                     @RequestPart("postRequest")PostRequest postRequest,
                                     @RequestPart(value = "image", required = false)MultipartFile thumbnailImage) {
        log.info("게시글 작성 시작");
        CreateResponse post = postService.addPost(userInfo, postRequest, thumbnailImage);
        if (post == null) {
            log.error("게시글 작성 실패 - postTitle: {}", postRequest.getTitle());
            throw new BusinessException(ErrorCode.DATABASE_ERROR);
        }

        return ResponseEntity.ok(post);
    }

    // 게시글 수정
    @PutMapping("/{postId}")
    public ResponseEntity<?> updatePost(@PathVariable int postId,
                                        @CurrentUser UserInfo userInfo,
                                        @RequestPart("postRequest") PostRequest postRequest,
                                        @RequestPart(value = "image", required = false) MultipartFile thumbnailImage) {
        postService.updatePost(postId, userInfo, postRequest, thumbnailImage);
        
        log.info("게시글 수정 시작");
        CreateResponse post = postService.updatePost(postId, userInfo, postRequest, thumbnailImage);
        if (post == null) {
            log.error("게시글 수정 실패 - postTitle: {}", postRequest.getTitle());
            throw new BusinessException(ErrorCode.DATABASE_ERROR);
        }

        return ResponseEntity.ok(post);
    }

    // 게시글 삭제
    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable int postId, @CurrentUser UserInfo userInfo) {
        log.info("게시글 삭제 조회 - postId: {}", postId);
        postService.deletePost(postId, userInfo);
        log.info("게시글 삭제 완료");
        return ResponseEntity.ok().build();
    }

    // 댓글 작성
    @PostMapping("/{postId}/comments")
    public ResponseEntity<?> addPostComment(@PathVariable int postId,
                                        @RequestBody CommentCreate comment,
                                        @CurrentUser UserInfo userInfo) {
        log.info("게시글 댓글 작성 - postId: {}, comment: {}", postId, comment);
        CreateResponse createResponse = postService.addPostComment(postId, comment, userInfo);
        log.info("게시글 댓글 작성 완료");

        return ResponseEntity.ok(createResponse);
    }
    
    // 댓글 삭제
    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<?> deletePostComment(@PathVariable("postId") int postId,
                                           @PathVariable("commentId") int commentId,
                                           @CurrentUser UserInfo userInfo) {
        log.info("댓글 삭제 요청 - postId: {}, commentId: {}", postId, commentId);
        postService.deletePostComment(postId, commentId, userInfo);
        log.info("댓글 삭제 완료");
        return ResponseEntity.ok().build();
    }

    // 게시글 현황 변경
    @PutMapping("/{postId}/status")
    public ResponseEntity<?> changePostStatus(@PathVariable int postId,
                                              @CurrentUser UserInfo userInfo) {
        log.info("게시글 현황 변경 시작 - postId: {}", postId);
        boolean status = postService.changePostStatus(postId, userInfo);
        log.info("게시글 현황 변경 완료");
        return ResponseEntity.ok(status);
    }
}
