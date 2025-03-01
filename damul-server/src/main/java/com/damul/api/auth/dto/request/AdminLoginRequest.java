package com.damul.api.auth.dto.request;

import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminLoginRequest {
    private String password;
}
