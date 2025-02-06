package com.damul.api.post.entity;

import com.damul.api.auth.entity.User;
import com.damul.api.post.dto.PostStatus;
import com.damul.api.post.dto.PostType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "post")
@Getter
@NoArgsConstructor
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private int authorId;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE, targetEntity = User.class)
    @JoinColumn(name = "user_id", updatable = false)
    private User user;

    @Column(length = 200, nullable = false)
    private String title;

    @Column(nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostType postType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostStatus postStatus = PostStatus.ACTIVE;

    @Column(nullable = false)
    private int viewCnt = 0;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // 논리적 삭제를 위한 메서드
    public void changeStatus(PostStatus newStatus) {
        if (this.postStatus == newStatus) {
            return; // 같은 상태로 변경하지 않음
        }

        if (this.postStatus == PostStatus.DELETED) {
            // throw new IllegalStateException("삭제된 게시글은 상태를 변경할 수 없습니다.");
            return;
        }

        this.postStatus = newStatus;
    }

    public void incrementViewCnt() {
        this.viewCnt++;
    }
}