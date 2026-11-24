package com.ebaazee.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BidStatsResponse {
    private long count;
    private BigDecimal average;
    private BigDecimal highest;
    private BigDecimal lowest;
}
