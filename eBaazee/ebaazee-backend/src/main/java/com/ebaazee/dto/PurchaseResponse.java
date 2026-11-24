package com.ebaazee.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PurchaseResponse {
    private Long purchaseId;
    private LocalDateTime purchaseTime;
    private BigDecimal amountPaid;
    private Long productId;
    private String productTitle;
    private Long userId;
}
