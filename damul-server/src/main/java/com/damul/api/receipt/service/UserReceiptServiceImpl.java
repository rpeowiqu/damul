package com.damul.api.receipt.service;

import com.damul.api.auth.entity.User;
import com.damul.api.main.entity.UserIngredient;
import com.damul.api.main.repository.UserIngredientRepository;
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
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class UserReceiptServiceImpl implements UserReceiptService {

    private final UserReceiptRepository userReceiptRepository;
    private final UserIngredientRepository userIngredientRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void registerIngredients(int userId, UserIngredientPost request) {
        log.info("영수증 등록 시작 {} with id {}", userId, request);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Create UserReceipt
        UserReceipt receipt = UserReceipt.builder()
                .user(user)
                .storeName(request.getStoreName())
                .purchaseAt(request.getPurchaseAt().atStartOfDay())
                .build();

        UserReceipt savedReceipt = userReceiptRepository.save(receipt);
        log.info("영수증 등록 성공 {} with id {}", user, savedReceipt);

        // Create UserIngredients
        List<UserIngredient> ingredients = request.getUserIngredients().stream()
                .map(item -> UserIngredient.builder()
                        .userReciept(savedReceipt)
                        .categoryId(item.getCategoryId())
                        .ingredientName(item.getIngredientName())
                        .expirationDate(item.getExpirationDate().atStartOfDay())
                        .ingredientStorage(item.getIngredientStorage())
                        .price(item.getProductPrice())
                        .build())
                .collect(Collectors.toList());

        userIngredientRepository.saveAll(ingredients);
        log.info("식자재 등록 성공 {} with id {}", user, savedReceipt);
    }

}
