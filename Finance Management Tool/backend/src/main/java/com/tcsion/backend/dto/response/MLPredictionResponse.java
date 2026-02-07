package com.tcsion.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MLPredictionResponse {
    private List<PredictionItem> predictions;
    private List<String> target_months;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PredictionItem {
        private String category; // Category NAME
        private java.math.BigDecimal predicted_amount;
        private Double confidence;
        private Integer target_month;
    }
}
