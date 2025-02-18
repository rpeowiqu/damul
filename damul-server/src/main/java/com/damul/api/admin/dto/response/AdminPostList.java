package com.damul.api.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AdminPostList {

    private int id;
    private String title;
    private String nickname;
    private String postType;
    private String status;

}
