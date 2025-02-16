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
    private User receiver;

    @ManyToOne(fetch = FetchType.LAZY)
    private User sender;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private String content;

    private String targetUrl;  // 알림 클릭시 이동할 URL

    private boolean isRead;

    private LocalDateTime createdAt;

    public static Notification create(User receiver, User sender, NotificationType type, String content, String targetUrl) {
        Notification notification = new Notification();
        notification.receiver = receiver;
        notification.sender = sender;
        notification.type = type;
        notification.content = content;
        notification.targetUrl = targetUrl;
        notification.isRead = false;
        notification.createdAt = LocalDateTime.now();
        return notification;
    }

    public void markAsRead() {
        this.isRead = true;
    }
}