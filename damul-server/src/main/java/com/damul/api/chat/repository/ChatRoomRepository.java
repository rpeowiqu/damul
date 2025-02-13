package com.damul.api.chat.repository;

import com.damul.api.chat.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Integer> {

    // 커서 기반 채팅방 목록 조회
    @Query(value = """
    SELECT DISTINCT cr.* 
    FROM chat_rooms cr 
    INNER JOIN chat_room_members crm ON cr.id = crm.room_id 
    LEFT JOIN (
        SELECT room_id, MAX(created_at) as last_message_time
        FROM chat_messages
        GROUP BY room_id
    ) last_msg ON cr.id = last_msg.room_id
    WHERE cr.status = 'ACTIVE' 
    AND crm.user_id = :userId
    AND (
        last_msg.last_message_time < :cursorTime 
        OR (last_msg.last_message_time = :cursorTime AND cr.id < :cursorId)
    )
    ORDER BY last_msg.last_message_time DESC, cr.id DESC
    """, nativeQuery = true)
    List<ChatRoom> findRoomsWithCursor(
            @Param("userId") int userId,
            @Param("cursorTime") LocalDateTime cursorTime,
            @Param("cursorId") int cursorId
    );

    // 키워드로 채팅방 검색 (무한 스크롤)
    @Query(value = """
            SELECT cr.* 
            FROM chat_rooms cr 
            WHERE cr.status = 'ACTIVE' 
            AND (:cursorId IS NULL OR cr.id < :cursorId)
            AND (:keyword IS NULL OR cr.room_name LIKE CONCAT('%', :keyword, '%'))
            ORDER BY cr.id DESC 
            LIMIT :size""", nativeQuery = true)
    List<ChatRoom> findRoomsWithCursorAndKeyword(
            @Param("cursorId") Integer cursorId,
            @Param("keyword") String keyword,
            @Param("size") int size
    );

    // 다음 페이지 존재 여부 확인
    @Query(value = """
            SELECT EXISTS(
                SELECT 1 FROM chat_rooms cr 
                WHERE cr.status = 'ACTIVE' 
                AND cr.id < :id 
                AND (:keyword IS NULL OR cr.room_name LIKE CONCAT('%', :keyword, '%'))
            )""", nativeQuery = true)
    Long existsByIdLessThanAndKeyword(
            @Param("id") int id,
            @Param("keyword") String keyword
    );

    // 검색 결과 총 개수 조회
    @Query(value = """
            SELECT COUNT(*) 
            FROM chat_rooms cr 
            WHERE cr.status = 'ACTIVE' 
            AND (:keyword IS NULL OR cr.room_name LIKE CONCAT('%', :keyword, '%'))
            """, nativeQuery = true)
    int countByKeyword(@Param("keyword") String keyword);

    @Query("""
            SELECT cr FROM ChatRoom cr
            WHERE cr.roomType = 'PRIVATE'
            AND cr.status = 'ACTIVE'
            AND EXISTS (
                SELECT crm1 FROM ChatRoomMember crm1
                WHERE crm1.room = cr
                AND crm1.user.id = :userId1
            )
            AND EXISTS (
                SELECT crm2 FROM ChatRoomMember crm2
                WHERE crm2.room = cr
                AND crm2.user.id = :userId2
            )
            """)
    Optional<ChatRoom> findExistingDirectChatRoom(
            @Param("userId1") int userId1,
            @Param("userId2") int userId2
    );


    Optional<ChatRoom> findChatRoomByPost_PostId(int postId);

    @Query(value = """
    SELECT EXISTS(
        SELECT 1 FROM chat_rooms cr 
        INNER JOIN chat_room_members crm ON cr.id = crm.room_id 
        LEFT JOIN (
            SELECT room_id, MAX(created_at) as last_message_time
            FROM chat_messages
            GROUP BY room_id
        ) last_msg ON cr.id = last_msg.room_id
        WHERE cr.status = 'ACTIVE' 
        AND crm.user_id = :userId
        AND (last_msg.last_message_time < :lastMessageTime OR 
            (last_msg.last_message_time = :lastMessageTime AND cr.id < :roomId))
    )""", nativeQuery = true)
    Long existsByLastMessageTimeBeforeAndRoomIdLessThan(
            @Param("userId") int userId,
            @Param("lastMessageTime") LocalDateTime lastMessageTime,
            @Param("roomId") int roomId
    );
}
