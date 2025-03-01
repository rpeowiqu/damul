package com.damul.api.auth.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SignupRequest {
    private String nickname; // 사용자가 변경할 수 있는 닉네임
    private String selfIntroduction; // 자기소개
}
