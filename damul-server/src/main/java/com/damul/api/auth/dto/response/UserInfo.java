package com.damul.api.auth.dto.response;

import lombok.*;

@Getter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class UserInfo {
    private Integer id;
    private String email;
    private String nickname;
    private String role;
}
