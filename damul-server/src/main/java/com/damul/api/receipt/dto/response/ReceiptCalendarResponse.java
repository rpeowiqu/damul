package com.damul.api.receipt.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceiptCalendarResponse {
    private int monthlyTotalAmount;
    private int comparedPreviousMonth;
    private List<DailyReceiptInfo> dailyReceiptInfoList;
}
