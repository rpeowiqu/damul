package com.damul.api.user.controller;

import com.damul.api.auth.dto.UserInfo;
import com.damul.api.auth.repository.UserRepository;
import com.damul.api.common.user.CurrentUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;

    @GetMapping("{userId}/settings")
    public ResponseEntity<?> getSetting(@PathVariable int userId,
                                        @CurrentUser UserInfo user) {

    }
}
