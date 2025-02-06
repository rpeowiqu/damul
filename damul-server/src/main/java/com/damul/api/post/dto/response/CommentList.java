package com.damul.api.post.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
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
