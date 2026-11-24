package com.ebaazee.dto;

import com.ebaazee.dto.ProductResponse;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReportResponse {
    private ProductResponse product;
    private long bidCount;
    private BigDecimal highest;
    private BigDecimal lowest;
    private BigDecimal average;
    private List<BidResponse> bids;
}
