package com.damul.api.ingredient.service;

import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.ingredient.dto.response.IngredientPriceResponse;
import com.damul.api.ingredient.dto.response.IngredientsProductNameList;
import com.damul.api.ingredient.dto.response.IngredientsProductNameResponse;
import com.damul.api.ingredient.repository.FoodItemRepository;
import com.damul.api.mypage.repository.FoodCategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class IngredientPriceServiceImpl implements IngredientPriceService {
    private final KamisApiService kamisApiService;
    private final PriceAnalysisService priceAnalysisService;
    private final FoodCategoryRepository foodCategoriesRepository;
    private final FoodItemRepository foodItemRepository;

    @Override
    public IngredientPriceResponse getIngredientPrice(String period, String itemCode, String kindCode, boolean ecoFlag) {
        log.info("식자재 가격 동향 조회 시작 - period: {}, itemCode: {}, itemCategoryCode: {}, ecoFlag: {}", period, itemCode, kindCode, ecoFlag);

        try {
            if (!period.equals("monthly") && !period.equals("recent")) {
                log.error("잘못된 period 입니다.");
                throw new BusinessException(ErrorCode.INVALID_PERIOD);
            }

            if(itemCode == null) {
                // 랜덤 품목코드 선택 로직 추가
                itemCode = String.valueOf(getRandomItemCode());
                log.info("랜덤 선택된 itemCode: {}", itemCode);
            }
            // PriceAnalysisService를 통해 데이터 분석
            IngredientPriceResponse response = priceAnalysisService.analyzePrices(itemCode, period, LocalDate.now(), kindCode, ecoFlag);
            log.info("식자재 가격 동향 조회 완료");
            return response;

        } catch (Exception e) {
            log.error("식자재 가격 동향 조회 실패: {}", e.getMessage());
            throw new BusinessException(ErrorCode.EXTERNAL_API_ERROR);
        }
    }

    @Override
    public IngredientsProductNameResponse getIngredientsProductName() {
        log.info("식자재 품목 검색 시작");
        List<IngredientsProductNameList> productNameLists = foodItemRepository.findAllProductNames();
        log.info("식자재 품목 검색 성공 - size: {}", productNameLists.size());


        return IngredientsProductNameResponse.builder()
                .ingredientsProductNameLists(productNameLists)
                .build();
    }



    private static final Set<String> VALID_ITEM_CODES = Set.of(
            "111", "112", "113", "114", "141", "142", "143", "144", "151", "152",
            "161", "162", "163", "164", "211", "212", "213", "214", "215", "216",
            "217", "218", "221", "222", "223", "224", "225", "226", "231", "232",
            "233", "241", "242", "243", "244", "245", "246", "247", "248", "251",
            "252", "253", "254", "255", "256", "257", "258", "259", "261", "262",
            "263", "264", "265", "266", "276", "279", "280", "312", "313", "314",
            "315", "316", "317", "318", "319", "321", "322", "411", "412", "413",
            "414", "415", "416", "418", "419", "420", "421", "422", "423", "424",
            "425", "426", "427", "428", "429", "430", "611", "612", "613", "614",
            "615", "616", "619", "638", "639", "640", "641", "642", "644", "649",
            "650", "651", "652", "653", "654", "657", "658", "659", "660"
    );

    private String getRandomItemCode() {
        List<String> codes = new ArrayList<>(VALID_ITEM_CODES);
        Random random = new Random();
        return codes.get(random.nextInt(codes.size()));
    }
}
