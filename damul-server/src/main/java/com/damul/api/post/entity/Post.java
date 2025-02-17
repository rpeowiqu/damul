package com.damul.api.post.entity;

import com.damul.api.auth.entity.User;
import com.damul.api.post.dto.PostStatus;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private int postId;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE, targetEntity = User.class)
    @JoinColumn(name = "author_id", updatable = false)
    private User user;

    @Column(length = 200, nullable = false)
    private String title;

    @Column(length = 255)
    private String thumbnailUrl;

    @Column(nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostStatus status = PostStatus.ACTIVE;

    @Column(nullable = false)
    private int viewCnt = 0;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public void updateCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // 논리적 삭제를 위한 메서드
    public void changeStatus(PostStatus newStatus) {
        if (this.status == newStatus) {
            return; // 같은 상태로 변경하지 않음
        }

        if (this.status == PostStatus.DELETED) {
            // throw new IllegalStateException("삭제된 게시글은 상태를 변경할 수 없습니다.");
            return;
        }

        this.status = newStatus;
    }

    public void incrementViewCnt() {
        this.viewCnt++;
    }

    @Builder
    public Post(User user, String thumbnailUrl, String title, String content) {
        this.user = Objects.requireNonNull(user, "user cannot be null");
        this.title = Objects.requireNonNull(title, "title cannot be null");
        this.thumbnailUrl = thumbnailUrl;
        this.content = Objects.requireNonNull(content, "content cannot be null");
        this.status = PostStatus.ACTIVE;
        this.viewCnt = 0;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}