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
import java.util.Arrays;

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

    @Setter
    private String nickname;
    private String email;
    private String profileImageUrl;

    @Column(name = "profile_background_image_url")
    private String profileBackgroundImageUrl;

    @Enumerated(EnumType.STRING)
    private Provider provider;  // ENUM

    @Enumerated(EnumType.STRING)
    private Role role;         // ENUM

    @Column(name = "created_at", updatable = false, columnDefinition = "DATETIME")
    private LocalDateTime createdAt;

    @Column(name = "updated_at", columnDefinition = "DATETIME")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "active")
    @Builder.Default
    private boolean active = true;

    @Column(name = "report_count")
    private int reportCount;

    @Setter
    @Column(name = "self_introduction")
    private String selfIntroduction;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AccessRange accessRange = AccessRange.PUBLIC;

    @Column(name = "warning_enabled")
    @Builder.Default
    private boolean warningEnabled = true;

    public void updateSettings(SettingUpdate settingUpdate) {
        this.nickname = settingUpdate.getNickname();
        this.selfIntroduction = settingUpdate.getSelfIntroduction();
        if(settingUpdate.getProfileImageUrl() != null) {
            this.profileImageUrl = settingUpdate.getProfileImageUrl();
        }
        if(settingUpdate.getBackgroundImageUrl() != null) {
            this.profileBackgroundImageUrl = settingUpdate.getBackgroundImageUrl();
        }
        this.accessRange = settingUpdate.getAccessRange();
        this.warningEnabled = settingUpdate.isWarningEnabled();
    }

    public void updateCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void updateWarningEnabled(boolean warningEnabled) {
        this.warningEnabled = warningEnabled;
    }
}