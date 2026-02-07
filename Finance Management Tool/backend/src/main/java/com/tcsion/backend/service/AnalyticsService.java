package com.tcsion.backend.service;

import com.tcsion.backend.entity.Category;
import com.tcsion.backend.entity.Transaction;
import com.tcsion.backend.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final TransactionRepository transactionRepository;

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getBudgetRecommendations(Long userId) {
        // Look back 6 months for trend analysis
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusMonths(6);

        List<Transaction> transactions = transactionRepository.findByUserIdAndDateBetween(userId, start, end);

        // Group by category
        Map<Category, List<Transaction>> byCategory = transactions.stream()
                .filter(t -> t.getType() == Category.TransactionType.EXPENSE)
                .collect(Collectors.groupingBy(Transaction::getCategory));

        return byCategory.entrySet().stream()
                .map(entry -> {
                    Category category = entry.getKey();
                    List<Transaction> txs = entry.getValue();

                    // Calculate 6-month average
                    BigDecimal total = txs.stream()
                            .map(Transaction::getAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    // Avoid division by zero
                    if (total.compareTo(BigDecimal.ZERO) == 0)
                        return null;

                    BigDecimal avg = total.divide(BigDecimal.valueOf(6), 2, RoundingMode.HALF_UP);

                    // Simple Trend Analysis: Compare last 3 months vs previous 3 months
                    LocalDate splitDate = end.minusMonths(3);
                    BigDecimal recentTotal = BigDecimal.ZERO;
                    BigDecimal pastTotal = BigDecimal.ZERO;

                    for (Transaction t : txs) {
                        if (t.getTransactionDate().isAfter(splitDate)) {
                            recentTotal = recentTotal.add(t.getAmount());
                        } else {
                            pastTotal = pastTotal.add(t.getAmount());
                        }
                    }

                    BigDecimal recentAvg = recentTotal.divide(BigDecimal.valueOf(3), 2, RoundingMode.HALF_UP);
                    BigDecimal pastAvg = pastTotal.divide(BigDecimal.valueOf(3), 2, RoundingMode.HALF_UP);

                    String reason;
                    BigDecimal recommendation;

                    // Detect Trend
                    // Detect Trend
                    if (recentAvg.compareTo(pastAvg.multiply(BigDecimal.valueOf(1.1))) > 0) {
                        // Trending Up (>10% increase)
                        reason = "Spending has increased recently. We suggest tightening slightly.";
                        recommendation = recentAvg.multiply(BigDecimal.valueOf(0.9)); // Suggest 10% less than recent
                                                                                      // high
                    } else if (recentAvg.compareTo(pastAvg.multiply(BigDecimal.valueOf(0.9))) < 0) {
                        // Trending Down (<10% decrease)
                        reason = "You've been saving more recently! Good job keeping costs down.";
                        recommendation = recentAvg; // Maintain current lower spending
                    } else {
                        // Stable
                        reason = "Your spending is consistent.";
                        recommendation = avg.multiply(BigDecimal.valueOf(0.95)); // Standard 5% savings goal
                    }

                    // Minimum viable budget
                    if (recommendation.compareTo(BigDecimal.valueOf(50)) < 0)
                        recommendation = BigDecimal.valueOf(50);

                    recommendation = recommendation.setScale(0, RoundingMode.CEILING);
                    avg = avg.setScale(0, RoundingMode.CEILING);

                    Map<String, Object> rec = new HashMap<>();
                    rec.put("categoryId", category.getId());
                    rec.put("categoryName", category.getName());
                    rec.put("currentAverage", avg);
                    rec.put("recommendedLimit", recommendation);
                    rec.put("reason", reason);
                    return rec;
                })
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getFinancialHealthScore(Long userId) {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusMonths(1); // Last month snapshot

        // Get total income and expense for last month
        List<Transaction> transactions = transactionRepository.findByUserIdAndDateBetween(userId, start, end);

        BigDecimal income = transactions.stream()
                .filter(t -> t.getType() == Category.TransactionType.INCOME)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal expense = transactions.stream()
                .filter(t -> t.getType() == Category.TransactionType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 1. Savings Rate Score (50% weight)
        // Ideal savings rate is 20%. If >= 20%, score 50 points.
        double savingsRateScore = 0;
        if (income.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal savings = income.subtract(expense);
            double rate = savings.divide(income, 2, RoundingMode.HALF_UP).doubleValue(); // e.g. 0.20
            savingsRateScore = Math.min(rate * 250, 50); // 0.2 * 250 = 50 pts. 0.1 * 250 = 25 pts.
            if (savingsRateScore < 0)
                savingsRateScore = 0;
        }

        // 2. Spending Control Score (50% weight)
        // If expense < income, full 50 points. If expense > income, lose points.
        double controlScore = 0;
        if (expense.compareTo(income) <= 0) {
            controlScore = 50;
        } else {
            // Overspending penalty
            if (income.compareTo(BigDecimal.ZERO) > 0) {
                double overspendRatio = expense.subtract(income).divide(income, 2, RoundingMode.HALF_UP).doubleValue();
                controlScore = Math.max(0, 50 - (overspendRatio * 100)); // Lose 1 pt for every 1% over
            }
        }

        int totalScore = (int) (savingsRateScore + controlScore);
        String status;
        if (totalScore >= 80)
            status = "Excellent";
        else if (totalScore >= 60)
            status = "Good";
        else if (totalScore >= 40)
            status = "Fair";
        else
            status = "Needs Attention";

        // Suggestion based on score
        String suggestion = "Keep up the consistent saving!";
        if (totalScore < 40)
            suggestion = "Try to cut down discretionary expenses.";
        else if (savingsRateScore < 10)
            suggestion = "Aim to save at least 20% of income.";

        Map<String, Object> result = new HashMap<>();
        result.put("score", totalScore);
        result.put("status", status);
        result.put("suggestion", suggestion);
        return result;
    }
}
