package com.tcsion.backend.service;

import com.tcsion.backend.dto.request.BudgetRequest;
import com.tcsion.backend.dto.response.BudgetResponse;
import com.tcsion.backend.entity.Budget;
import com.tcsion.backend.entity.Transaction;
import com.tcsion.backend.entity.User;
import com.tcsion.backend.exception.ResourceNotFoundException;
import com.tcsion.backend.repository.BudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryService categoryService;
    private final TransactionService transactionService;

    @Transactional
    public BudgetResponse create(Long userId, BudgetRequest request, User user) {
        var category = categoryService.getEntityById(request.getCategoryId());

        // Upsert: check if exists
        var existing = budgetRepository.findByUserIdAndCategoryIdAndBudgetMonth(userId, request.getCategoryId(),
                request.getBudgetMonth());

        Budget budget;
        if (existing.isPresent()) {
            budget = existing.get();
            budget.setLimitAmount(request.getLimitAmount());
            // category and month are same
        } else {
            budget = Budget.builder()
                    .budgetMonth(request.getBudgetMonth())
                    .limitAmount(request.getLimitAmount())
                    .category(category)
                    .user(user)
                    .build();
        }

        budget = budgetRepository.save(budget);
        BigDecimal spent = getSpentForBudget(budget);
        return toResponse(budget, spent);
    }

    @Transactional(readOnly = true)
    public List<BudgetResponse> listByUser(Long userId) {
        return budgetRepository.findByUserId(userId).stream()
                .map(b -> toResponse(b, getSpentForBudget(b)))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BudgetResponse> listByUserAndMonth(Long userId, YearMonth month) {
        return budgetRepository.findByUserIdAndBudgetMonth(userId, month).stream()
                .map(b -> toResponse(b, getSpentForBudget(b)))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BudgetResponse getById(Long id, Long userId) {
        Budget b = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget", id));
        if (!b.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Budget", id);
        }
        return toResponse(b, getSpentForBudget(b));
    }

    @Transactional
    public BudgetResponse update(Long id, Long userId, BudgetRequest request, User user) {
        Budget b = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget", id));
        if (!b.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Budget", id);
        }
        var category = categoryService.getEntityById(request.getCategoryId());
        b.setBudgetMonth(request.getBudgetMonth());
        b.setLimitAmount(request.getLimitAmount());
        b.setCategory(category);
        b = budgetRepository.save(b);
        return toResponse(b, getSpentForBudget(b));
    }

    @Transactional
    public void delete(Long id, Long userId) {
        Budget b = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget", id));
        if (!b.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Budget", id);
        }
        budgetRepository.delete(b);
    }

    private BigDecimal getSpentForBudget(Budget budget) {
        var start = budget.getBudgetMonth().atDay(1);
        var end = budget.getBudgetMonth().atEndOfMonth();
        List<Transaction> transactions = transactionService.findByUserIdAndDateBetween(
                budget.getUser().getId(), start, end);
        return transactions.stream()
                .filter(t -> t.getCategory().getId().equals(budget.getCategory().getId()))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BudgetResponse toResponse(Budget b, BigDecimal spentAmount) {
        return BudgetResponse.builder()
                .id(b.getId())
                .budgetMonth(b.getBudgetMonth())
                .categoryId(b.getCategory().getId())
                .categoryName(b.getCategory().getName())
                .limitAmount(b.getLimitAmount())
                .spentAmount(spentAmount)
                .createdAt(b.getCreatedAt())
                .build();
    }
}
