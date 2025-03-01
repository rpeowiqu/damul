package com.damul.api.chat.repository;

import com.damul.api.chat.entity.ChatRoomMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomMemberRepository extends JpaRepository<ChatRoomMember, Integer> {

    // 채팅방 멤버 수 조회
    int countByRoomId(int roomId);

    // 특정 사용자의 채팅방 멤버 정보 조회
    Optional<ChatRoomMember> findByRoomIdAndUserId(int roomId, int userId);

    // 채팅방 내 모든 멤버 조회
    @Query("SELECT cm FROM ChatRoomMember cm " +
            "WHERE cm.room.id = :roomId " +
            "ORDER BY cm.joinedAt ASC")
    List<ChatRoomMember> findAllByRoomId(@Param("roomId") int roomId);

    // 채팅방에 내가 참여중인지
    boolean existsByRoomIdAndUserId(int roomId, int userId);

    // 채팅방 멤버 삭제
    @Modifying
    @Query("DELETE FROM ChatRoomMember m WHERE m.room.id = :roomId")
    void deleteAllByRoomId(@Param("roomId") int roomId);

    // ADMIN인지 확인
    @Query("SELECT COUNT(m) > 0 FROM ChatRoomMember m " +
            "WHERE m.room.id = :roomId AND m.user.id = :userId AND m.role = 'ADMIN'")
    boolean isAdmin(@Param("roomId") int roomId, @Param("userId") int userId);

    @Query("SELECT COUNT(crm) FROM ChatRoomMember crm WHERE crm.room.id = :roomId")
    int countMembersByRoomId(@Param("roomId") int roomId);

    List<ChatRoomMember> findAllByUserId(int id);

    @Query("SELECT COUNT(m) FROM ChatRoomMember m WHERE m.room.id = :roomId AND m.lastReadMessageId < :messageId")
    int countUnreadMembers(@Param("roomId") int roomId, @Param("messageId") int messageId);

    @Query("SELECT m.lastReadMessageId FROM ChatRoomMember m WHERE m.user.id = :userId AND m.room.id = :roomId")
    int findLastReadMessageIdByUserIdAndRoomId(@Param("userId") int userId, @Param("roomId") int roomId);

    @Modifying
    @Query("UPDATE ChatRoomMember m SET m.lastReadMessageId = :messageId " +
            "WHERE m.user.id = :userId AND m.room.id = :roomId")
    void updateLastReadMessageId(@Param("userId") int userId,
                                 @Param("roomId") int roomId,
                                 @Param("messageId") int messageId);

}