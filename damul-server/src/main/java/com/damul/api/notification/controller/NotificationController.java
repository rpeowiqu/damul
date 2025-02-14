package com.damul.api.notification.controller;

import com.damul.api.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;
}
