package com.damul.api.notification.dto.response;

import com.damul.api.notification.dto.NotificationType;
import com.damul.api.notification.entity.Notification;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class NotificationResponse {
    private Integer id;
    private NotificationType type;
    private String content;
    private String targetUrl;
    private boolean isRead;
    private LocalDateTime createdAt;

    // 발신자 정보
    private SenderInfo sender;

    @Getter
    @Builder
    public static class SenderInfo {
        private Integer id;
        private String nickname;
        private String profileImageUrl;
    }

    public static NotificationResponse from(Notification notification) {
        SenderInfo senderInfo = null;
        if (notification.getSender() != null) {
            senderInfo = SenderInfo.builder()
                    .id(notification.getSender().getId())
                    .nickname(notification.getSender().getNickname())
                    .profileImageUrl(notification.getSender().getProfileImageUrl())
                    .build();
        }

        return NotificationResponse.builder()
                .id(notification.getId())
                .type(notification.getType())
                .content(notification.getContent())
                .targetUrl(notification.getTargetUrl())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .sender(senderInfo)
                .build();
    }
}