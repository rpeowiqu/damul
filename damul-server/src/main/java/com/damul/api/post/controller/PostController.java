package com.damul.api.post.controller;

import com.damul.api.post.entity.Post;
import com.damul.api.post.repository.PostRepository;
import com.damul.api.post.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final PostRepository postRepository;

    // 게시글 전체 조회/검색
    @GetMapping
    public ResponseEntity<?> getAllPosts(@RequestParam int cursor,
                                         @RequestParam int size,
                                         @RequestParam(required = false) String searchType,
                                         @RequestParam(required = false) String keyword,
                                         @RequestParam(required = false) String status,
                                         @RequestParam(defaultValue = "createdAt") String orderBy) {
            log.info("게시글 전체 조회/검색 시작");
            log.info("Searching posts with searchType: {}, keyword: {}, status: {}, orderBy: {}", searchType, keyword, status, orderBy);

            List<Post> posts = postService.searchPosts(searchType, keyword, orderBy);
            return ResponseEntity.ok(posts);
    }

    // 게시글 상세조회

    // 게시글 작성

    // 게시글 수정

    // 게시글 삭제

    // 댓글 작성

    // 게시글 현황 변경

}
