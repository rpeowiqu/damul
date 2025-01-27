package com.damul.api.main.service;

import com.damul.api.main.dto.HomeResponse;
import com.damul.api.main.dto.UserIngredientList;
import com.damul.api.main.entity.UserIngredient;
import com.damul.api.main.repository.UserIngredientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MainServiceImpl implements MainService {

    private final UserIngredientRepository userIngredientRepository;

    @Override
    @Transactional(readOnly = true)
    public HomeResponse getUserIngredientList(int userId) {
        // 1. 사용자의 재료 목록 조회
        List<UserIngredient> userIngredients = userIngredientRepository.findByUserId(userId);

        // 2. Entity를 DTO로 변환
        List<UserIngredientList> ingredientDtos = userIngredients.stream()
                .map(UserIngredientList::from)
                .collect(Collectors.toList());

        // 3. HomeResponse 생성 및 반환
        return new HomeResponse(ingredientDtos);
    }

}
