package com.damul.api.receipt.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;


@Getter
public class DailyReceiptInfo {
    private int dayOfMonth;
    private List<Integer> receiptIds;


    // Native Query 매핑을 위한 생성자
    public DailyReceiptInfo(int dayOfMonth, String receiptIds) {
        this.dayOfMonth = dayOfMonth;
        this.receiptIds = Arrays.stream(receiptIds.split(","))
                .map(Integer::parseInt)
                .collect(Collectors.toList());
    }
}