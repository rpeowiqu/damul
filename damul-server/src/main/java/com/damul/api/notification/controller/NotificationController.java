package com.damul.api.notification.controller;

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

    @GetMapping("/api/v1/notifications/{userId}")
    public ResponseEntity<List<NotificationResponse>> getNotifications(
            @PathVariable Integer userId,
            @RequestParam(required = false, defaultValue = "false") Boolean unreadOnly) {
        log.info("Get notifications request: userId={}, unreadOnly={}", userId, unreadOnly);
        List<NotificationResponse> notifications = notificationService.getNotifications(userId, unreadOnly);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/api/v1/notifications/{userId}/count")
    public ResponseEntity<Integer> getUnreadCount(@PathVariable Integer userId) {
        log.info("Get unread count request: userId={}", userId);
        Integer count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(count);
    }
}