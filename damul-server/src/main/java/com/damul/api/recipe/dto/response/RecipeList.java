package com.damul.api.recipe.dto.response;

import com.damul.api.common.scroll.util.ScrollCursor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
public class RecipeList implements ScrollCursor {
    private int id;
    private String title;
    private String thumbnailUrl;
    private String content;
    private LocalDateTime createdAt;
    private int userId;
    private String nickname;
    private int viewCnt;
    private int likeCnt;
    private boolean bookmarked;
    private boolean liked;

    @Override
    public int getId() {
        return this.id;
    }

    // JPQL의 SELECT 절과 정확히 동일한 순서로 생성자 작성
    public RecipeList(
            int id,
            String title,
            String thumbnailUrl,
            String content,
            LocalDateTime createdAt,
            int userId,         // r.user.id
            String nickname,     // r.user.nickname
            int viewCnt,
            int likeCnt,
            boolean bookmarked,
            boolean liked
    ) {
        this.id = id;
        this.title = title;
        this.thumbnailUrl = thumbnailUrl;
        this.content = content;
        this.createdAt = createdAt;
        this.userId = userId;
        this.nickname = nickname;
        this.viewCnt = viewCnt;
        this.likeCnt = likeCnt;
        this.bookmarked = bookmarked;
        this.liked = liked;
    }

}

