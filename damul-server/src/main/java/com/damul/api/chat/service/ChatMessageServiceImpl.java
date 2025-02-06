package com.damul.api.chat.service;

import com.damul.api.chat.entity.ChatMessage;
import com.damul.api.chat.repository.ChatMessageRepository;
import com.damul.api.common.dto.request.ScrollRequest;
import com.damul.api.common.dto.response.CursorPageMetaInfo;
import com.damul.api.common.dto.response.ScrollResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class ChatMessageServiceImpl implements ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;

    @Override
    public ScrollResponse<ChatMessage> getChatMessages(int roomId, ScrollRequest request) {
        List<ChatMessage> messages;
        if (request.getCursorId() == 0) {
            messages = chatMessageRepository.findFirstPageByRoomId(roomId, request.getSize());
        } else {
            messages = chatMessageRepository.findByRoomIdAndIdLessThanOrderByIdDesc(
                    roomId, request.getCursorId(), request.getSize());
        }

        if (messages.isEmpty()) {
            return new ScrollResponse<>(Collections.emptyList(),
                    new CursorPageMetaInfo(0, false));
        }

        int nextCursor = messages.get(messages.size() - 1).getId();
        boolean hasNext = chatMessageRepository.existsByRoomIdAndIdLessThan(roomId, nextCursor);

        return new ScrollResponse<>(messages, new CursorPageMetaInfo(nextCursor, hasNext));
    }
}
