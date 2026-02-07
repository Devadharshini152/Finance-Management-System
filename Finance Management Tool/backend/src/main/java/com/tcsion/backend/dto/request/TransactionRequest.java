package com.tcsion.backend.dto.request;

import com.tcsion.backend.entity.Category;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionRequest {

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    @Digits(integer = 13, fraction = 2)
    private BigDecimal amount;

    @NotNull(message = "Type is required")
    private Category.TransactionType type;

    @NotNull(message = "Category is required")
    private Long categoryId;

    @Size(max = 500)
    private String description;

    private String categoryName;

    @NotNull(message = "Transaction date is required")
    private LocalDate transactionDate;

    @Builder.Default
    private Boolean isRecurring = false;
}
