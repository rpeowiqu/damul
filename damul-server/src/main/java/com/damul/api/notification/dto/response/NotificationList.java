package com.damul.api.notification.dto.response;

import com.damul.api.notification.entity.Notification;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationList {

    List<NotificationResponse> notifications;

}
