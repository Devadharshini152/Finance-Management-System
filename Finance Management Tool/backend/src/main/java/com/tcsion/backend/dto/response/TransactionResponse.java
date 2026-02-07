package com.tcsion.backend.dto.response;

import com.tcsion.backend.entity.Category;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponse {

    private Long id;
    private BigDecimal amount;
    private Category.TransactionType type;
    private Long categoryId;
    private String categoryName;
    private String description;
    private LocalDate transactionDate;
    private Boolean isRecurring;
    private Instant createdAt;
    private Instant updatedAt;
}
