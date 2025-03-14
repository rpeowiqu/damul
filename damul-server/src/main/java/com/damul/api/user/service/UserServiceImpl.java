package com.damul.api.user.service;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.auth.entity.User;
import com.damul.api.chat.dto.request.ChatRoomEntryExitCreate;
import com.damul.api.chat.entity.ChatRoom;
import com.damul.api.chat.entity.ChatRoomMember;
import com.damul.api.chat.repository.ChatRoomMemberRepository;
import com.damul.api.chat.repository.ChatRoomRepository;
import com.damul.api.common.dto.response.CreateResponse;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.common.scroll.util.ScrollCursor;
import com.damul.api.common.scroll.util.ScrollUtil;
import com.damul.api.config.service.S3Service;
import com.damul.api.user.dto.request.SettingUpdate;
import com.damul.api.user.dto.response.SettingResponse;
import com.damul.api.user.dto.response.UserList;
import com.damul.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final S3Service s3Service;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;

    private final String DEFAULT_BACKGROUND_IMAGE = "https://damulbucket.s3.ap-northeast-2.amazonaws.com/b7aee2b6-fbbe-4919-b98e-4d9f25ac9349-profile-background.jpg";
    private final String DEFAULT_PROFILE_IMAGE = "https://damulbucket.s3.ap-northeast-2.amazonaws.com/81a469ff-3e77-498b-ab9c-9f293826f784-profile.png";
    // 닉네임 중복 확인
    @Override
    public boolean checkNicknameDuplication(String nickname) {
        log.info("닉네임 중복확인 시작 - nickname: {}", nickname);
        return userRepository.existsByNickname(nickname);
    }

    // 설정 조회
    @Override
    public SettingResponse getSetting(int userId) {
        log.info("설정 조회 시작 - userId: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.error("해당 유저를 찾을 수 없습니다. - userId: {}", userId);
                    return new BusinessException(ErrorCode.USER_FORBIDDEN);
                });

        SettingResponse settingResponse = SettingResponse.builder()
                .email(user.getEmail())
                .nickname(user.getNickname())
                .profileImageUrl(user.getProfileImageUrl())
                .selfIntroduction(user.getSelfIntroduction())
                .profileBackgroundImageUrl(user.getProfileBackgroundImageUrl())
                .accessRange(user.getAccessRange().name())
                .warningEnabled(user.isWarningEnabled())
                .build();
        return settingResponse;
    }

    // 설정 수정
    @Override
    @Transactional
    public void updateUserSettings(int userId, SettingUpdate setting, MultipartFile profileImage,
                              MultipartFile backgroundImage) {
        log.info("설정 수정 시작 - userId: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.error("해당 유저를 찾을 수 없습니다. - userId: {}", userId);
                    return new BusinessException(ErrorCode.USER_FORBIDDEN);
                });
        log.info("유저 검색 완료 - userNickname: {}", user.getNickname());

        log.info("backgroundImage : {}", backgroundImage);
        log.info("profileImage : {}", profileImage);
        // 프로필 이미지 처리
        if (profileImage != null && !profileImage.isEmpty()) {
            validateImageFile(profileImage);

            // OAuth2로 받은 프로필 이미지인지 확인
            String existingProfileImageUrl = user.getProfileImageUrl();
            if (StringUtils.hasText(existingProfileImageUrl) && !existingProfileImageUrl.startsWith("http")) {
                log.info("프로필 이미지 이름 - existingProfileImageUrl: {}", existingProfileImageUrl);
                // S3에 저장된 이미지일 경우에만 삭제
                String profileName = s3Service.extractFileNameFromUrl(existingProfileImageUrl);
                log.info("프로필 이미지 삭제 - profileName: {}", profileName);
                s3Service.deleteFile(profileName);
                log.info("프로필 이미지 삭제 완료");
            }

            log.info("새로운 프로필 이미지 업로드 시작");
            String profileImageUrl = s3Service.uploadFile(profileImage);
            log.info("새로운 프로필 이미지 업로드 완료 - profileImageUrl: {}", profileImageUrl);
            setting.setProfileImageUrl(profileImageUrl);
        } else { // 새로운 이미지 없음
            log.info("이미지 파일 없음");
            if(setting.isProfileImageDefault()) {
                log.info("프로필 사진 기본이미지로 변경");
                setting.setProfileImageUrl(DEFAULT_PROFILE_IMAGE);
            }

            if(setting.isBackgroundImageDefault()) {
                log.info("배경 사진 기본이미지로 변경");
                setting.setBackgroundImageUrl(DEFAULT_BACKGROUND_IMAGE);
            }
        }

        // 배경 이미지 처리
        if (backgroundImage != null && !backgroundImage.isEmpty()) {
            validateImageFile(backgroundImage);
            // OAuth2로 받은 배경 이미지인지 확인
            String existingBackgroundImageUrl = user.getProfileBackgroundImageUrl();
            if (StringUtils.hasText(existingBackgroundImageUrl) && !existingBackgroundImageUrl.startsWith("http")) {
                // S3에 저장된 이미지일 경우에만 삭제
                String backgroundName = s3Service.extractFileNameFromUrl(existingBackgroundImageUrl);
                log.info("배경 이미지 삭제 - backgroundImgUrl: {}", backgroundName);
                s3Service.deleteFile(backgroundName);
                log.info("배경 이미지 삭제 완료");
            }

            log.info("새로운 배경 이미지 업로드 시작");
            String backgroundImageUrl = s3Service.uploadFile(backgroundImage);
            log.info("새로운 배경 이미지 업로드 완료 - backgroundImageUrl: {}", backgroundImageUrl);
            setting.setBackgroundImageUrl(backgroundImageUrl);
        }

        String nickname = user.getNickname();
        // 사용자 설정 업데이트
        user.updateSettings(setting);
        if(!nickname.equals(user.getNickname())) {
            List<ChatRoom> chatRooms = chatRoomRepository.findChatRoomsByUserId(userId);
            chatRooms.stream().forEach(chatRoom -> {
                if(chatRoom.getPost() == null) {
                    List<ChatRoomMember> members = chatRoomMemberRepository.findAllByRoomId(chatRoom.getId());
                    String roomName = members.stream()
                            .map(ChatRoomMember::getNickname)
                            .collect(Collectors.joining(", "));
                    chatRoom.updateRoomName(roomName);
                }
            });
        }
        log.info("설정 수정 성공");
    }

    private Object extractKeyFromUrl(String profileImageUrl) {
        // S3 URL에서 key를 추출하는 로직 (예: "https://damulbucket.s3.amazonaws.com/path/to/file.jpg" -> "path/to/file.jpg")
        return profileImageUrl.substring(profileImageUrl.indexOf(".com/") + 5);
    }

    // 사용자 목록 조회 및 검색
    @Override
    public ScrollResponse<UserList> getSearchUserList(int cursor, int size, String keyword) {
        if(keyword == null || keyword.isEmpty()) {
            log.info("검색어 없음");
            throw new BusinessException(ErrorCode.USER_NICKNAME_NOT_PROVIDED);
        }

        String startsWith = keyword + "%"; // 검색어로 시작하는 경우
        Pageable pageable = PageRequest.of(0, size + 1);

        log.info("검색어 있음 - 검색어 포함: {}, 정확히 일치: {}, 검색어 시작:{}", cursor, pageable, startsWith);
        List<UserList> userList = userRepository.findByNicknameContainingWithPaging(startsWith, cursor, pageable);

        log.info("사용자 목록 검색 조회 성공");
        return ScrollUtil.createScrollResponse(userList, cursor, size);
    }


    // 이미지 유효성 검사 메서드
    private void validateImageFile(MultipartFile file) {
        // 파일 크기 제한 (예: 10MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            log.error("파일 사이즈 ERROR - fileSize: {}", file.getSize());
            throw new BusinessException(ErrorCode.FILE_SIZE_EXCEEDED);
        }

        // 파일 이름에서 확장자 추출
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new BusinessException(ErrorCode.INVALID_FILE_TYPE);
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
        List<String> allowedExtensions = List.of("jpg", "jpeg", "png", "gif", "bmp", "webp");

        if (!allowedExtensions.contains(extension)) {
            throw new BusinessException(ErrorCode.INVALID_FILE_TYPE);
        }
    }

}
