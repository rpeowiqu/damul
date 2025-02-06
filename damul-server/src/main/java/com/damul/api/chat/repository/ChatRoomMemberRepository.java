package com.damul.api.chat.repository;

import com.damul.api.chat.entity.ChatRoomMember;
import org.springframework.data.jpa.repository.JpaRepository;
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

    @Query("SELECT cm FROM ChatRoomMember cm " +
            "WHERE cm.room.id = :roomId " +
            "ORDER BY cm.joinedAt ASC")
    List<ChatRoomMember> findAllByRoomId(@Param("roomId") int roomId);

    boolean existsByRoomIdAndUserId(int roomId, int userId);

}
