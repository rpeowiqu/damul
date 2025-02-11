package com.damul.api.recipe.dto.response;

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
    private Integer id;
    private int userId;
    private String nickname;
    private String profileImageUrl;
    private String comment;
    private Integer parentId;
    private LocalDateTime createdAt;
}
