package com.damul.api.user.dto.response;

import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FollowResponse {
    private boolean followed;
}
