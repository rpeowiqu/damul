package com.damul.api.mypage.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BadgeDetail {

    private int id;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private double rank;
    private String achieveCond;

}
