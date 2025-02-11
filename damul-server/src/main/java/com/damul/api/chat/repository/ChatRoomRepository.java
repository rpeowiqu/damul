package com.damul.api.chat.repository;

import com.damul.api.chat.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Integer> {

    // 커서 기반 채팅방 목록 조회
    @Query(value = """
            SELECT cr.* 
            FROM chat_rooms cr 
            WHERE cr.id < :cursorId 
            AND cr.status = 'ACTIVE' 
            ORDER BY cr.id DESC 
            LIMIT :size""", nativeQuery = true)
    List<ChatRoom> findRoomsWithCursor(
            @Param("cursorId") int cursorId,
            @Param("size") int size);

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
    boolean existsByIdLessThanAndKeyword(
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
}
