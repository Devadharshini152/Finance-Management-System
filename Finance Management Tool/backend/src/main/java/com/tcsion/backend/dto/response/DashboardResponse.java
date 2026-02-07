package com.tcsion.backend.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal netSavings;
    private Integer financialHealthScore;
    private List<Map<String, Object>> spendingByCategory;
    private List<Map<String, Object>> monthlyTrends;
    private List<String> alerts; // New field for predictive alerts
}
