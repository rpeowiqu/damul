package com.damul.api.mypage.repository;

import com.damul.api.mypage.dto.response.MyBookmarkList;
import com.damul.api.mypage.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Integer> {
    @Query("""
        SELECT new com.damul.api.mypage.dto.response.MyBookmarkList(
            b.id,
            b.recipe.id,
            b.recipe.title,
            b.recipe.thumbnailUrl,
            b.recipe.content,
            b.recipe.createdAt,
            b.recipe.user.id,
            b.recipe.user.nickname,
            b.recipe.viewCnt,
            b.recipe.likeCnt,
            true,
            CASE WHEN l.id IS NOT NULL THEN true ELSE false END
        )
        FROM Bookmark b
        LEFT JOIN RecipeLike l ON l.recipe.id = b.recipe.id AND l.user.id = :userId
        WHERE b.user.id = :userId
        AND b.recipe.deleted = false
        AND (:cursor = 0 OR 
            CASE :sortType 
                WHEN 'created_at' THEN (
                    b.recipe.createdAt < (SELECT bb.recipe.createdAt FROM Bookmark bb WHERE bb.id = :cursor) OR 
                    (b.recipe.createdAt = (SELECT bb.recipe.createdAt FROM Bookmark bb WHERE bb.id = :cursor) AND b.id < :cursor)
                )
                WHEN 'view_cnt' THEN (
                    b.recipe.viewCnt < (SELECT bb.recipe.viewCnt FROM Bookmark bb WHERE bb.id = :cursor) OR 
                    (b.recipe.viewCnt = (SELECT bb.recipe.viewCnt FROM Bookmark bb WHERE bb.id = :cursor) AND b.id < :cursor)
                )
                WHEN 'like_cnt' THEN (
                    b.recipe.likeCnt < (SELECT bb.recipe.likeCnt FROM Bookmark bb WHERE bb.id = :cursor) OR 
                    (b.recipe.likeCnt = (SELECT bb.recipe.likeCnt FROM Bookmark bb WHERE bb.id = :cursor) AND b.id < :cursor)
                )
                ELSE b.id < :cursor
            END)
        ORDER BY 
        CASE :sortType 
            WHEN 'created_at' THEN b.recipe.createdAt
            ELSE NULL
        END DESC,
        CASE :sortType
            WHEN 'view_cnt' THEN b.recipe.viewCnt
            ELSE 0
        END DESC,
        CASE :sortType
            WHEN 'like_cnt' THEN b.recipe.likeCnt
            ELSE 0
        END DESC,
        b.id DESC
        LIMIT :size
    """)
    List<MyBookmarkList> findBookmarkedRecipes(
            @Param("userId") int userId,
            @Param("cursor") int cursor,
            @Param("size") int size,
            @Param("sortType") String sortType
    );

    boolean existsByUserIdAndIdLessThan(int userId, int id);
}