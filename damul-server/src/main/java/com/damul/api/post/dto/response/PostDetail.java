package com.damul.api.post.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PostDetail {
    private int id;
    private String title;
    private int authorId;
    private String authorName;
    private String profileImageUrl;
    private String contentImageUrl;
    private String content;
    private LocalDateTime createdAt;
    private int currentChatNum;
    private int chatSize;
    private int commentCnt;
    private List<CommentList> comments;
}
