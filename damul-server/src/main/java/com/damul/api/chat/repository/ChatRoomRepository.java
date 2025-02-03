package com.damul.api.chat.repository;

import com.damul.api.chat.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Integer> {

    // 커서 기반 채팅방 목록 조회
    @Query(value = "SELECT cr.* FROM chat_rooms cr " +
            "WHERE cr.id < :cursorId AND cr.status = 'ACTIVE' " +
            "ORDER BY cr.id DESC " +
            "LIMIT :size", nativeQuery = true)
    List<ChatRoom> findRoomsWithCursor(@Param("cursorId") int cursorId, @Param("size") int size);

    // 다음 데이터 존재 여부 확인
    boolean existsByIdLessThan(int id);

}
