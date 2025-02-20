package com.damul.api.chat.repository;

import com.damul.api.chat.entity.ChatMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {

    // 채팅방의 마지막 메시지 조회
    Optional<ChatMessage> findFirstByRoomIdOrderByCreatedAtDesc(int roomId);

    // 안 읽은 메시지 수 조회
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.room.id = :roomId AND m.id > :lastReadId")
    int countUnreadMessages(@Param("roomId") int roomId, @Param("lastReadId") int lastReadId);

    @Query("SELECT cm FROM ChatMessage cm WHERE cm.room.id = :roomId AND cm.id < :cursorId " +
            "ORDER BY cm.id DESC LIMIT :size")
    List<ChatMessage> findByRoomIdAndIdLessThanOrderByIdDesc(
            @Param("roomId") int roomId,
            @Param("cursorId") int cursorId,
            @Param("size") int size
    );

    @Query("SELECT cm FROM ChatMessage cm WHERE cm.room.id = :roomId " +
            "ORDER BY cm.id DESC LIMIT :size")
    List<ChatMessage> findFirstPageByRoomId(
            @Param("roomId") int roomId,
            @Param("size") int size
    );

    boolean existsByRoomIdAndIdLessThan(int roomId, int id);

    // 첫 로딩을 위한 쿼리
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.room.id = :roomId " +
            "AND ((cm.id >= :lastReadId) OR " +
            "(cm.id < :lastReadId)) " +
            "ORDER BY cm.id DESC")
    List<ChatMessage> findInitialMessages(
            @Param("roomId") int roomId,
            @Param("lastReadId") int lastReadId,
            Pageable pageable
    );

    // 스크롤을 위한 이전 메시지 조회
    @Query("SELECT cm FROM ChatMessage cm " +
            "WHERE cm.room.id = :roomId AND cm.id < :cursor " +
            "ORDER BY cm.id DESC")
    List<ChatMessage> findPreviousMessages(
            @Param("roomId") int roomId,
            @Param("cursor") int cursorId,
            Pageable pageable
    );

    // 안 읽은 메세지 수 전체 조회
    @Query("SELECT SUM(CASE WHEN cm.id > crm.lastReadMessageId THEN 1 ELSE 0 END) " +
            "FROM ChatMessage cm " +
            "JOIN ChatRoomMember crm ON cm.room = crm.room " +
            "WHERE crm.user.id = :userId")
    Integer countAllUnreadMessages(@Param("userId") int userId);

    @Query(value = """
        SELECT created_at 
        FROM chat_messages 
        WHERE room_id = :roomId 
        ORDER BY created_at DESC 
        LIMIT 1
        """, nativeQuery = true)
    LocalDateTime findLastMessageTimeByRoomId(@Param("roomId") int roomId);

    @Query("SELECT COUNT(m) FROM ChatMessage m " +
            "WHERE m.room.id = :roomId " +
            "AND m.id > :lastReadId " +
            "AND m.id <= :currentReadId")
    Integer countUnreadMessagesInRoom(
            @Param("roomId") int roomId,
            @Param("lastReadId") int lastReadId,
            @Param("currentReadId") int currentReadId
    );

}
