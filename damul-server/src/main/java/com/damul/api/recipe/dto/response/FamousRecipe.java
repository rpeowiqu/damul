package com.damul.api.recipe.dto.response;

import com.damul.api.recipe.entity.Tag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FamousRecipe {
    private int id;
    private List<TagDto> tag;
    private String title;
    private String thumbnailUrl;

    public FamousRecipe(int id, String title, String thumbnailUrl) {
        this.id = id;
        this.title = title;
        this.thumbnailUrl = thumbnailUrl;
        this.tag = new ArrayList<>();
    }

    public void setTag(List<TagDto> tag) {
        this.tag = tag;
    }
}


