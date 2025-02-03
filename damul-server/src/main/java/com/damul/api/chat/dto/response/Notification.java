package com.damul.api.chat.dto.response;

import com.damul.api.chat.dto.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    private int notificationId;
    private int userId;
    private NotificationType type;
    private String title;
    private String content;
    private int relatedId;
    private boolean isRead;
    private LocalDateTime createdAt;

}
