package com.tcsion.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.YearMonth;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BudgetRequest {

    @NotNull(message = "Budget month is required")
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM")
    private YearMonth budgetMonth;

    @NotNull(message = "Limit amount is required")
    @DecimalMin(value = "0.01", message = "Limit must be greater than 0")
    @Digits(integer = 13, fraction = 2)
    private BigDecimal limitAmount;

    @NotNull(message = "Category is required")
    private Long categoryId;
}
