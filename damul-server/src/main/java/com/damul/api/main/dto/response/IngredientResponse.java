package com.damul.api.main.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class IngredientResponse {

    private List<UserIngredientList> freezer;

    private List<UserIngredientList> fridge;

    private List<UserIngredientList> roomTemp;

}
