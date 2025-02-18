package com.damul.api.common.sse.service;

import com.damul.api.common.sse.EmitterInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class SseService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final Map<Integer, SseEmitter> localEmitters = new ConcurrentHashMap<>();

    private static final String SSE_KEY_PREFIX = "sse:emitter:";
    private static final long TIMEOUT = 5 * 60 * 1000L; // 5분

    public SseEmitter createEmitter(int userId) {
        String redisKey = SSE_KEY_PREFIX + userId;
        SseEmitter emitter = new SseEmitter(TIMEOUT);

        emitter.onCompletion(() -> {
            log.info("SSE 연결 완료 - userId: {}", userId);
            removeEmitter(userId);
        });

        emitter.onTimeout(() -> {
            log.info("SSE 연결 타임아웃 - userId: {}", userId);
            emitter.complete();
            removeEmitter(userId);
        });

        emitter.onError(e -> {
            log.error("SSE 에러 발생 - userId: {}", userId, e);
            emitter.complete();
            removeEmitter(userId);
        });

        // Redis에 연결 정보 저장
        EmitterInfo emitterInfo = new EmitterInfo(userId, LocalDateTime.now().toString());
        redisTemplate.opsForValue().set(redisKey, emitterInfo, TIMEOUT, TimeUnit.MILLISECONDS);

        // 로컬 맵에도 저장
        localEmitters.put(userId, emitter);

        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("connected!"));
        } catch (IOException e) {
            log.error("초기 이벤트 전송 실패 - userId: {}", userId, e);
            removeEmitter(userId);
        }

        return emitter;
    }

    public void removeEmitter(int userId) {
        String redisKey = SSE_KEY_PREFIX + userId;
        redisTemplate.delete(redisKey);
        localEmitters.remove(userId);
        log.info("SSE 연결 제거 - userId: {}", userId);
    }

    public void sendToClient(int userId, Object data) {
        String redisKey = SSE_KEY_PREFIX + userId;

        // Redis에서 연결 정보 확인
        EmitterInfo emitterInfo = (EmitterInfo) redisTemplate.opsForValue().get(redisKey);
        if (emitterInfo == null) {
            log.warn("존재하지 않는 SSE 연결 - userId: {}", userId);
            return;
        }

        // 로컬 emitter 가져오기
        SseEmitter emitter = localEmitters.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name("image")
                        .data(data));
                log.info("OCR 결과 전송 성공 - userId: {}", userId);

                // TTL 갱신
                redisTemplate.expire(redisKey, TIMEOUT, TimeUnit.MILLISECONDS);
            } catch (IOException e) {
                log.error("OCR 결과 전송 실패 - userId: {}", userId, e);
                emitter.complete();
                removeEmitter(userId);
            }
        }
    }
}
