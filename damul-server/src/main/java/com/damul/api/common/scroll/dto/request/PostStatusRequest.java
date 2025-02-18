package com.damul.api.common.scroll.dto.request;

import com.damul.api.post.dto.PostStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PostStatusRequest {
    private PostStatus status;
}
