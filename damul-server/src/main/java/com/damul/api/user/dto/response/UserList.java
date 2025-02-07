package com.damul.api.user.dto.response;

import com.damul.api.common.scroll.util.ScrollCursor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserList implements ScrollCursor {
    private int userId;
    private String profileImageUrl;
    private String nickname;


    @Override
    public int getId() {
        return this.userId;
    }
}
