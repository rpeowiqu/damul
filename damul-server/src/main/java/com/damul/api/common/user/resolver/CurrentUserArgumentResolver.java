package com.damul.api.common.user.resolver;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.auth.entity.User;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.common.user.CurrentUser;
import com.damul.api.common.user.CustomUserDetails;
import com.damul.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.MethodParameter;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class CurrentUserArgumentResolver implements HandlerMethodArgumentResolver {
    private final UserRepository userRepository;

    /**
     * 주어진 파라미터가 이 리졸버에 의해 처리될 수 있는지 확인합니다.
     * @param parameter 컨트롤러 메소드의 파라미터 정보
     * @return @CurrentUser 어노테이션이 있고 타입이 User인 경우 true, 아니면 false
     */
    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        // 1. parameter.hasParameterAnnotation(CurrentUser.class): 파라미터에 @CurrentUser 어노테이션이 있는지 확인
        // 2. parameter.getParameterType().equals(User.class): 파라미터의 타입이 User 클래스인지 확인
        // 두 조건이 모두 만족해야 이 리졸버가 해당 파라미터를 처리
        return parameter.hasParameterAnnotation(CurrentUser.class)
                && parameter.getParameterType().equals(UserInfo.class); // User 대신 UserInfo로 변경
    }


    /**
     * 실제로 파라미터의 값을 해석하여 반환합니다.
     * @param parameter 컨트롤러 메소드의 파라미터 정보
     * @param mavContainer Model 및 View 컨테이너
     * @param webRequest 현재의 웹 요청
     * @param binderFactory 데이터 바인딩에 사용되는 팩토리
     * @return 현재 인증된 사용자의 User 객체, 인증 정보가 없으면 null
     */
    @Override
    public Object resolveArgument(MethodParameter parameter,
                                  ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest,
                                  WebDataBinderFactory binderFactory) {

        // SecurityContext에서 현재 인증 정보를 가져옴
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info("Authentication 객체: {}", authentication);
        log.info("Principal 타입: {}", authentication.getPrincipal().getClass());
        log.info("Authentication Details: {}", authentication.getDetails());


        if (authentication == null || authentication instanceof AnonymousAuthenticationToken) {
            throw new BusinessException(ErrorCode.INVALID_TOKEN);
        }


        // 인증된 사용자의 이메일 또는 식별자 추출
        UserInfo userInfo = (UserInfo) authentication.getPrincipal();
        String userIdentifier = userInfo.getNickname();
        int userId = userInfo.getId();
        log.info("userIdentifier: {}", userIdentifier);
        log.info("userId: {}", userId);

        // 데이터베이스에서 사용자 정보 조회
        Optional<User> userOptional = userRepository.findById(userId);


        if (userOptional.isEmpty()) {
            log.warn("해당 ID로 사용자를 찾을 수 없음: {}", userId);
            return null;
        }

        User user = userOptional.get();
        log.info("찾은 사용자 정보 - ID: {}, Email: {}, Nickname: {}",
                user.getId(), user.getEmail(), user.getNickname());

        return new UserInfo(user.getId(), user.getEmail(), user.getNickname(), user.getRole().name());
    }
}