package com.damul.api.chat.entity;

import com.damul.api.auth.entity.User;
import com.damul.api.auth.entity.type.Role;
import com.damul.api.chat.dto.MemberRole;
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

    @Column(name = "nickname", length = 50)
    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private MemberRole role;

    @Column(name = "joined_at", nullable = false, updatable = false)
    private LocalDateTime joinedAt;

    @Column(name = "last_read_message_id", nullable = false)
    private Integer lastReadMessageId;

    @PrePersist
    protected void onCreate() {
        joinedAt = LocalDateTime.now();
        role = MemberRole.MEMBER;
        lastReadMessageId = 0;
    }

    public void updateLastReadMessageId(int messageId) {
        this.lastReadMessageId = messageId;
    }

    public static ChatRoomMember create(ChatRoom room, User user, String nickname, MemberRole role, Integer lastReadMessageId) {
        ChatRoomMember member = new ChatRoomMember();
        member.room = room;
        member.user = user;
        member.nickname = nickname;
        member.role = role;
        member.lastReadMessageId = lastReadMessageId;
        return member;
    }

}