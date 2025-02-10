package com.damul.api.auth.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Slf4j
@Component
public class CookieUtil {
    public void addCookie(HttpServletResponse response, String name,  String value, long maxAge) {
        log.debug("쿠키 생성 시작 - 이름: {}, 만료시간: {}초", name, maxAge);


        ResponseCookie cookie = ResponseCookie.from(name, value)
                .path("/")
                .domain("localhost")
                .sameSite("Lax")
                .httpOnly(true)
                .secure(false)        // 개발 환경에서는 false, 운영에서는 true
                .maxAge(maxAge)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        log.debug("쿠키 생성 완료 - 설정: path=/, domain=localhost, sameSite=Lax, httpOnly=true, secure=false");

    }

    /**
     * 쿠키 삭제
     * addCookie와 동일한 형식으로 맞추고, 실제 응답에 쿠키를 추가하도록 수정
     */
    public void deleteCookie(HttpServletResponse response, String name) {
        log.debug("쿠키 삭제 시작 - 이름: {}", name);

        ResponseCookie cookie = ResponseCookie.from(name, "")
                .path("/")
                .domain("")
                .sameSite("Lax")
                .httpOnly(true)
                .secure(false)    // 개발 환경에서는 false, 운영에서는 true
                .maxAge(0)        // 즉시 만료
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        log.debug("쿠키 삭제 완료 - 이름: {}", name);
    }

    /**
     * 특정 이름의 쿠키를 찾아서 반환
     */
    public Optional<Cookie> getCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();

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