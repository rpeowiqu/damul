package com.damul.api.post.repository;

import com.damul.api.post.dto.response.PostList;
import com.damul.api.post.entity.Post;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Integer> {

    // 기본 조회 (검색 x, 정렬 x, 활성화ox)
    @Query("""
            SELECT new com.damul.api.post.dto.response.PostList(
                        p.postId, p.title, p.thumbnailUrl, p.content, 
                        p.createdAt, p.user.id, p.user.nickname, p.postStatus
                        )
            FROM Post p
            JOIN p.user u
            WHERE p.postStatus IN :statuses
            AND (:cursorId = 0 OR p.postId < :cursorId)
            ORDER BY p.postId DESC
            LIMIT :size
            """)
    List<PostList> findAllPosts(
            @Param("statuses") List<String> statuses,
            @Param("cursorId") int cursorId,
            @Param("size") int size
    );

    // 검색 (검색 o, 정렬 x, 활성화ox)
    @Query("""
            SELECT new com.damul.api.post.dto.response.PostList(
                p.postId, p.title, p.thumbnailUrl, p.content, 
                p.createdAt, p.user.id, p.user.nickname, p.postStatus)
            FROM Post p
            JOIN p.user u
            WHERE p.postStatus IN :statuses
            AND (:cursorId = 0 OR p.postId < :cursorId)
            AND (:searchType = 'author' AND u.nickname LIKE %:keyword%
                OR :searchType = 'content' AND (p.title LIKE %:keyword% OR p.content LIKE %:keyword%))
            ORDER BY p.postId DESC
            LIMIT :size
            """)
    List<PostList> findBySearch(
            @Param("statuses") List<String> statuses,
            @Param("cursorId") int cursorId,
            @Param("size") int size,
            @Param("searchType") String searchType,
            @Param("keyword") String keyword
    );

    // 검색 (검색 x, 정렬 o, 활성화ox)
    @Query("""
            SELECT new com.damul.api.post.dto.response.PostList(
                p.postId, p.title, p.thumbnailUrl, p.content, 
                p.createdAt, p.user.id, p.user.nickname, p.postStatus)
            FROM Post p
            JOIN p.user u
            LEFT JOIN Post prev ON prev.postId = :cursorId
            WHERE p.postStatus IN :statuses
            AND :cursorId = 0 OR
                (:orderBy = 'views' AND (p.viewCnt < prev.viewCnt OR (p.viewCnt = prev.viewCnt AND p.postId < prev.postId)))
            ORDER BY
            CASE
                WHEN :orderBy = 'views' THEN p.viewCnt
                ELSE p.postId
            END DESC,
            p.postId DESC
            LIMIT :size
            """)
    List<PostList> findAllWithOrder(
            @Param("statuses") List<String> statuses,
            @Param("size") int size,
            @Param("orderBy") String orderBy
    );

    // 검색 (검색 o, 정렬 o, 활성화ox)
    @Query("""
            SELECT new com.damul.api.post.dto.response.PostList(
                p.postId, p.title, p.thumbnailUrl, p.content, 
                p.createdAt, p.user.id, p.user.nickname, p.postStatus)
            FROM Post p
            JOIN p.user u
            LEFT JOIN Post prev ON prev.postId = :cursorId
            WHERE p.postStatus IN :statuses
            AND (:cursorId = 0 OR
                (:orderBy = 'views' AND (p.viewCnt < prev.viewCnt OR (p.viewCnt = prev.viewCnt AND p.postId < prev.postId))))
            AND (:searchType = 'author' AND u.nickname LIKE %:keyword%
                OR :searchType = 'content' AND (p.title LIKE %:keyword% OR p.content LIKE %:keyword%))
            ORDER BY
            CASE
                WHEN :orderBy = 'views' THEN p.viewCnt
                ELSE p.postId
            END DESC,
            p.postId DESC
            LIMIT :size
            """)
    List<PostList> findBySearchWithOrder(
            @Param("statuses") List<String> statuses,
            @Param("cursorId") int cursorId,
            @Param("size") int size,
            @Param("searchType") String searchType,
            @Param("keyword") String keyword,
            @Param("orderBy") String orderBy
    );

}
