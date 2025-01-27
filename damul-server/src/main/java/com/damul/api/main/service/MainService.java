package com.damul.api.main.service;

import com.damul.api.main.dto.HomeResponse;

public interface MainService {

    HomeResponse getUserIngredientList(int userId);

}
