package com.damul.api.notification.repository;

import com.damul.api.notification.dto.NotificationType;
import com.damul.api.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    // 사용자의 모든 알림 조회 (최신순)
    List<Notification> findByReceiverIdOrderByCreatedAtDesc(Integer receiverId);

    // 읽지 않은 알림만 조회
    List<Notification> findByReceiverIdAndIsReadFalseOrderByCreatedAtDesc(Integer receiverId);

    // 읽지 않은 알림 개수 조회
    Integer countByReceiverIdAndIsReadFalse(Integer receiverId);

    // 특정 기간 이전의 알림 삭제를 위한 쿼리
    @Query("DELETE FROM Notification n WHERE n.createdAt < :date")
    void deleteOldNotifications(@Param("date") LocalDateTime date);

    // 특정 타입의 알림만 조회
    @Query("SELECT n FROM Notification n WHERE n.receiver.id = :receiverId AND n.type = :type ORDER BY n.createdAt DESC")
    List<Notification> findByReceiverIdAndType(@Param("receiverId") Integer receiverId, @Param("type") NotificationType type);

    // 특정 사용자의 알림을 모두 읽음 처리
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.receiver.id = :receiverId AND n.isRead = false")
    void markAllAsRead(@Param("receiverId") Integer receiverId);
}