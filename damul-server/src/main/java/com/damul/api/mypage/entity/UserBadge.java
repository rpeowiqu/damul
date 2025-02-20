package com.damul.api.mypage.entity;

import com.damul.api.auth.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_badge")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserBadge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "badge_id", referencedColumnName = "id")
    private Badge badge;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "rank")
    private Double rank;

    public void updateCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void updateBadge(Badge newBadge) {
        this.badge = newBadge;
        // 뱃지 업데이트 시점 기록
        this.createdAt = LocalDateTime.now();
    }

    public void updateRank(double percentileRank) {
        this.rank = percentileRank;
    }

    @Builder
    public UserBadge(Badge badge, User user) {
        this.badge = badge;
        this.user = user;
    }

}
