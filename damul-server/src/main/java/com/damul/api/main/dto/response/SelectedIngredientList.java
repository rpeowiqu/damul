package com.damul.api.main.dto.response;

import com.damul.api.main.entity.UserIngredient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SelectedIngredientList {

    private List<UserIngredientList> userIngredients;

    public static SelectedIngredientList from(List<UserIngredient> entities) {
        List<UserIngredientList> list = entities.stream()
                .map(UserIngredientList::from)
                .collect(Collectors.toList());
        return new SelectedIngredientList(list);
    }

}
