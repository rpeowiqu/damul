package com.damul.api.mypage.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BadgeDetail {

    private int id;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private int level;
    private double rank;
    private String catchPhrase;

}
