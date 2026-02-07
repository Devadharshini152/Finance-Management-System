package com.tcsion.backend.service;

import com.tcsion.backend.dto.response.DashboardResponse;
import com.tcsion.backend.entity.Category;
import com.tcsion.backend.entity.Transaction;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TransactionService transactionService;
    private final FinancialHealthService financialHealthService;
    private final com.tcsion.backend.repository.BudgetRepository budgetRepository;

    @Transactional(readOnly = true)
    public DashboardResponse getOverview(Long userId) {
        YearMonth current = YearMonth.now();
        LocalDate start = current.atDay(1);
        LocalDate end = current.atEndOfMonth();

        BigDecimal income = transactionService.sumByUserIdAndTypeAndDateBetween(userId, Category.TransactionType.INCOME,
                start, end);
        BigDecimal expenses = transactionService.sumByUserIdAndTypeAndDateBetween(userId,
                Category.TransactionType.EXPENSE, start, end);
        BigDecimal netSavings = income.subtract(expenses);

        int healthScore = financialHealthService.getLatestByUserId(userId)
                .map(fh -> fh.getScore())
                .orElse(0);

        List<Transaction> transactions = transactionService.findByUserIdAndDateBetween(userId, start, end);
        Map<Long, BigDecimal> byCategory = new HashMap<>();
        Map<String, String> categoryNames = new HashMap<>();
        for (Transaction t : transactions) {
            if (t.getType() == Category.TransactionType.EXPENSE) {
                byCategory.merge(t.getCategory().getId(), t.getAmount(), BigDecimal::add);
                categoryNames.putIfAbsent(t.getCategory().getId().toString(), t.getCategory().getName());
            }
        }
        List<Map<String, Object>> spendingByCategory = byCategory.entrySet().stream()
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("categoryId", e.getKey());
                    m.put("categoryName", categoryNames.get(e.getKey().toString()));
                    m.put("amount", e.getValue());
                    return m;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> monthlyTrends = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth month = current.minusMonths(i);
            LocalDate ms = month.atDay(1);
            LocalDate me = month.atEndOfMonth();
            BigDecimal mi = transactionService.sumByUserIdAndTypeAndDateBetween(userId, Category.TransactionType.INCOME,
                    ms, me);
            BigDecimal mx = transactionService.sumByUserIdAndTypeAndDateBetween(userId,
                    Category.TransactionType.EXPENSE, ms, me);
            Map<String, Object> m = new HashMap<>();
            m.put("month", month.toString());
            m.put("income", mi);
            m.put("expenses", mx);
            monthlyTrends.add(m);
        }

        // Generate Alerts
        List<String> alerts = new ArrayList<>();
        List<com.tcsion.backend.entity.Budget> budgets = budgetRepository.findByUserIdAndBudgetMonth(userId, current);

        int daysInMonth = current.lengthOfMonth();
        int daysPassed = LocalDate.now().getDayOfMonth();

        for (com.tcsion.backend.entity.Budget b : budgets) {
            BigDecimal spent = byCategory.getOrDefault(b.getCategory().getId(), BigDecimal.ZERO);
            // Linear projection
            BigDecimal projected = BigDecimal.ZERO;
            if (daysPassed > 0) {
                projected = spent.divide(BigDecimal.valueOf(daysPassed), 2, java.math.RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(daysInMonth));
            }

            if (projected.compareTo(b.getLimitAmount()) > 0) {
                // Only alert if we are significantly projected to go over (e.g. > 100%) and not
                // just because it's day 1
                // And if current spending is already substantial (e.g. > 10% of budget) to
                // avoid noise
                if (daysPassed > 5 && spent.compareTo(b.getLimitAmount().multiply(BigDecimal.valueOf(0.1))) > 0) {
                    String catName = categoryNames.getOrDefault(b.getCategory().getId().toString(),
                            b.getCategory().getName());
                    alerts.add(String.format("⚠️ Projected to overspend on %s. Budget: %s, Projected: %s",
                            catName, b.getLimitAmount(), projected.toPlainString()));
                } else if (spent.compareTo(b.getLimitAmount()) > 0) {
                    String catName = categoryNames.getOrDefault(b.getCategory().getId().toString(),
                            b.getCategory().getName());
                    alerts.add(String.format("🚨 Over budget on %s! Limit: %s, Spent: %s",
                            catName, b.getLimitAmount(), spent));
                }
            }
        }

        return DashboardResponse.builder()
                .totalIncome(income)
                .totalExpenses(expenses)
                .netSavings(netSavings)
                .financialHealthScore(healthScore)
                .spendingByCategory(spendingByCategory)
                .monthlyTrends(monthlyTrends)
                .alerts(alerts)
                .build();
    }
}
