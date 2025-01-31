package com.damul.api.auth.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class CookieUtil {
    public void addCookie(HttpServletResponse response, String name,  String value, int maxAge) {
        log.debug("쿠키 생성 시작 - 이름: {}, 만료시간: {}초", name, maxAge);


        ResponseCookie cookie = ResponseCookie.from(name, value)
                .path("/")
                .domain("")
                .sameSite("Lax")
                .httpOnly(true)
                .secure(false)        // 개발 환경에서는 false, 운영에서는 true
                .maxAge(maxAge)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        log.debug("쿠키 생성 완료 - 설정: path=/, domain=localhost, sameSite=Lax, httpOnly=true, secure=false");

    }

    // 쿠키 삭제용 메서드도 추가할 수 있음
    public static Cookie deleteCookie(String key) {
        Cookie cookie = new Cookie(key, "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        return cookie;
    }
}