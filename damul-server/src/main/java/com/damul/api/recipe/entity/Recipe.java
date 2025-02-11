package com.damul.api.recipe.entity;

import com.damul.api.auth.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name="recipes")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Recipe {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User user;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "title", length=200, nullable = false)
    private String title;

    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "thumbnail_url", length = 255, nullable = false)
    private String thumbnailUrl;

    @Column(name = "view_cnt", nullable = false)
    private int viewCnt;

    @Column(name = "like_cnt", nullable = false)
    private int likeCnt;

    @Column(name = "created_at", nullable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "is_deleted", nullable = false)
    private boolean deleted;


    public void incrementLikeCnt() {
        this.likeCnt++;
    }

    public void decrementLikeCnt() {
        this.likeCnt = Math.max(0, this.likeCnt - 1);  // 음수가 되지 않도록 처리
    }
}
