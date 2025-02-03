package com.damul.api.main.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class HomeSuggestedResponse {

    private int userId;
    private List<SuggestedRecipeList> suggestedRecipes;

}
