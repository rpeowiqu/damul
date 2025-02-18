package com.damul.api.auth.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Optional;

@Slf4j
@Component
public class CookieUtil {

    @Value("${spring.config.profiles.active}")
    private String activeProfile;

    public void addCookie(HttpServletResponse response, String name,  String value, long maxAge) {
        log.debug("쿠키 생성 시작 - 이름: {}, 만료시간: {}초", name, maxAge);


        ResponseCookie.ResponseCookieBuilder cookieBuilder = ResponseCookie.from(name, value)
                .path("/")
                .sameSite("Lax")
                .httpOnly(true)
                .maxAge(maxAge);


        // 환경에 따른 설정 분기
        if ("local".equals(activeProfile)) {
            cookieBuilder
                    .domain("localhost")
                    .secure(false);
            log.debug("로컬 환경 쿠키 설정 적용");
        } else {
            cookieBuilder
                    .domain("i12a306.p.ssafy.io")
                    .secure(true);
            log.debug("운영 환경 쿠키 설정 적용");
        }

        ResponseCookie cookie = cookieBuilder.build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        log.debug("쿠키 생성 완료 - 환경: {}, 설정: {}", activeProfile, cookie);
    }

    /**
     * 쿠키 삭제
     * addCookie와 동일한 형식으로 맞추고, 실제 응답에 쿠키를 추가하도록 수정
     */
    public void deleteCookie(HttpServletResponse response, String name) {
        log.info("쿠키 삭제 시작 - 이름: {}", name);

        // 쿠키 삭제를 위한 더 명확한 설정
        ResponseCookie cookie = ResponseCookie.from(name, "")
                .path("/")
                .maxAge(0)  // 만료 시간을 0으로
                .httpOnly(true)
                .sameSite("Lax")  // None 대신 Lax 권장
                .domain(activeProfile.equals("local") ? "localhost" : "i12a306.p.ssafy.io")
                .secure(activeProfile.equals("prod"))  // 로컬일 때만 secure false
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        log.debug("쿠키 삭제 완료 - 이름: {}, 환경: {}", name, activeProfile);
    }

    /**
     * 특정 이름의 쿠키를 찾아서 반환
     */
    public Optional<Cookie> getCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        log.debug("Received cookies: {}", Arrays.toString(cookies));

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(name)) {
                    log.debug("쿠키 조회 성공 - 이름: {}, 값: {}", name, cookie.getValue());
                    return Optional.of(cookie);
                }
            }
        }

        log.debug("쿠키를 찾을 수 없음 - 이름: {}", name);
        return Optional.empty();
    }
}