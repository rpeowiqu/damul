package com.damul.api.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    // 토큰 관련 에러
    TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "만료된 토큰입니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."),
    REFRESH_TOKEN_NOT_FOUND(HttpStatus.UNAUTHORIZED, "리프레시 토큰을 찾을 수 없습니다."),

    // 중복 관련 에러
    DUPLICATE_EMAIL(HttpStatus.CONFLICT, "이미 등록된 이메일입니다."),

    // 데이터베이스 관련 에러
    DATABASE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "데이터베이스 오류가 발생했습니다."),

    // 팔로우 관련 에러
    FOLLOW_ERROR(HttpStatus.BAD_REQUEST, "팔로우 처리 중 오류가 발생했습니다."),
    FOLLOW_NOT_FOUND(HttpStatus.NOT_FOUND, "팔로우 관계가 존재하지 않습니다."),


    // 유저 관련 에러
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 유저 ID가 존재하지 않습니다"),
    ADMIN_NOT_FOUND(HttpStatus.NOT_FOUND, "관리자 계정이 존재하지 않습니다"),

    // 유효성 검증
    INVALID_ID(HttpStatus.BAD_REQUEST, "유효하지 않은 사용자 ID가 포함되어 있습니다."),
    INVALED_TARGETID(HttpStatus.BAD_REQUEST, "자기 자신을 팔로우할 수 없습니다."),


    // 게시글 관련 에러
    BOARD_NOT_FOUND(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다.");

    private final HttpStatus status;
    private final String message;

    ErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }
}
