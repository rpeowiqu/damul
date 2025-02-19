package com.damul.api.common.sse;

import com.damul.api.common.sse.service.SseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/v1/sse")
@RequiredArgsConstructor
@CrossOrigin(origins = "${redirect.frontUrl}", allowCredentials = "true")
@Slf4j
public class SseController {
    private final SseService sseService;

    @GetMapping(value = "/connect/{userId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter connect(@PathVariable int userId) {
        log.info("SSE 연결 요청 - userId: {}", userId);
        return sseService.createEmitter(userId);
    }
}