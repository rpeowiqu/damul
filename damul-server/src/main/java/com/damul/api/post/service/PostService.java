package com.damul.api.post.service;

import com.damul.api.post.dto.response.PostList;
import com.damul.api.post.entity.Post;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostService extends JpaRepository<Post, Integer> {

    // 기본 조회
    @Query("""
            SELECT new com.damul.api.post.dto.response.PostList(
                        p.postId, p.title, p.thumbnailUrl, p.content, 
                        p.createdAt, p.user.id, p.user.nickname, p.postStatus
                        )
            FROM Post p
            JOIN p.user u
            WHERE (p.postStatus = "ACTIVE"
            OR p.postStatus = "COMPLETED")
            AND (:cursorId = 0 OR p.postId < :cursorId)
            ORDER BY p.postId DESC
            LIMIT :size
            """)
    List<PostList> findAllPosts(
            @Param("cursorId") int cursorId,
            @Param("size") int size
    );


}
