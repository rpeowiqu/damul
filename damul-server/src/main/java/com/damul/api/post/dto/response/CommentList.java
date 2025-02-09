package com.damul.api.post.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CommentList {
    private Integer id;
    private int userId;
    private String nickname;
    private String profileImageUrl;
    private String comment;
    private String createdAt;
    private Integer parentId;
}
