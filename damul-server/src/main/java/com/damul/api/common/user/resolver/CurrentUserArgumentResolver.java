package com.damul.api.common.user.resolver;

import com.damul.api.auth.entity.User;
import com.damul.api.common.user.CurrentUser;
import com.damul.api.common.user.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.core.MethodParameter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Component
@RequiredArgsConstructor
public class CurrentUserArgumentResolver implements HandlerMethodArgumentResolver {

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
                && parameter.getParameterType().equals(User.class);
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
        if (authentication == null) {
            return null;
        }



        // Principal이 CustomUserDetails 타입인지 확인하고
        // CustomUserDetails에서 User 객체를 추출하여 반환
        if (authentication.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) authentication.getPrincipal()).getUser();
        }

        return null; // CustomUserDetails가 아닌 경우 null 반환
    }
}