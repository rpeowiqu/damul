package com.damul.api.notification.service;

import com.damul.api.auth.entity.User;
import com.damul.api.chat.entity.ChatRoom;
import com.damul.api.chat.entity.ChatRoomMember;
import com.damul.api.notification.dto.response.NotificationList;
import com.damul.api.notification.dto.response.NotificationResponse;

import java.util.List;

public interface NotificationService {

    NotificationList getNotifications(Integer userId, boolean unreadOnly);

    Integer getUnreadCount(Integer userId);

    void createBadgeNotification(User receiver, String badgeName);

    void createCommentNotification(User receiver, User sender, Integer postId);

    void createFollowNotification(User receiver, User follower);

    void createLikeNotification(User receiver, User sender, Integer postId);

    void markAsRead(Integer notificationId);

    void notifyNewChatRoom(ChatRoom chatRoom, List<ChatRoomMember> members);

}
