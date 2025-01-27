package com.damul.api.main.service;

import com.damul.api.main.dto.HomeResponse;

public interface HomeService {

    HomeResponse getUserIngredientList(int userId);

}
