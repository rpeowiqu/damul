package com.damul.api.chat.service;

import com.damul.api.chat.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UnreadMessageService {
    private final RedisTemplate<String, String> redisTemplate;
    private final ChatMessageRepository chatMessageRepository;
    private static final String UNREAD_COUNT_PREFIX = "unread:";

    private String getKey(int userId) {
        return UNREAD_COUNT_PREFIX + userId;
    }

    // 초기 카운트 설정 또는 갱신
    public void initializeUnreadCount(int userId) {
        int totalUnread = chatMessageRepository.countAllUnreadMessages(userId);
        redisTemplate.opsForValue().set(getKey(userId), String.valueOf(totalUnread));
    }

    // 메시지 발송 시 수신자들의 카운트 증가
    public void incrementUnreadCount(int userId) {
        String key = getKey(userId);
        String currentCount = redisTemplate.opsForValue().get(key);
        if (currentCount == null) {
            initializeUnreadCount(userId);
        } else {
            redisTemplate.opsForValue().increment(key);
        }
    }

    // 메시지 읽음 처리 시 카운트 감소
    public void decrementUnreadCount(int userId, int decrementCount) {
        String key = getKey(userId);
        String currentCount = redisTemplate.opsForValue().get(key);
        if (currentCount == null) {
            initializeUnreadCount(userId);
        } else {
            redisTemplate.opsForValue().decrement(key, decrementCount);
        }
    }

    // 현재 안 읽은 메시지 수 조회
    public int getUnreadCount(int userId) {
        String count = redisTemplate.opsForValue().get(getKey(userId));
        if (count == null) {
            initializeUnreadCount(userId);
            count = redisTemplate.opsForValue().get(getKey(userId));
        }
        return Integer.parseInt(count);
    }
}