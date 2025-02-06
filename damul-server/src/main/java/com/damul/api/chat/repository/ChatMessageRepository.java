package com.damul.api.chat.repository;

import com.damul.api.chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {

    // 채팅방의 마지막 메시지 조회
    Optional<ChatMessage> findFirstByRoomIdOrderByCreatedAtDesc(int roomId);

    // 안 읽은 메시지 수 조회
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.roomId = :roomId AND m.id > :lastReadId")
    int countUnreadMessages(@Param("roomId") int roomId, @Param("lastReadId") int lastReadId);

    @Query("SELECT cm FROM ChatMessage cm WHERE cm.roomId = :roomId AND cm.id < :cursorId " +
            "ORDER BY cm.id DESC LIMIT :size")
    List<ChatMessage> findByRoomIdAndIdLessThanOrderByIdDesc(
            @Param("roomId") int roomId,
            @Param("cursorId") int cursorId,
            @Param("size") int size
    );

    @Query("SELECT cm FROM ChatMessage cm WHERE cm.roomId = :roomId " +
            "ORDER BY cm.id DESC LIMIT :size")
    List<ChatMessage> findFirstPageByRoomId(
            @Param("roomId") int roomId,
            @Param("size") int size
    );

    boolean existsByRoomIdAndIdLessThan(int roomId, int id);

}
