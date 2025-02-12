package com.damul.api.receipt.service;

import com.damul.api.auth.entity.User;
import com.damul.api.main.entity.UserIngredient;
import com.damul.api.main.repository.UserIngredientRepository;
import com.damul.api.mypage.entity.FoodCategory;
import com.damul.api.mypage.entity.FoodPreference;
import com.damul.api.mypage.repository.FoodCategoryRepository;
import com.damul.api.mypage.repository.FoodPreferenceRepository;
import com.damul.api.receipt.dto.request.UserIngredientPost;
import com.damul.api.receipt.entity.UserReceipt;
import com.damul.api.receipt.repository.UserReceiptRepository;
import com.damul.api.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class UserReceiptServiceImpl implements UserReceiptService {

    private final UserReceiptRepository userReceiptRepository;
    private final UserIngredientRepository userIngredientRepository;
    private final UserRepository userRepository;
    private final FoodPreferenceRepository foodPreferenceRepository;
    private final FoodCategoryRepository foodCategoryRepository;

    @Override
    @Transactional
    public void registerIngredients(int userId, UserIngredientPost request) {
        log.info("영수증 등록 시작 {} with request {}", userId, request);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Create UserReceipt
        UserReceipt receipt = UserReceipt.builder()
                .user(user)
                .storeName(request.getStoreName())
                .purchaseAt(request.getPurchaseAt().atStartOfDay())
                .build();

        UserReceipt savedReceipt = userReceiptRepository.save(receipt);
        log.info("영수증 등록 성공 user: {}, receipt: {}", user.getId(), savedReceipt.getId());

        Map<Integer, Integer> categoryCount = new HashMap<>();

        // Create and save UserIngredients one by one
        request.getUserIngredients().forEach(item -> {
            categoryCount.merge(item.getCategoryId(), 1, Integer::sum);

            UserIngredient ingredient = UserIngredient.builder()
                    .userReciept(savedReceipt)
                    .categoryId(item.getCategoryId())
                    .ingredientQuantity(100)
                    .ingredientName(item.getIngredientName())
                    .expirationDate(item.getExpirationDate().atStartOfDay())
                    .ingredientStorage(item.getIngredientStorage())
                    .price(item.getProductPrice())
                    .build();

            userIngredientRepository.save(ingredient);
        });

        // Update food preferences
        categoryCount.forEach((categoryId, count) -> {
            FoodPreference preference = foodPreferenceRepository
                    .findByUserIdAndCategoryId(userId, categoryId)
                    .orElseGet(() -> {
                        FoodCategory category = foodCategoryRepository.findById(categoryId)
                                .orElseThrow(() -> new EntityNotFoundException("Category not found: " + categoryId));

                        return FoodPreference.builder()
                                .user(user)
                                .category(category)
                                .categoryPreference(0)
                                .build();
                    });

            preference.increaseCategoryPreference(count);
            foodPreferenceRepository.save(preference);
        });

        log.info("식자재 등록 완료 user: {}, receipt: {}", user.getId(), savedReceipt.getId());
    }
}