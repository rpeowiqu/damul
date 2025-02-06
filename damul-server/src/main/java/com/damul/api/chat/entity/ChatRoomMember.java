package com.damul.api.chat.entity;

import com.damul.api.auth.entity.User;
import com.damul.api.auth.entity.type.Role;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Entity
@Table(name = "chat_room_members")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatRoomMember {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", referencedColumnName = "id")
    private ChatRoom room;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nickname", length = 50, nullable = false)
    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @Column(name = "joined_at", nullable = false, updatable = false)
    private LocalDateTime joinedAt;

    @Column(name = "last_read_message_id", nullable = false)
    private Integer lastReadMessageId;

    @PrePersist
    protected void onCreate() {
        joinedAt = LocalDateTime.now();
        role = Role.USER;
        lastReadMessageId = 0;
    }

}