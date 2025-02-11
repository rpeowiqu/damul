package com.damul.api.post.dto.response;

import com.damul.api.post.dto.PostStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostDetail {
    private int id;
    private String title;
    private int authorId;
    private String authorName;
    private String profileImageUrl;
    private PostStatus status;
    private String contentImageUrl;
    private String content;
    private String createdAt;
    private int currentChatNum;
    private int chatSize;
    private int commentCnt;
    private List<CommentList> comments;
}
