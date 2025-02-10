package com.damul.api.post.dto.response;

import com.damul.api.common.scroll.util.ScrollCursor;
import com.damul.api.post.dto.PostStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostList implements ScrollCursor {
    private int id;
    private String title;
    private String thumbnailUrl;
    private String content;
    private LocalDateTime createdAt;
    private int authorId;
    private String authorName;
    private PostStatus status;

    @Override
    public int getId() {
        return this.id;
    }
}
