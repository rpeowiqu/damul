package com.damul.api.common.sse;

import com.damul.api.common.sse.service.SseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/v1/sse")
@RequiredArgsConstructor
@Slf4j
public class SseController {
    private final SseService sseService;

    @GetMapping("/connect/{userId}")
    public SseEmitter connect(@PathVariable int userId) {
        log.info("SSE 연결 요청 - userId: {}", userId);
        return sseService.createEmitter(userId);
    }
}