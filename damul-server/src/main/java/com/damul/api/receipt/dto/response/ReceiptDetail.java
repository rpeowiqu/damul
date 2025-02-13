package com.damul.api.receipt.dto.response;

import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceiptDetail {
    private String productName;
    private String categoryName;
    private int price;
}
