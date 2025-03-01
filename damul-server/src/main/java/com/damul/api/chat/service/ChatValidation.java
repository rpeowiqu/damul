package com.damul.api.chat.service;

import com.damul.api.chat.entity.ChatRoom;
import com.damul.api.chat.entity.ChatRoomMember;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;

import java.util.List;

public class ChatValidation {

    // 공통 validation 메소드들
    protected void validateRoomId(int roomId) {
        if (roomId <= 0) {
            throw new BusinessException(ErrorCode.INVALID_ID, "유효하지 않은 채팅방 ID입니다.");
        }
    }

    protected void validateUserId(int userId) {
        if (userId <= 0) {
            throw new BusinessException(ErrorCode.INVALID_ID, "유효하지 않은 사용자 ID입니다.");
        }
    }

    protected void validateMessageParams(int cursor, int size) {
        if (cursor < 0) {
            throw new BusinessException(ErrorCode.INVALID_MESSAGE_CURSOR);
        }
        if (size <= 0 || size > 100) {  // 최대 100개로 제한
            throw new BusinessException(ErrorCode.INVALID_MESSAGE_SIZE);
        }
    }

    protected void validateSearchParams(String keyword, int cursor, int size) {
        if (cursor < 0) {
            throw new BusinessException(ErrorCode.INVALID_CURSOR);
        }
        if (size <= 0 || size > 50) {  // 검색 결과는 최대 50개로 제한
            throw new BusinessException(ErrorCode.INVALID_PAGE_SIZE);
        }
        // keyword가 null인 경우는 허용 (전체 검색)
    }

    protected void validateMemberLimit(int memberLimit, int currentMemberCount) {
        if (memberLimit < 2) {
            throw new BusinessException(ErrorCode.CHATROOM_INVALID_MEMBER_LIMIT,
                    "채팅방 최대 인원은 2명 이상이어야 합니다.");
        }
        if (memberLimit < currentMemberCount) {
            throw new BusinessException(ErrorCode.CHATROOM_UPDATE_DENIED,
                    String.format("현재 참여 중인 인원(%d명)보다 적게 설정할 수 없습니다.", currentMemberCount));
        }
    }

    protected void validateRoomType(ChatRoom.RoomType roomType, ChatRoom.RoomType expectedType) {
        if (roomType != expectedType) {
            throw new BusinessException(ErrorCode.CHATROOM_INVALID_TYPE);
        }
    }

    protected void validateRoomStatus(ChatRoom.Status status) {
        if (status == ChatRoom.Status.INACTIVE) {
            throw new BusinessException(ErrorCode.CHATROOM_INACTIVE);
        }
    }

    protected void validateAdminRole(String role) {
        if (!"ADMIN".equals(role)) {
            throw new BusinessException(ErrorCode.CHATROOM_ADMIN_REQUIRED);
        }
    }

    protected void validateSelfChat(int userId1, int userId2) {
        if (userId1 == userId2) {
            throw new BusinessException(ErrorCode.CHATROOM_SELF_CHAT_DENIED);
        }
    }

    protected void validateMembershipAndRole(ChatRoomMember member, String requiredRole) {
        if (member == null) {
            throw new BusinessException(ErrorCode.CHATROOM_MEMBER_NOT_FOUND);
        }
        if (requiredRole != null && !requiredRole.equals(member.getRole())) {
            throw new BusinessException(ErrorCode.CHATROOM_ACCESS_DENIED);
        }
    }

    protected void validateKickTarget(ChatRoomMember targetMember) {
        if (targetMember == null) {
            throw new BusinessException(ErrorCode.CHATROOM_MEMBER_NOT_FOUND);
        }
        if ("ADMIN".equals(targetMember.getRole())) {
            throw new BusinessException(ErrorCode.CHATROOM_MEMBER_KICK_DENIED,
                    "방장은 추방할 수 없습니다.");
        }
    }
}