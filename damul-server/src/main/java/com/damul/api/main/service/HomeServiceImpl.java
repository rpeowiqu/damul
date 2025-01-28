package com.damul.api.main.service;

import com.damul.api.main.dto.response.HomeIngredientDetail;
import com.damul.api.main.dto.response.IngredientResponse;
import com.damul.api.main.dto.response.UserIngredientList;
import com.damul.api.main.entity.UserIngredient;
import com.damul.api.main.repository.UserIngredientRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class HomeServiceImpl implements HomeService {

    private final UserIngredientRepository userIngredientRepository;

    @Override
    @Transactional(readOnly = true)
    public IngredientResponse getUserIngredientList(int userId) {
        log.info("사용자 식자재 전체 가져오기 시작");
        // 1. 사용자의 재료 목록 조회
        List<UserIngredient> userIngredients = userIngredientRepository.findByUserId(userId);

        // 2. Entity를 DTO로 변환
        List<UserIngredientList> ingredientDtos = userIngredients.stream()
                .map(UserIngredientList::from)
                .collect(Collectors.toList());

        log.info("사용자 식자재 전체 가져오기 성공");
        // 3. HomeResponse 생성 및 반환
        return new IngredientResponse(ingredientDtos);
    }

    @Override
    public IngredientResponse getSearchUserIngredientList(int userId, String keyword, String orderByDir, String orderBy) {
        log.info("사용자 식자재 검색 가져오기 시작");
        // 여기 parameter들이 null인지 validation하기 프론트에서 무조건 받는걸로
        Sort.Direction direction = (orderByDir != null && orderByDir.equalsIgnoreCase("desc"))
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        String sortBy = "ingredientName"; // 기본값
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
                .findByUserIdAndIngredientNameContaining(userId, keyword, sort);

        List<UserIngredientList> ingredientDtos = userIngredients.stream()
                .map(UserIngredientList::from)
                .collect(Collectors.toList());

        log.info("사용자 식자재 검색 가져오기 성공");
        return new IngredientResponse(ingredientDtos);
    }

    @Override
    public HomeIngredientDetail getUserIngredientDetail(int ingredientId) {
        log.info("사용자 식자재 상세 가져오기 시작");
        HomeIngredientDetail homeIngredientDetail = userIngredientRepository.findHomeIngredientDetailById(ingredientId);
        log.info("사용자 식자재 상세 가져오기 성공");
        return homeIngredientDetail;
    }

    @Override
    @Transactional
    public void updateQuantity(int ingredientId, int quantity) {
        log.info("식자재 양 업데이트 시작");
        UserIngredient ingredient = userIngredientRepository.findById(ingredientId)
                .orElseThrow(() -> new EntityNotFoundException("재료를 찾을 수 없습니다."));

        ingredient.updateQuantity(quantity);
        log.info("식자재 양 업데이트 성공");
    }


}
