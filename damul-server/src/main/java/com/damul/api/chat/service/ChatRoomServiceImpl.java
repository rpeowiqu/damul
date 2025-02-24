package com.damul.api.chat.service;

import com.damul.api.auth.entity.User;
import com.damul.api.chat.dto.MemberRole;
import com.damul.api.chat.dto.response.*;
import com.damul.api.chat.dto.request.ChatRoomEntryExitCreate;
import com.damul.api.chat.dto.request.MultiChatRoomCreate;
import com.damul.api.chat.entity.ChatMessage;
import com.damul.api.chat.entity.ChatRoom;
import com.damul.api.chat.entity.ChatRoomMember;
import com.damul.api.chat.repository.ChatMessageRepository;
import com.damul.api.chat.repository.ChatRoomMemberRepository;
import com.damul.api.chat.repository.ChatRoomRepository;
import com.damul.api.common.TimeZoneConverter;
import com.damul.api.common.dto.response.CreateResponse;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.common.scroll.dto.response.CursorPageMetaInfo;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.common.scroll.dto.response.SearchResponse;
import com.damul.api.notification.service.NotificationService;
import com.damul.api.post.entity.Post;
import com.damul.api.post.repository.PostRepository;
import com.damul.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class ChatRoomServiceImpl extends ChatValidation implements ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final UserRepository userRepository;
    private final TimeZoneConverter timeZoneConverter;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional(readOnly = true)
    public ScrollResponse<ChatRoomList> getChatRooms(LocalDateTime cursorTime, int cursorId, int size, String filter, int userId) {
        List<ChatRoom> rooms = chatRoomRepository.findRoomsWithCursor(userId, cursorTime, cursorId, filter);

        if (rooms.isEmpty()) {
            return new ScrollResponse<>(
                    Collections.emptyList(),
                    new ChatCursorPageMetaInfo(cursorTime, cursorId, false)
            );
        }

        boolean hasNext = rooms.size() > size;
        if (hasNext) {
            rooms = rooms.subList(0, size);
        }

        List<ChatRoomList> chatRoomLists = rooms.stream()
                .map(room -> convertToChatRoomList(room, userId))
                .collect(Collectors.toList());

        ChatRoom lastRoom = rooms.get(rooms.size() - 1);
        LocalDateTime lastMessageTime = chatMessageRepository.findLastMessageTimeByRoomId(lastRoom.getId());

        if (lastMessageTime == null) {
            lastMessageTime = lastRoom.getCreatedAt();  // 메시지가 없는 경우 채팅방 생성 시간 사용
        }

        return new ScrollResponse<>(
                chatRoomLists,
                new ChatCursorPageMetaInfo(lastMessageTime, lastRoom.getId(), hasNext)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public SearchResponse<ChatRoomList> searchChatRooms(String keyword, LocalDateTime cursorTime, int cursorId, int size, String filter, int userId) {
        log.info("서비스: 채팅방 검색 시작 - keyword: {}", keyword);

        validateUserId(userId);
        validateSearchParams(keyword, cursorId, size);

        List<ChatRoom> rooms = chatRoomRepository.findRoomsWithCursorAndKeyword(
                userId,
                cursorTime,
                cursorId,
                keyword,
                filter
        );

        ScrollResponse<ChatRoomList> results = processRoomResults(rooms, size, userId);
        int totalCount = chatRoomRepository.countByKeywordAndUserId(keyword, userId);

        log.info("서비스: 채팅방 검색 완료 - 총 결과 수: {}", totalCount);
        return new SearchResponse<>(results, totalCount);
    }

    @Override
    public ChatMembersResponse getChatRoomMembers(int roomId) {
        log.info("서비스: 채팅방 멤버 목록 조회 시작 - roomId: {}", roomId);

        validateRoomId(roomId);
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CHATROOM_NOT_FOUND));
        validateRoomStatus(chatRoom.getStatus());
        // 채팅방 멤버 조회
        List<ChatRoomMember> members = chatRoomMemberRepository.findAllByRoomId(roomId);

        if (members.isEmpty()) {
            return ChatMembersResponse.builder()
                    .content(Collections.emptyList())
                    .adminId(0)
                    .totalMembers(0)
                    .build();
        }

        int adminId = 0;
        for (ChatRoomMember member : members) {
            if (member.getRole() == MemberRole.ADMIN) {
                adminId = member.getUser().getId();
                break;
            }
        }

        // 멤버 정보 변환
        List<ChatMember> chatMembers = members.stream()
                .map(member -> {
                    User user = userRepository.findById(member.getUser().getId())
                            .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

                    return ChatMember.builder()
                            .id(user.getId())
                            .nickname(user.getNickname())
                            .profileImageUrl(user.getProfileImageUrl())
                            .build();
                })
                .collect(Collectors.toList());
        log.info("서비스: 채팅방 멤버 목록 조회 성공 - roomId: {}", roomId);

        return ChatMembersResponse.builder()
                .content(chatMembers)
                .totalMembers(chatMembers.size())
                .adminId(adminId)
                .build();
    }

    @Override
    @Transactional
    public void deleteChatRoom(int roomId, int userId) {
        log.info("서비스: 채팅방 삭제 시작 - roomId: {}", roomId);

        validateRoomId(roomId);
        validateUserId(userId);
        User user = userRepository.findById(userId).get();

        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CHATROOM_NOT_FOUND, "채팅방이 존재하지 않습니다."));
        validateRoomStatus(chatRoom.getStatus());
        // 채팅방 멤버 확인
        ChatRoomMember member = chatRoomMemberRepository.findByRoomIdAndUserId(roomId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CHATROOM_MEMBER_NOT_FOUND));

        if (chatRoom.getRoomType() == ChatRoom.RoomType.PRIVATE) {
            handlePrivateRoomDeletion(chatRoom, userId);
        } else {
            chatRoomMemberRepository.delete(member);
        }

        if(chatRoom.getPost() == null) {
            List<ChatRoomMember> members = chatRoomMemberRepository.findAllByRoomId(roomId);
            String roomName = members.stream()
                    .map(ChatRoomMember::getNickname)
                    .collect(Collectors.joining(", "));
            chatRoom.updateRoomName(roomName);
        }

        if(chatRoom.getRoomType() != ChatRoom.RoomType.PRIVATE) {
            ChatMessage leaveMessage = ChatMessage.createLeaveMessage(chatRoom, user);
            leaveMessage.updateCreatedAt(timeZoneConverter.convertUtcToSeoul(LocalDateTime.now()));
            chatMessageRepository.save(leaveMessage);
            int unReadCount = chatMessageRepository.countUnreadMessages(roomId, leaveMessage.getId());
            messagingTemplate.convertAndSend("/sub/chat/room/" + roomId, ChatMessageResponse.from(leaveMessage, unReadCount));
        }

        log.info("서비스: 채팅방 삭제 완료 - roomId: {}", roomId);
    }

    @Override
    @Transactional
    public void kickMember(int roomId, int memberId, int adminId) {
        log.info("서비스: 채팅방 멤버 추방 시작 - roomId: {}, memberId: {}", roomId, memberId);

        validateRoomId(roomId);
        validateUserId(memberId);
        validateUserId(adminId);

        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CHATROOM_NOT_FOUND));

        validateRoomStatus(chatRoom.getStatus());

        // 개인 채팅방은 추방 불가
        if (chatRoom.getRoomType() == ChatRoom.RoomType.PRIVATE) {
            throw new BusinessException(ErrorCode.CHATROOM_MEMBER_KICK_DENIED, "개인 채팅방에서는 추방할 수 없습니다.");
        }

        // 방장 권한 확인
        ChatRoomMember admin = chatRoomMemberRepository.findByRoomIdAndUserId(roomId, adminId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CHATROOM_MEMBER_NOT_FOUND, "채팅방 멤버가 아닙니다."));

        if (!admin.getRole().equals(MemberRole.ADMIN)) {
            throw new BusinessException(ErrorCode.CHATROOM_MEMBER_KICK_DENIED, "방장만 멤버를 추방할 수 있습니다.");
        }

        // 추방할 멤버 확인
        ChatRoomMember memberToKick = chatRoomMemberRepository.findByRoomIdAndUserId(roomId, memberId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CHATROOM_MEMBER_NOT_FOUND, "추방할 멤버가 존재하지 않습니다."));

        // 방장은 추방할 수 없음
        if (memberToKick.getRole().equals(MemberRole.ADMIN)) {
            throw new BusinessException(ErrorCode.CHATROOM_MEMBER_KICK_DENIED, "방장은 추방할 수 없습니다.");
        }

        // 시스템 메시지 생성
        String kickMessage = String.format("%s님이 추방되었습니다.", memberToKick.getNickname());
        createSystemMessage(chatRoom, kickMessage);

        // 멤버 삭제
        chatRoomMemberRepository.delete(memberToKick);

        log.info("서비스: 채팅방 멤버 추방 완료 - roomId: {}, memberId: {}", roomId, memberId);
    }

    @Override
    public CreateResponse enterChatRoom(int roomId, ChatRoomEntryExitCreate request) {
        log.info("서비스: 채팅방 입장 시작 - roomId: {}, userId: {}", roomId, request.getId());

        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CHATROOM_NOT_FOUND, "존재하지 않는 채팅방입니다."));

        if (chatRoom.getStatus() == ChatRoom.Status.INACTIVE) {
            throw new BusinessException(ErrorCode.CHATROOM_INACTIVE, "비활성화된 채팅방입니다.");
        }

        if (chatRoomMemberRepository.existsByRoomIdAndUserId(roomId, request.getId())) {
            throw new BusinessException(ErrorCode.CHATROOM_ALREADY_MEMBER, "이미 채팅방에 참여중입니다.");
        }

        int currentMemberCount = chatRoomMemberRepository.countMembersByRoomId(roomId);
        if (currentMemberCount >= chatRoom.getMemberLimit()) {
            throw new BusinessException(ErrorCode.CHATROOM_FULL, "채팅방 인원이 가득 찼습니다.");
        }

        User user = userRepository.getReferenceById(request.getId());

        ChatMessage lastMessage = chatMessageRepository
                .findFirstByRoomIdOrderByCreatedAtDesc(roomId)
                .orElse(null);

        int lastMessageId = lastMessage != null ? lastMessage.getId() : 0;

        ChatRoomMember newMember = ChatRoomMember.create(
                chatRoom,
                user,
                request.getNickname(),
                MemberRole.MEMBER,
                lastMessageId
        );

        chatRoomMemberRepository.save(newMember);

        log.info("서비스: 채팅방 입장 완료 - roomId: {}, userId: {}", roomId, request.getId());

        return new CreateResponse(roomId);
    }

    @Override
    public CreateResponse createDirectChatRoom(int targetUserId, int currentUserId) {
        log.info("서비스: 1:1 채팅방 생성 시작 - targetUserId: {}, currentUserId: {}",
                targetUserId, currentUserId);

        // 자기 자신과의 채팅방 생성 방지
        if (targetUserId == currentUserId) {
            throw new BusinessException(ErrorCode.CHATROOM_SELF_CHAT_DENIED, "자기 자신과 채팅할 수 없습니다.");
        }

        // 이미 존재하는 1:1 채팅방 확인
        Optional<ChatRoom> existingRoom = chatRoomRepository
                .findExistingDirectChatRoom(currentUserId, targetUserId);

        if (existingRoom.isPresent()) {
            log.info("서비스: 이미 존재하는 채팅방 반환 - roomId: {}", existingRoom.get().getId());
            return new CreateResponse(existingRoom.get().getId());
        }

        // 대화 상대 존재 확인
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "존재하지 않는 사용자입니다."));

        User currentUser = userRepository.getReferenceById(currentUserId);

        // 채팅방 생성
        ChatRoom newRoom = ChatRoom.createDirectRoom(
                currentUser,
                String.format("%s,%s", currentUser.getNickname(), targetUser.getNickname())
        );
        newRoom.updateCreatedAt(timeZoneConverter.convertUtcToSeoul(LocalDateTime.now()));

        ChatRoom savedRoom = chatRoomRepository.save(newRoom);

        // 채팅방 멤버 추가
        ChatRoomMember currentMember = ChatRoomMember.create(savedRoom, currentUser, currentUser.getNickname(), MemberRole.MEMBER, 0);
        ChatRoomMember targetMember = ChatRoomMember.create(savedRoom, targetUser, targetUser.getNickname(), MemberRole.MEMBER, 0);
        currentMember.updateCreatedAt(timeZoneConverter.convertUtcToSeoul(LocalDateTime.now()));
        targetMember.updateCreatedAt(timeZoneConverter.convertUtcToSeoul(LocalDateTime.now()));

        chatRoomMemberRepository.save(currentMember);
        chatRoomMemberRepository.save(targetMember);

        String systemMessage = String.format("%s님이 ", currentMember.getNickname()) +
                targetMember.getNickname() +
                "님을 초대하였습니다.";
        createSystemMessage(savedRoom, systemMessage);

        log.info("서비스: 1:1 채팅방 생성 완료 - roomId: {}", savedRoom.getId());

