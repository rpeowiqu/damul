package com.damul.api.auth.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SignupRequest {
    private String nickname; // 사용자가 변경할 수 있는 닉네임
}
