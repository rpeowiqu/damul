package com.damul.api.post.dto.response;

import com.damul.api.post.dto.PostStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
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
    private LocalDateTime createdAt;
    private int viewCnt;
    private int currentChatNum;
    private int chatSize;
    private boolean entered;
    private List<CommentList> comments;
}
