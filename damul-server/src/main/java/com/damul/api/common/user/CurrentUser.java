package com.damul.api.common.user;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.PARAMETER)  // 파라미터에만 사용할 수 있도록
@Retention(RetentionPolicy.RUNTIME)  // 런타임까지 어노테이션 정보가 유지되도록
public @interface CurrentUser {
}