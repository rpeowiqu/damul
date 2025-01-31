package com.damul.api.auth.entity;

import com.damul.api.auth.entity.type.Provider;
import com.damul.api.auth.entity.type.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class User {
    @Id    // Primary Key 지정
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String nickname;
    private String email;
    private String profileImageUrl;

    @Enumerated(EnumType.STRING)
    private Provider provider;  // ENUM

    @Enumerated(EnumType.STRING)
    private Role role;         // ENUM
}
