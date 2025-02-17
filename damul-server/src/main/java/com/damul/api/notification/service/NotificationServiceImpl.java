package com.damul.api.notification.service;

import com.damul.api.auth.entity.User;
import com.damul.api.chat.dto.MemberRole;
import com.damul.api.chat.dto.response.UnReadResponse;
import com.damul.api.chat.entity.ChatRoom;
import com.damul.api.chat.entity.ChatRoomMember;
import com.damul.api.common.TimeZoneConverter;
import com.damul.api.notification.dto.ChatRoomCreatedEvent;
import com.damul.api.notification.dto.NotificationType;
import com.damul.api.notification.dto.response.NotificationList;
import com.damul.api.notification.dto.response.NotificationResponse;
import com.damul.api.notification.entity.Notification;
import com.damul.api.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final SimpMessageSendingOperations messagingTemplate;
    private final TimeZoneConverter timeZoneConverter;

    @Override
    @Transactional(readOnly = true)
    public NotificationList getNotifications(Integer userId, boolean unreadOnly) {
        List<Notification> notifications;
        if (unreadOnly) {
            notifications = notificationRepository.findByReceiverIdAndReadFalseOrderByCreatedAtDesc(userId);
        } else {
            notifications = notificationRepository.findByReceiverIdOrderByCreatedAtDesc(userId);
        }

        List<NotificationResponse> responseList = notifications.stream()
                .map(NotificationResponse::from)
                .collect(Collectors.toList());

        return new NotificationList(responseList);
    }

    @Override
    @Transactional(readOnly = true)
    public UnReadResponse getUnreadCount(Integer userId) {
        UnReadResponse response = new UnReadResponse();
        response.count(notificationRepository.countByReceiverIdAndReadFalse(userId));
        return response;
    }

    @Override
    @Transactional
    public void createBadgeNotification(User receiver, String badgeName) {
        Notification notification = Notification.create(
                receiver,
                null,
                NotificationType.BADGE,
                String.format("새로운 뱃지를 획득했습니다: %s", badgeName),
                "/profile/badges"
        );
        notification.updateCreatedAt(timeZoneConverter.convertUtcToSeoul(LocalDateTime.now()));
        notificationRepository.save(notification);
        sendNotification(receiver.getId(), NotificationResponse.from(notification));
    }

    @Override
    @Transactional
    public void createCommentNotification(User receiver, User sender, Integer postId) {
        Notification notification = Notification.create(
                receiver,
                sender,
                NotificationType.COMMENT,
                String.format("%s님이 회원님의 게시글에 댓글을 달았습니다.", sender.getNickname()),
                "/posts/" + postId
        );
        notification.updateCreatedAt(timeZoneConverter.convertUtcToSeoul(LocalDateTime.now()));
        notificationRepository.save(notification);
        sendNotification(receiver.getId(), NotificationResponse.from(notification));
    }

    @Override
    @Transactional
    public void createFollowNotification(User receiver, User follower) {
        Notification notification = Notification.create(
                receiver,
                follower,
                NotificationType.FOLLOW,
                String.format("%s님이 회원님을 팔로우했습니다.", follower.getNickname()),
                "/profile/" + follower.getId()
        );
        notification.updateCreatedAt(timeZoneConverter.convertUtcToSeoul(LocalDateTime.now()));
        notificationRepository.save(notification);
        sendNotification(receiver.getId(), NotificationResponse.from(notification));
    }

    @Override
    @Transactional
    public void createLikeNotification(User receiver, User sender, Integer postId) {
        Notification notification = Notification.create(
                receiver,
                sender,
                NotificationType.LIKE,
                String.format("%s님이 회원님의 게시글을 좋아합니다.", sender.getNickname()),
                "/posts/" + postId
        );
        notification.updateCreatedAt(timeZoneConverter.convertUtcToSeoul(LocalDateTime.now()));
        notificationRepository.save(notification);
        sendNotification(receiver.getId(), NotificationResponse.from(notification));
    }

    private void sendNotification(Integer userId, NotificationResponse notification) {
        messagingTemplate.convertAndSend(
                "/sub/notification/" + userId,
                notification
        );
    }

    @Override
    @Transactional
    public void markAsRead(Integer notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("알림을 찾을 수 없습니다."));
        notification.markAsRead();
        notificationRepository.save(notification);

        messagingTemplate.convertAndSend(
                "/sub/notification/" + notification.getReceiver().getId() + "/read",
                notificationId
        );
    }

    public void notifyNewChatRoom(ChatRoom chatRoom, List<ChatRoomMember> members) {
        ChatRoomCreatedEvent event = new ChatRoomCreatedEvent(
                chatRoom.getId(),
                chatRoom.getRoomName(),
                chatRoom.getCreator().getNickname()
        );

        // 방장을 제외한 모든 멤버에게 알림
        members.stream()
                .filter(member -> !member.getRole().equals(MemberRole.ADMIN))
                .forEach(member ->
                        messagingTemplate.convertAndSendToUser(
                                String.valueOf(member.getUser().getId()),
                                "/queue/chat.room.created",
                                event
                        )
                );
    }
}