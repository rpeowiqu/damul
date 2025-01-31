package com.damul.api.auth.entity;

import com.damul.api.auth.entity.type.Provider;
import com.damul.api.auth.entity.type.Role;
import jakarta.persistence.*;
import lombok.*;
import org.joda.time.DateTime;
import org.springframework.stereotype.Service;

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

    @Column(name = "profile_background_image_url")
    private String profileBackgroundImageUrl;

    @Enumerated(EnumType.STRING)
    private Provider provider;  // ENUM

    @Enumerated(EnumType.STRING)
    private Role role;         // ENUM

    @Column(name = "created_at")
    private DateTime createdAt;

    @Column(name = "updated_at")
    private DateTime updatedAt;

    @Column(name = "is_active")
    private boolean isActive;

    @Column(name = "report_count")
    private int reportCount;

    @Column(name = "self_introduction")
    private String selfIntroduction;

    @Column(name = "is_fridge_public", nullable = false)
    private boolean isFridgePublic;

    @Column(name = "is_warning", nullable = false)
    private boolean warning;

}