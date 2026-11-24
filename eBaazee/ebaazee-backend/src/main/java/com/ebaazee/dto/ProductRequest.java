package com.ebaazee.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ProductRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private String imageUrl;

    @NotNull(message = "Category is required")
    private Long categoryId;

    @NotNull(message = "Minimum bid is required")
    @Positive(message = "Minimum bid must be greater than zero")
    private BigDecimal minBid;

    @NotNull(message = "Maximum bid is required")
    @Positive(message = "Maximum bid must be greater than zero")
    private BigDecimal maxBid;

    @Min(value = 1, message = "Duration must be at least 1 hour")
    private int durationHours;
}
