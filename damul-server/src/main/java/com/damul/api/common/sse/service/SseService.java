package com.damul.api.common.sse.service;

import com.damul.api.common.sse.EmitterInfo;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class SseService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final Map<Integer, SseEmitter> localEmitters = new ConcurrentHashMap<>();

    private static final String SSE_KEY_PREFIX = "sse:emitter:";
    private static final long TIMEOUT = 10 * 60 * 1000L;

    public SseEmitter createEmitter(int userId) {
        String redisKey = SSE_KEY_PREFIX + userId;
        removeEmitter(userId);

        SseEmitter emitter = new SseEmitter(TIMEOUT);

        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("")
                    .id(String.valueOf(userId)));
        } catch (IOException e) {
            emitter.complete();
            throw new RuntimeException(e);
        }


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

        // 하트비트 스케줄러 추가
        ScheduledExecutorService heartbeatExecutor = Executors.newSingleThreadScheduledExecutor();
        heartbeatExecutor.scheduleAtFixedRate(() -> {
            try {
                if (localEmitters.containsKey(userId)) {
                    emitter.send(SseEmitter.event().name("heartbeat").data("ping"));
                    log.debug("Heartbeat sent to userId: {}", userId);
                } else {
                    heartbeatExecutor.shutdown();
                }
            } catch (IOException e) {
                log.error("Heartbeat 전송 실패 - userId: {}", userId, e);
                heartbeatExecutor.shutdown();
                emitter.complete();
                removeEmitter(userId);
            }
        }, 0, 30, TimeUnit.SECONDS);

        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("connected!"));
        } catch (IOException e) {
            log.error("초기 이벤트 전송 실패 - userId: {}", userId, e);
            heartbeatExecutor.shutdown();
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

        // Redis와 로컬 emitter 둘 다 확인
        boolean redisKeyExists = redisTemplate.hasKey(redisKey);
        boolean localEmitterExists = localEmitters.containsKey(userId);

        log.info("메시지 전송 시도 - userId: {}, Redis 키 존재: {}, 로컬 Emitter 존재: {}",
                userId, redisKeyExists, localEmitterExists);

        // 상태 불일치 감지 및 처리
        if (redisKeyExists && !localEmitterExists) {
            log.warn("상태 불일치 감지: Redis 키는 있지만 로컬 Emitter 없음 - 키 정리");
            redisTemplate.delete(redisKey);
            return;
        }

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
                // 이미 JSON 문자열인 경우는 변환하지 않음
                if (data instanceof String) {
                    emitter.send(SseEmitter.event()
                            .name("image")
                            .data(data));
                } else {
                    // JSON 변환 필요한 경우
                    emitter.send(SseEmitter.event()
                            .name("image")
                            .data(data)); // 여기서 변환하지 않고 Spring이 알아서 변환하도록 함
                }

                log.info("데이터 전송 성공 - userId: {}", userId);
                // TTL 갱신
                redisTemplate.expire(redisKey, TIMEOUT, TimeUnit.MILLISECONDS);
            } catch (IOException e) {
                log.error("데이터 전송 실패 - userId: {}", userId, e);
                emitter.complete();
                removeEmitter(userId);
            }
        }
    }

    public void checkConnection(int userId) {
        SseEmitter emitter = localEmitters.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name("check")
                        .data(""));
                log.debug("Connection check sent to userId: {}", userId);
            } catch (IOException e) {
                log.error("Connection check failed for userId: {}", userId);
                removeEmitter(userId);
            }
        }
    }

    @Scheduled(fixedRate = 30 * 1000) // 1분마다 실행
    public void checkAllConnections() {
        localEmitters.keySet().forEach(this::checkConnection);
        log.debug("Checked all SSE connections");
    }

}
