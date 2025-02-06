package com.damul.api.chat.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Entity
@Table(name = "chat_rooms")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "creator_id")
    private Integer creatorId;

    @Column(name = "post_id")
    private Integer postId;

    @Column(name = "room_name", length = 100, nullable = false)
    private String roomName;

    @Enumerated(EnumType.STRING)
    @Column(name = "room_type", nullable = false)
    private RoomType roomType;

    @Column(name = "thumbnail_url", length = 255)
    private String thumbnailUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @Column(name = "member_limit", nullable = false)
    private Integer memberLimit;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        status = Status.ACTIVE;
        memberLimit = 2;
    }

    public enum RoomType {
        PRIVATE, GROUP
    }

    public enum Status {
        ACTIVE, INACTIVE
    }
}