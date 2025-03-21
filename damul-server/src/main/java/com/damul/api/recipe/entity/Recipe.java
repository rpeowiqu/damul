package com.damul.api.recipe.entity;

import com.damul.api.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

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

    @Setter
    @Column(name = "title", length=200, nullable = false)
    private String title;

    @Setter
    @Column(name = "content", nullable = false)
    private String content;

    @Setter
    @Column(name = "thumbnail_url", length = 255, nullable = false)
    private String thumbnailUrl;

    @Column(name = "view_cnt", nullable = false)
    private int viewCnt;

    @Column(name = "like_cnt", nullable = false)
    private int likeCnt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_deleted", nullable = false)
    private boolean deleted;

    @OneToMany(mappedBy = "recipe")
    private List<RecipeIngredient> recipeIngredients;

    public void updateCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void incrementLikeCnt() {
        this.likeCnt++;
    }

    public void decrementLikeCnt() {
        this.likeCnt = Math.max(0, this.likeCnt - 1);  // 음수가 되지 않도록 처리
    }
}
