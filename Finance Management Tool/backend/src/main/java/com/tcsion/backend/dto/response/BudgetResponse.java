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
public class BudgetResponse {

    private Long id;
    private YearMonth budgetMonth;
    private Long categoryId;
    private String categoryName;
    private BigDecimal limitAmount;
    private BigDecimal spentAmount;
    private Instant createdAt;
}
