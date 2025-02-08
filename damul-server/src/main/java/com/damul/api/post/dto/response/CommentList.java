package com.damul.api.post.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentList {
    private int id;
    private int userId;
    private String nickname;
    private String profileImageUrl;
    private String comment;
    private LocalDateTime createdAt;
    private int parentId;
}