//        List<ChatRoomMember> members = List.of(currentMember, targetMember);
//        notificationService.notifyNewChatRoom(savedRoom, members);

        return new CreateResponse(savedRoom.getId());
    }

    @Override
    @Transactional
    public CreateResponse createMultiChatRoom(MultiChatRoomCreate request, int userId) {
        log.info("서비스: 단체 채팅방 생성 시작 - userId: {}, memberCount: {}",
                userId, request.getUsers().size() + 1);

        // 방장 유저 조회
        User creator = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "존재하지 않는 사용자입니다."));

        // 초대할 유저들 존재 여부 확인
        List<User> members = request.getUsers().stream()
                .map(member -> userRepository.findById(member.getId())
                        .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND,
                                String.format("존재하지 않는 사용자입니다. (userId: %d)", member.getId()))))
                .collect(Collectors.toList());

        // 채팅방 이름 생성 (방장 포함 모든 멤버의 닉네임을 ", "로 구분)
        String roomName = creator.getNickname() + ", " +
                request.getUsers().stream()
                        .map(ChatRoomEntryExitCreate::getNickname)
                        .collect(Collectors.joining(", "));

        // 채팅방 생성
        ChatRoom newRoom = ChatRoom.createMultiRoom(
                creator,
                roomName,
                request.getUsers().size() + 1
        );
        newRoom.updateCreatedAt(timeZoneConverter.convertUtcToSeoul(LocalDateTime.now()));

        ChatRoom savedRoom = chatRoomRepository.save(newRoom);

        // 방장 멤버 추가
        ChatRoomMember creatorMember = ChatRoomMember.create(
                savedRoom,
                creator,
                creator.getNickname(),
                MemberRole.ADMIN,
                0
        );
        creatorMember.updateCreatedAt(timeZoneConverter.convertUtcToSeoul(LocalDateTime.now()));
        chatRoomMemberRepository.save(creatorMember);

        // 초대된 멤버들 추가
        for (int i = 0; i < members.size(); i++) {
            User member = members.get(i);
            ChatRoomEntryExitCreate memberDto = request.getUsers().get(i);
            log.info("현재 멤버 id: {}, nickname: {}", memberDto.getId(), memberDto.getNickname());

            ChatRoomMember newMember = ChatRoomMember.create(
                    savedRoom,
                    member,
                    memberDto.getNickname(),  // DTO에서 제공된 닉네임 사용
                    MemberRole.MEMBER,
                    0
            );
            newMember.updateCreatedAt(timeZoneConverter.convertUtcToSeoul(LocalDateTime.now()));
            chatRoomMemberRepository.save(newMember);
        }

        // 시스템 메시지 생성
        String systemMessage = String.format("%s님이 ", creator.getNickname()) +
                request.getUsers().stream()
                        .map(ChatRoomEntryExitCreate::getNickname)
                        .collect(Collectors.joining(", ")) +
                "님을 초대하였습니다.";
        createSystemMessage(savedRoom, systemMessage);

        log.info("서비스: 단체 채팅방 생성 완료 - roomId: {}", savedRoom.getId());

