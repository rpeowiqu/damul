package com.damul.api.recipe.entity;

import com.damul.api.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "recipe_comments")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RecipeComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", referencedColumnName = "id")
    private Recipe recipe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private RecipeComment parent;

    @Column(name = "comment", nullable = false, columnDefinition = "TEXT")
    private String comment;

    @Column(name = "depth", nullable = false)
    private int depth;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "deleted", nullable = false)
    private boolean deleted;

    @OneToMany(mappedBy = "parent")
    private List<RecipeComment> children;

    public void updateCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Builder
    public RecipeComment(Recipe recipe, User user, RecipeComment parent, String comment) {
        this.recipe = Objects.requireNonNull(recipe, "Recipe must not be null");
        this.user = Objects.requireNonNull(user, "User must not be null");
        this.comment = Objects.requireNonNull(comment, "Comment must not be null");
        this.parent = parent;
        this.depth = (parent != null) ? parent.getDepth() + 1 : 0;
        this.createdAt = LocalDateTime.now();
        this.deleted = false;
    }
}
