package com.damul.api.auth.dto.response;

import com.damul.api.auth.entity.type.Role;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private int id;
    private String nickname;
    private boolean warningEnabled;
    private Role role;
}
