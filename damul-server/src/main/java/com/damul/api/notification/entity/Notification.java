package com.damul.api.notification.entity;

import com.damul.api.auth.entity.User;
import com.damul.api.notification.dto.NotificationType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reciever_id")
    private User receiver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private User sender;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private NotificationType type;

    @Column(name = "content")
    private String content;

    @Column(name = "target_url")
    private String targetUrl;  // 알림 클릭시 이동할 URL

    @Column(name = "is_read")
    private boolean read;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public void updateCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static Notification create(User receiver, User sender, NotificationType type, String content, String targetUrl) {
        Notification notification = new Notification();
        notification.receiver = receiver;
        notification.sender = sender;
        notification.type = type;
        notification.content = content;
        notification.targetUrl = targetUrl;
        notification.read = false;
        notification.createdAt = LocalDateTime.now();
        return notification;
    }

    public void markAsRead() {
        this.read = true;
    }
}