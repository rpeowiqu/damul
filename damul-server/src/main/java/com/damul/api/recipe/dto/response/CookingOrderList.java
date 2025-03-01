package com.damul.api.recipe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CookingOrderList {
    private int id;
    private String content;
    private String imageUrl;
}
