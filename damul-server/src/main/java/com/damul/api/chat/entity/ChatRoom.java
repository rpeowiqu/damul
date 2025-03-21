package com.damul.api.chat.entity;

import com.damul.api.auth.entity.User;
import com.damul.api.post.entity.Post;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", referencedColumnName = "id")
    private User creator;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", referencedColumnName = "id")
    private Post post;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

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
        status = Status.ACTIVE;
    }

    public enum RoomType {
        PRIVATE, GROUP
    }

    public enum Status {
        ACTIVE, INACTIVE
    }

    public void deactivate() {
        this.status = Status.INACTIVE;
    }

    public void activate() {
        this.status = Status.ACTIVE;
    }

    public void updateCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void updateMemberLimit(int newLimit) {
        this.memberLimit = newLimit;
    }

    public void updateRoomName(String newRoomName) { this.roomName = newRoomName; }

    public static ChatRoom createDirectRoom(User creator, String roomName) {
        ChatRoom room = new ChatRoom();
        room.creator = creator;
        room.roomName = roomName;
        room.roomType = RoomType.PRIVATE;
        room.memberLimit = 2;
        room.thumbnailUrl = creator.getProfileImageUrl();
        return room;
    }

    public static ChatRoom createMultiRoom(User creator, String roomName, int memberLimit) {
        ChatRoom room = new ChatRoom();
        room.creator = creator;
        room.roomName = roomName;
        room.roomType = RoomType.GROUP;
        room.memberLimit = memberLimit;
        room.thumbnailUrl = creator.getProfileImageUrl();
        return room;
    }

    public static ChatRoom createPostRoom(User creator, Post post, String roomName, int chatSize) {
        ChatRoom room = new ChatRoom();
        room.creator = creator;
        room.post = post;
        room.roomName = roomName;
        room.roomType = RoomType.GROUP;
        room.memberLimit = chatSize;
        room.thumbnailUrl = creator.getProfileImageUrl();
        return room;
    }
}