package com.damul.api.post.entity;

import com.damul.api.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "postComments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private int postCommentId;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE, targetEntity = Post.class)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE, targetEntity = User.class)
    @JoinColumn(name = "author_id", updatable = false, nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE, targetEntity = PostComment.class)
    @JoinColumn(name = "parent_id", updatable = false)
    private PostComment parentPostComment;

    @Column(nullable = false)
    private String comment;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private boolean isDeleted = false;  // 삭제 상태 필드 추가

    public void updateCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // 논리적 삭제를 위한 메서드
    public void delete() {
        this.isDeleted = true;
    }

    @Builder
    public PostComment(Post post, User user, PostComment parentPostComment, String comment) {
        this.post = Objects.requireNonNull(post, "post cannot be null");
        this.user = Objects.requireNonNull(user, "user cannot be null");
        this.comment = Objects.requireNonNull(comment, "comment cannot be null");
        this.parentPostComment = parentPostComment;
        this.createdAt = LocalDateTime.now();
        this.isDeleted = false;
    }
}
