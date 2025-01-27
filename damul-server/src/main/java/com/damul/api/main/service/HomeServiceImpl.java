package com.damul.api.main.service;

import com.damul.api.main.dto.IngredientResponse;
import com.damul.api.main.dto.UserIngredientList;
import com.damul.api.main.entity.UserIngredient;
import com.damul.api.main.repository.UserIngredientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HomeServiceImpl implements HomeService {

    private final UserIngredientRepository userIngredientRepository;

    @Override
    @Transactional(readOnly = true)
    public IngredientResponse getUserIngredientList(int userId) {
        // 1. 사용자의 재료 목록 조회
        List<UserIngredient> userIngredients = userIngredientRepository.findByUserId(userId);

        // 2. Entity를 DTO로 변환
        List<UserIngredientList> ingredientDtos = userIngredients.stream()
                .map(UserIngredientList::from)
                .collect(Collectors.toList());

        // 3. HomeResponse 생성 및 반환
        return new IngredientResponse(ingredientDtos);
    }

    @Override
    public IngredientResponse getSearchUserIngredientList(int userId, String keyword, String orderByDir, String orderBy) {
        Sort.Direction direction = (orderByDir != null && orderByDir.equalsIgnoreCase("desc"))
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        String sortBy = "id"; // 기본값
        if (orderBy != null) {
            switch (orderBy.toLowerCase()) {
                case "quantity":
                    sortBy = "ingredientQuantity";
                    break;
                case "date":
                    sortBy = "dueDate";
                    break;
            }
        }

        Sort sort = Sort.by(direction, sortBy);
        List<UserIngredient> userIngredients = userIngredientRepository
                .findByUserIdAndKeyword(userId, keyword, sort);

        return new IngredientResponse(userIngredients);
    }

}
