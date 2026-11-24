package com.ebaazee.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductResponse {
    private Long productId;
    private String title;
    private String description;
    private String imageUrl;
    private BigDecimal minBid;
    private BigDecimal maxBid;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
    private String categoryName;
    private Long categoryId;
    private String sellerName;
    private Long sellerId;
    private long bidCount;
}
