package com.damul.api.receipt.service;

import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.auth.entity.User;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.main.entity.UserIngredient;
import com.damul.api.main.repository.UserIngredientRepository;
import com.damul.api.mypage.entity.FoodCategory;
import com.damul.api.mypage.entity.FoodPreference;
import com.damul.api.mypage.repository.FoodCategoryRepository;
import com.damul.api.mypage.repository.FoodPreferenceRepository;
import com.damul.api.receipt.dto.request.RegisterIngredientList;
import com.damul.api.receipt.dto.request.UserIngredientPost;
import com.damul.api.receipt.dto.response.DailyReceiptInfo;
import com.damul.api.receipt.dto.response.ReceiptCalendarResponse;
import com.damul.api.receipt.dto.response.ReceiptDetail;
import com.damul.api.receipt.dto.response.ReceiptDetailResponse;
import com.damul.api.receipt.entity.UserReceipt;
import com.damul.api.receipt.repository.UserReceiptRepository;
import com.damul.api.recipe.repository.RecipeRepository;
import com.damul.api.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
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
        log.info("영수증 등록 시작 - userId: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // 총 구매 금액 계산
        int totalAmount = request.getUserIngredients().stream()
                .mapToInt(RegisterIngredientList::getProductPrice)
                .sum();

        // Create UserReceipt with totalAmount
        UserReceipt receipt = UserReceipt.builder()
                .user(user)
                .storeName(request.getStoreName())
                .purchaseAt(request.getPurchaseAt().atStartOfDay())
                .totalAmount(totalAmount)  // 총액 추가
                .build();

        UserReceipt savedReceipt = userReceiptRepository.save(receipt);
        log.info("영수증 등록 완료 - receiptId: {}, totalAmount: {}", savedReceipt.getId(), totalAmount);

        // 카테고리별 카운트 맵
        Map<Integer, Integer> categoryCount = new HashMap<>();

        // 식자재 등록
        List<UserIngredient> ingredients = request.getUserIngredients().stream()
                .map(item -> {
                    // 카테고리 카운트 증가
                    categoryCount.merge(item.getCategoryId(), 1, Integer::sum);

                    return UserIngredient.builder()
                            .userReciept(savedReceipt)
                            .categoryId(item.getCategoryId())
                            .ingredientQuantity(100)
                            .ingredientUp(request.getPurchaseAt().atStartOfDay())
                            .ingredientName(item.getIngredientName())
                            .expirationDate(item.getExpirationDate().atStartOfDay())
                            .ingredientStorage(item.getIngredientStorage())
                            .price(item.getProductPrice())
                            .build();
                })
                .collect(Collectors.toList());

        userIngredientRepository.saveAll(ingredients);
        log.info("식자재 등록 완료 - count: {}", ingredients.size());

        // 선호도 업데이트
        updateFoodPreferences(user, categoryCount);
        log.info("식자재 선호도 업데이트 완료");
    }

    private void updateFoodPreferences(User user, Map<Integer, Integer> categoryCount) {
        categoryCount.forEach((categoryId, count) -> {
            FoodPreference preference = foodPreferenceRepository
                    .findByUserIdAndCategoryId(user.getId(), categoryId)
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
    }

    @Override
    public ReceiptCalendarResponse getMonthlyReceipt(int userId, int year, int month) {
        log.info("월별 영수증 조회 서비스 시작");

        // 유효성 검증
        if(month < 1 || month > 12) {
            log.error("잘못된 월 입력 - month: {}", month);
            throw new BusinessException(ErrorCode.INVALID_MONTH);
        }

        // 이번달 총액 조회 (null일 경우 0으로 처리)
        int monthlyTotal = Optional.ofNullable(
                        userReceiptRepository.calculateMonthlyTotal(userId, year, month))
                .orElse(0);

        // 이전달 년/월 계산
        int previousMonth = month - 1;
        int previousYear = year;
        if(previousMonth == 0) {
            previousMonth = 12;
            previousYear = year - 1;
        }

        // 이전달 총액 조회
        int previousMonthTotal = Optional.ofNullable(
                userReceiptRepository.calculateMonthlyTotal(userId, previousYear, previousMonth))
                .orElse(0);


        List<DailyReceiptInfo> dailyReceipts = userReceiptRepository.findDailyReceipts(userId, year, month);


        log.info("월별 영수증 조회 완료 - 총액: {}, 전월: {}, 일수: {}", monthlyTotal, previousMonthTotal, dailyReceipts.size());

        return ReceiptCalendarResponse.builder()
                .monthlyTotalAmount(monthlyTotal)
                .comparedPreviousMonth(monthlyTotal - previousMonthTotal)
                .dailyReceiptInfoList(dailyReceipts)
                .build();
    }

    @Override
    public ReceiptDetailResponse getReceiptDetail(int userId, int receiptId) {
        log.info("영수증 상세보기 시작");

        log.info("영수증 상세 내용 조회 시작");
        List<ReceiptDetail> receiptDetails = userReceiptRepository.findReceiptDetailsByReceiptId(receiptId);
        log.info("영수증 상세 내용 조회 완료");

        UserReceipt userReceipt = userReceiptRepository.findUserReceiptById(receiptId);


        log.info("영수증 상세보기 완료");
        return ReceiptDetailResponse.builder()
                .storeName(userReceipt.getStoreName())
                .receiptDetails(receiptDetails)
                .totalPrice(userReceipt.getTotalAmount())
                .build();
    }
}