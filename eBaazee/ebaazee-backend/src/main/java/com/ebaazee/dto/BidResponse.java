package com.ebaazee.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BidResponse {
    private Long bidId;
    private BigDecimal amount;
    private LocalDateTime bidTime;
    private Long userId;
    private String userName;
    private Long productId;
    private String productTitle;
}
