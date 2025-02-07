package com.damul.api.post.dto.response;

import com.damul.api.post.dto.PostStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PostList {
    private int id;
    private String title;
    private String thumbnailUrl;
    private String content;
    private LocalDateTime createdAt;
    private int authorId;
    private String authorName;
    private PostStatus postStatus;
}
