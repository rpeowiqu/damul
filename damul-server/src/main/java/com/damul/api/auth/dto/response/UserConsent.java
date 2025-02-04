package com.damul.api.auth.dto.response;

import com.damul.api.auth.entity.Terms;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserConsent {
    private String email;
    private String nickname;
    List<Terms> terms;
}
