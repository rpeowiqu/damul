package com.damul.api.user.dto.response;

import com.damul.api.common.scroll.util.ScrollCursor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FollowList implements ScrollCursor {
    @JsonIgnore
    private int followId;
    private int userId;
    private String profileImageUrl;
    private String nickname;


    @JsonIgnore
    @Override
    public int getId() {
        return this.followId;
    }
}
