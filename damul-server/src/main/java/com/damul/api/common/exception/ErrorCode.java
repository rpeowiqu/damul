package com.damul.api.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    // 토큰 관련 에러
    TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "만료된 토큰입니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."),
    REFRESH_TOKEN_NOT_FOUND(HttpStatus.UNAUTHORIZED, "리프레시 토큰을 찾을 수 없습니다."),


    // 유효성 검증
    INVALID_ID(HttpStatus.BAD_REQUEST, "유효하지 않은 사용자 ID가 포함되어 있습니다."),
    INVALID_TARGET_ID(HttpStatus.BAD_REQUEST, "자기 자신을 팔로우할 수 없습니다."),
    INVALID_SEARCH_TYPE(HttpStatus.BAD_REQUEST, "검색타입이 존재하지 않습니다"),
    INVALID_COMMENT(HttpStatus.BAD_REQUEST, "댓글이 존재하지 않습니다"),
    INVALID_MONTH(HttpStatus.BAD_REQUEST, "유효하지 않은 월입니다. 1에서 12 사이의 값을 입력해주세요"),
    INVALID_PERIOD(HttpStatus.BAD_REQUEST, "유효하지 않은 PERIOD 입니다. yearly, recent 중 입력해주세요"),

    // 중복 관련 에러
    DUPLICATE_EMAIL(HttpStatus.CONFLICT, "이미 등록된 이메일입니다."),


    // API 요청 관련
    EXTERNAL_API_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "API 요청에 실패하였습니다"),
    DATA_ANALYSIS_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "최근 데이터 분석에 실패하였습니다"),

    // 데이터베이스 관련 에러
    DATABASE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "데이터베이스 오류가 발생했습니다"),

    // 팔로우 관련 에러
    FOLLOW_ERROR(HttpStatus.BAD_REQUEST, "팔로우 처리 중 오류가 발생했습니다."),
    FOLLOW_NOT_FOUND(HttpStatus.NOT_FOUND, "팔로우 관계가 존재하지 않습니다."),

    // 레시피 관련 에러
    RECIPE_ID_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 ID의 레시피가 존재하지 않습니다."),
    RECIPE_SAVE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "레시피 저장에 실패하였습니다."),
    RECIPE_UPDATE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "레시피 수정에 실패하였습니다"),

    // 댓글 관련 에러
    COMMENT_ID_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 ID의 댓글이 존재하지 않습니다."),
    PARENT_ID_NOT_FOUND(HttpStatus.NOT_FOUND, "현재 댓글의 부모댓글이 존재하지 않습니다."),


    // 유저 관련 에러
    USER_NICKNAME_NOT_PROVIDED(HttpStatus.BAD_REQUEST, "검색할 닉네임이 존재하지 않습니다."),
    USER_FORBIDDEN(HttpStatus.FORBIDDEN, "해당 유저 ID가 존재하지 않습니다"),
    ADMIN_FORBIDDEN(HttpStatus.FORBIDDEN, "관리자 계정이 존재하지 않습니다"),



    // 파일 관련 에러
    FILE_UPLOAD_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "파일 업로드 중 오류가 발생했습니다."),
    FILE_SIZE_EXCEEDED(HttpStatus.EXPECTATION_FAILED, "파일 사이즈가 너무 큽니다."),
    INVALID_FILE_TYPE(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "파일 타입을 확인해주세요."),
    FILE_DELETE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "파일 삭제를 실패하였습니다."),

    // 게시글 관련 에러
    BOARD_NOT_FOUND(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다."),

    // 채팅방 관련 에러
    CHATROOM_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 채팅방입니다."),
    CHATROOM_INACTIVE(HttpStatus.BAD_REQUEST, "비활성화된 채팅방입니다."),
    CHATROOM_MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "채팅방 멤버가 아닙니다."),
    NOT_ROOM_MEMBER(HttpStatus.FORBIDDEN, "채팅방 멤버가 아닙니다."),
    CHATROOM_ACCESS_DENIED(HttpStatus.FORBIDDEN, "채팅방 접근 권한이 없습니다."),
    CHATROOM_FULL(HttpStatus.BAD_REQUEST, "채팅방 인원이 가득 찼습니다."),
    CHATROOM_ALREADY_MEMBER(HttpStatus.CONFLICT, "이미 채팅방에 참여중입니다."),
    CHATROOM_INVALID_MEMBER_LIMIT(HttpStatus.BAD_REQUEST, "유효하지 않은 채팅방 인원 제한입니다."),
    CHATROOM_INVALID_TYPE(HttpStatus.BAD_REQUEST, "해당 작업이 불가능한 채팅방 타입입니다."),
    CHATROOM_ADMIN_REQUIRED(HttpStatus.FORBIDDEN, "방장 권한이 필요합니다."),
    CHATROOM_MEMBER_KICK_DENIED(HttpStatus.FORBIDDEN, "해당 멤버를 추방할 수 없습니다."),
    CHATROOM_SELF_CHAT_DENIED(HttpStatus.BAD_REQUEST, "자기 자신과 채팅할 수 없습니다."),
    CHATROOM_UPDATE_DENIED(HttpStatus.BAD_REQUEST, "채팅방 수정이 불가능합니다."),
    INVALID_MESSAGE_CURSOR(HttpStatus.BAD_REQUEST, "유효하지 않은 메시지 커서값입니다."),
    INVALID_MESSAGE_SIZE(HttpStatus.BAD_REQUEST, "유효하지 않은 메시지 조회 크기입니다."),


    // 식자재 관련 에러
    INGREDIENT_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 식자재를 찾을 수 없습니다."),
    INGREDIENT_ACCESS_DENIED(HttpStatus.FORBIDDEN, "해당 식자재에 접근 권한이 없습니다."),
    INGREDIENT_ALREADY_DELETED(HttpStatus.BAD_REQUEST, "이미 삭제된 식자재입니다."),
    INVALID_INGREDIENT_QUANTITY(HttpStatus.BAD_REQUEST, "유효하지 않은 식자재 수량입니다."),
    EMPTY_INGREDIENT_LIST(HttpStatus.BAD_REQUEST, "식자재 목록이 비어있습니다."),
    INVALID_STORAGE_TYPE(HttpStatus.BAD_REQUEST, "유효하지 않은 보관 방식입니다."),
    INVALID_SORT_DIRECTION(HttpStatus.BAD_REQUEST, "유효하지 않은 정렬 방향입니다."),
    INVALID_SORT_FIELD(HttpStatus.BAD_REQUEST, "유효하지 않은 정렬 기준입니다."),

    // 마이페이지 관련 에러
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 사용자입니다."),
    USER_INACTIVE(HttpStatus.FORBIDDEN, "비활성화된 사용자입니다."),
    BADGE_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 뱃지입니다."),
    USER_BADGE_NOT_FOUND(HttpStatus.NOT_FOUND, "획득하지 않은 뱃지입니다."),
    INVALID_PAGE_SIZE(HttpStatus.BAD_REQUEST, "유효하지 않은 페이지 크기입니다."),
    INVALID_CURSOR(HttpStatus.BAD_REQUEST, "유효하지 않은 커서값입니다."),
    PROFILE_ACCESS_DENIED(HttpStatus.FORBIDDEN, "프로필 접근 권한이 없습니다.");


    private final HttpStatus status;
    private final String message;

    ErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }
}
