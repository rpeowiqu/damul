package com.damul.api.chat.repository;

import com.damul.api.chat.entity.ChatRoomMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatRoomMemberRepository extends JpaRepository<ChatRoomMember, Integer> {

    // 채팅방 멤버 수 조회
    int countByRoomId(int roomId);

    // 특정 사용자의 채팅방 멤버 정보 조회
    Optional<ChatRoomMember> findByRoomIdAndUserId(int roomId, int userId);

}
