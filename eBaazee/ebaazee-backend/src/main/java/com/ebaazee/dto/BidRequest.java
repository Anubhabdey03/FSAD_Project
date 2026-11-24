package com.ebaazee.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BidRequest {
    private BigDecimal amount;
}
