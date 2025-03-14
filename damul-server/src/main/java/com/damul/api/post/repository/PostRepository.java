package com.damul.api.post.repository;

import com.damul.api.post.dto.PostStatus;
import com.damul.api.post.dto.response.PostList;
import com.damul.api.post.entity.Post;
import org.springframework.data.repository.query.Param;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {
    // 채팅방 정보도 받아와야 함!!

    // 기본 조회 (검색 x, 정렬 x, 활성화ox)
    @Query("""
            SELECT DISTINCT new com.damul.api.post.dto.response.PostList(
                        p.postId, p.title, p.thumbnailUrl, p.content, 
                        p.createdAt, p.user.id, p.user.nickname, p.status, p.viewCnt)
            FROM Post p
            JOIN p.user u
            WHERE p.status IN :statuses
            AND (:cursor = 0 OR p.postId < :cursor)
            ORDER BY p.postId DESC
            """)
    List<PostList> findAllPosts(
            @Param("statuses") List<PostStatus> statuses,
            @Param("cursor") int cursor,
            Pageable pageable

    );

    // 검색 (검색 x, 정렬 o, 활성화ox)
    @Query("""
            SELECT new com.damul.api.post.dto.response.PostList(
                p.postId, p.title, p.thumbnailUrl, p.content, 
                p.createdAt, p.user.id, p.user.nickname, p.status, p.viewCnt)
            FROM Post p
            JOIN p.user u
            LEFT JOIN Post prev ON prev.postId = :cursor
            WHERE p.status IN :statuses
            AND (:cursor = 0 OR
                ((:orderBy = 'views' AND (p.viewCnt < prev.viewCnt OR (p.viewCnt = prev.viewCnt AND p.postId < prev.postId)))
                OR (:orderBy = 'latest' AND p.postId < :cursor)))
            ORDER BY
            CASE
                WHEN :orderBy = 'views' THEN p.viewCnt
                ELSE p.postId
            END DESC,
            p.postId DESC
            """)
    List<PostList> findAllWithOrder(
            @Param("statuses") List<PostStatus> statuses,
            @Param("cursor") int cursor,
            Pageable pageable,
            @Param("orderBy") String orderBy
    );

    // 검색 (검색 o, 정렬 o, 활성화ox)
    @Query("""
            SELECT new com.damul.api.post.dto.response.PostList(
                p.postId, p.title, p.thumbnailUrl, p.content,
                p.createdAt, p.user.id, p.user.nickname, p.status, p.viewCnt)
            FROM Post p
            JOIN p.user u
            LEFT JOIN Post prev ON prev.postId = :cursor
            WHERE p.status IN :statuses
            AND (:cursor = 0 OR
                ((:orderBy = 'views' AND (p.viewCnt < prev.viewCnt OR (p.viewCnt = prev.viewCnt AND p.postId < prev.postId)))
                OR (:orderBy = 'latest' AND p.postId < :cursor)))
            AND ((:searchType = 'author' AND u.nickname LIKE %:keyword%)
                OR :searchType = 'content' AND (p.title LIKE %:keyword% OR p.content LIKE %:keyword%))
            ORDER BY
            CASE
                WHEN :orderBy = 'views' THEN p.viewCnt
                ELSE p.postId
            END DESC,
            p.postId DESC
            """)
    List<PostList> findBySearchWithOrder(
            @Param("statuses") List<PostStatus> statuses,
            @Param("cursor") int cursor,
            Pageable pageable,
            @Param("searchType") String searchType,
            @Param("keyword") String keyword,
            @Param("orderBy") String orderBy
    );

    // 게시글 상세조회 시 조회수증가
    @Modifying
    @Transactional
    @Query("UPDATE Post p SET p.viewCnt = :viewCount WHERE p.postId = :postId")
    void updateViewCount(@Param("postId") int postId, @Param("viewCount") int viewCount);

    // deleted되지 않은 post 조회
    Optional<Post> findByPostIdAndStatusNot(int postId, PostStatus postStatus);

    int countByUser_IdAndStatus(Integer userId, PostStatus status);
}
