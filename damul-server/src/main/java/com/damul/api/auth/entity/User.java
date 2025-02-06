package com.damul.api.auth.entity;

import com.damul.api.auth.entity.type.AccessRange;
import com.damul.api.auth.entity.type.Provider;
import com.damul.api.auth.entity.type.Role;
import com.damul.api.user.dto.request.SettingUpdate;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id    // Primary Key 지정
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "INT AUTO_INCREMENT")
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

    @Builder.Default
    private boolean termsAgreed = false;

    @Column(name = "created_at", updatable = false, columnDefinition = "DATETIME")
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "active")
    private boolean active;

    @Column(name = "report_count")
    private int reportCount;

    @Column(name = "self_introduction")
    private String selfIntroduction;

    @Column(name = "access_range")
    private AccessRange accessRange;

    @Column(name = "warning_enabled")
    private boolean warningEnabled;

    public void updateSettings(SettingUpdate settingUpdate) {
        this.nickname = settingUpdate.getNickname();
        this.selfIntroduction = settingUpdate.getSelfIntroduction();
        this.profileImageUrl = settingUpdate.getProfileImageUrl();
        this.profileBackgroundImageUrl = settingUpdate.getBackgroundImageUrl();
        this.accessRange = settingUpdate.getAccessRange();
        this.warningEnabled = settingUpdate.isWarningEnabled();
    }
}