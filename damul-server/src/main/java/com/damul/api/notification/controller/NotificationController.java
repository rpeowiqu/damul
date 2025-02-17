package com.damul.api.notification.controller;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.chat.dto.response.UnReadResponse;
import com.damul.api.common.user.CurrentUser;
import com.damul.api.notification.dto.response.NotificationList;
import com.damul.api.notification.dto.response.NotificationResponse;
import com.damul.api.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
@Slf4j
public class NotificationController {
    private final NotificationService notificationService;

    @MessageMapping("/notification/read/{notificationId}")
    @SendTo("/sub/notification/{userId}")
    public void readNotification(@DestinationVariable Integer notificationId) {
        log.info("Read notification request: notificationId={}", notificationId);
        notificationService.markAsRead(notificationId);
    }

    @GetMapping("/api/v1/notifications")
    public ResponseEntity<?> getNotifications(
            @CurrentUser UserInfo user,
            @RequestParam(required = false, defaultValue = "false") Boolean unreadOnly) {
        log.info("Get notifications request: userId={}, unreadOnly={}", user.getId(), unreadOnly);
        NotificationList notifications = notificationService.getNotifications(user.getId(), unreadOnly);
        if(notifications.getNotifications().isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/api/v1/notifications/count")
    public ResponseEntity<?> getUnreadCount(@CurrentUser UserInfo user) {
        log.info("Get unread count request: userId={}", user.getId());
        UnReadResponse count = notificationService.getUnreadCount(user.getId());
        return ResponseEntity.ok(count);
    }
}