//        List<ChatRoomMember> allMembers = chatRoomMemberRepository
//                .findAllByRoomId(savedRoom.getId());
//        notificationService.notifyNewChatRoom(savedRoom, allMembers);

        return new CreateResponse(savedRoom.getId());
    }

    @Override
    public ChatRoomLimitResponse updateMemberLimit(int roomId, int newLimit, int userId) {
        log.info("서비스: 채팅방 최대 인원 변경 시작 - roomId: {}, newLimit: {}, userId: {}",
                roomId, newLimit, userId);

        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CHATROOM_NOT_FOUND, "존재하지 않는 채팅방입니다."));

        validateRoomStatus(chatRoom);
        validateRoomType(chatRoom);
        validateCreator(chatRoom, userId);
        validateNewLimit(chatRoom, newLimit);

        chatRoom.updateMemberLimit(newLimit);

        log.info("서비스: 채팅방 최대 인원 변경 완료 - roomId: {}, newLimit: {}", roomId, newLimit);

        return new ChatRoomLimitResponse(roomId, newLimit);
    }

    @Override
    @Transactional
    public CreateResponse createMultiChatRoomInPost(int currentUserId, Post post, String postName, int chatSize) {
        log.info("서비스: 게시글 채팅방 생성 시작 - userId: {}, postId: {}, chatSize: {}", currentUserId, post.getPostId(), chatSize);

        // 방장 유저 조회
        User creator = userRepository.findById(currentUserId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "존재하지 않는 사용자입니다."));

        // 이미 해당 게시글의 채팅방이 존재하는지 확인
        Optional<ChatRoom> existingRoom = chatRoomRepository.findChatRoomByPost_PostId(post.getPostId());
        if (existingRoom.isPresent()) {
            log.info("서비스: 이미 존재하는 채팅방 반환 - roomId: {}", existingRoom.get().getId());
            return new CreateResponse(existingRoom.get().getId());
        }

        // 채팅방 생성 (방장만 포함된 채팅방)
        ChatRoom newRoom = ChatRoom.createPostRoom(
                creator,
                post,
                postName,
                chatSize
        );
        newRoom.updateCreatedAt(timeZoneConverter.convertUtcToSeoul(LocalDateTime.now()));

        ChatRoom savedRoom = chatRoomRepository.save(newRoom);

        // 방장 멤버 추가
        ChatRoomMember creatorMember = ChatRoomMember.create(
                savedRoom,
                creator,
                creator.getNickname(),
                MemberRole.ADMIN,
                0
        );
        creatorMember.updateCreatedAt(timeZoneConverter.convertUtcToSeoul(LocalDateTime.now()));
        chatRoomMemberRepository.save(creatorMember);

        // 시스템 메시지 생성
        String systemMessage = String.format("%s님이 채팅방을 생성하였습니다.", creator.getNickname());
        createSystemMessage(savedRoom, systemMessage);

        log.info("서비스: 게시글 채팅방 생성 완료 - roomId: {}", savedRoom.getId());

        return new CreateResponse(savedRoom.getId());
    }


    private void validateRoomStatus(ChatRoom chatRoom) {
        if (chatRoom.getStatus() == ChatRoom.Status.INACTIVE) {
            throw new BusinessException(ErrorCode.CHATROOM_INACTIVE, "비활성화된 채팅방입니다.");
        }
    }

    private void validateRoomType(ChatRoom chatRoom) {
        if (chatRoom.getRoomType() == ChatRoom.RoomType.PRIVATE) {
            throw new BusinessException(ErrorCode.CHATROOM_UPDATE_DENIED,"1:1 채팅방은 인원 제한을 변경할 수 없습니다.");
        }
    }

    private void validateCreator(ChatRoom chatRoom, int userId) {
        if (chatRoom.getCreator().getId() != userId) {
            throw new BusinessException(ErrorCode.CHATROOM_ADMIN_REQUIRED, "채팅방 생성자만 인원 제한을 변경할 수 있습니다.");
        }
    }

    private void validateNewLimit(ChatRoom chatRoom, int newLimit) {
        if (newLimit < 2) {
            throw new BusinessException(ErrorCode.CHATROOM_INVALID_MEMBER_LIMIT, "채팅방 최대 인원은 2명 이상이어야 합니다.");
        }

        int currentMemberCount = chatRoomMemberRepository.countMembersByRoomId(chatRoom.getId());
        if (newLimit < currentMemberCount) {
            throw new BusinessException(ErrorCode.CHATROOM_INVALID_MEMBER_LIMIT,
                    String.format("현재 참여 중인 인원(%d명)보다 적게 설정할 수 없습니다.", currentMemberCount)
            );
        }
    }

    private void createSystemMessage(ChatRoom chatRoom, String content) {
        ChatMessage systemMessage = ChatMessage.createSystemMessage(chatRoom, content);
        systemMessage.updateCreatedAt(timeZoneConverter.convertUtcToSeoul(LocalDateTime.now()));
        chatMessageRepository.save(systemMessage);
    }

    private void handlePrivateRoomDeletion(ChatRoom chatRoom, int userId) {
        // 개인 채팅방의 경우 양쪽 다 나가야 삭제
        List<ChatRoomMember> members = chatRoomMemberRepository.findAllByRoomId(chatRoom.getId());

        // 현재 사용자의 멤버십만 INACTIVE로 변경
        ChatRoomMember currentMember = members.stream()
                .filter(m -> m.getUser().getId() == userId)
                .findFirst()
                .orElseThrow(() -> new BusinessException(ErrorCode.CHATROOM_MEMBER_NOT_FOUND, "채팅방 멤버가 아닙니다."));

        chatRoomMemberRepository.delete(currentMember);

        // 모든 멤버가 나갔는지 확인
        if (chatRoomMemberRepository.countByRoomId(chatRoom.getId()) == 0) {
            chatRoom.deactivate();
            chatRoomRepository.save(chatRoom);
        }
    }

    private ScrollResponse<ChatRoomList> processRoomResults(List<ChatRoom> rooms, int size, int userId) {
        if (rooms.isEmpty()) {
            return new ScrollResponse<>(
                    Collections.emptyList(),
                    new ChatCursorPageMetaInfo(LocalDateTime.now(), 0, false)
            );
        }

        boolean hasNext = rooms.size() > size;
        if (hasNext) {
            rooms = rooms.subList(0, size);
        }

        List<ChatRoomList> chatRoomLists = rooms.stream()
                .limit(size)
                .map(room -> convertToChatRoomList(room, userId))
                .collect(Collectors.toList());

        ChatRoom lastRoom = rooms.get(rooms.size() - 1);
        LocalDateTime lastMessageTime = chatMessageRepository.findLastMessageTimeByRoomId(lastRoom.getId());
        if (lastMessageTime == null) {
            lastMessageTime = lastRoom.getCreatedAt();
        }

        return new ScrollResponse<>(
                chatRoomLists,
                new ChatCursorPageMetaInfo(lastMessageTime, lastRoom.getId(), hasNext)
        );
    }

    private ChatRoomList convertToChatRoomList(ChatRoom room, int userId) {
        int memberCount = chatRoomMemberRepository.countByRoomId(room.getId());

        ChatMessage lastMessage = chatMessageRepository
                .findFirstByRoomIdOrderByCreatedAtDesc(room.getId())
                .orElse(null);

        ChatRoomMember member = chatRoomMemberRepository
                .findByRoomIdAndUserId(room.getId(), userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CHATROOM_MEMBER_NOT_FOUND, "채팅방 멤버가 아닙니다."));

        int unreadCount = chatMessageRepository
                .countUnreadMessages(room.getId(), member.getLastReadMessageId());

        return ChatRoomList.builder()
                .id(room.getId())
                .title(room.getRoomName())
                .thumbnailUrl(room.getThumbnailUrl())
                .memberNum(memberCount)
                .lastMessage(lastMessage != null ? lastMessage.getContent() : "")
                .lastMessageTime(lastMessage != null ? lastMessage.getCreatedAt().toString() : "")
                .unReadNum(unreadCount)
                .build();
    }

}
