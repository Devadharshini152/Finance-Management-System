package com.tcsion.backend.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.YearMonth;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PredictionResponse {

    private Long id;
    private YearMonth targetMonth;
    private Long categoryId;
    private String categoryName;
    private BigDecimal predictedAmount;
    private BigDecimal confidenceScore;
    private Instant createdAt;
}
