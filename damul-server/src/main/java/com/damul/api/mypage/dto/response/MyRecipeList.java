package com.damul.api.mypage.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MyRecipeList {

    private int id;
    private String title;
    private String content;
    private String thumbnailUrl;
    private String createdAt;

}
