package com.tcsion.backend.service;

import com.tcsion.backend.dto.request.TransactionRequest;
import com.tcsion.backend.dto.response.TransactionResponse;
import com.tcsion.backend.entity.Category;
import com.tcsion.backend.entity.Transaction;
import com.tcsion.backend.entity.User;
import com.tcsion.backend.exception.ResourceNotFoundException;
import com.tcsion.backend.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryService categoryService;
    private final MLServiceClient mlServiceClient;

    @Transactional
    public TransactionResponse create(Long userId, TransactionRequest request, User user) {
        Category category = categoryService.getEntityById(request.getCategoryId());
        if (category.getType() != request.getType()) {
            throw new com.tcsion.backend.exception.BadRequestException("Category type does not match transaction type");
        }

        Transaction transaction = Transaction.builder()
            .amount(request.getAmount())
            .type(request.getType())
            .category(category)
            .description(request.getDescription())
            .transactionDate(request.getTransactionDate())
            .isRecurring(request.getIsRecurring() != null ? request.getIsRecurring() : false)
            .user(user)
            .build();

        transaction = transactionRepository.save(transaction);
        tryClassifyAndUpdateCategory(transaction);
        return toResponse(transaction);
    }

    @Async
    public void tryClassifyAndUpdateCategory(Transaction transaction) {
        if (transaction.getDescription() != null && !transaction.getDescription().isBlank()) {
            String predicted = mlServiceClient.classifyTransaction(transaction.getDescription());
            if (predicted != null) {
                // Optional: map predicted name to category and update; for now we keep user choice
            }
        }
    }

    @Transactional(readOnly = true)
    public TransactionResponse getById(Long id, Long userId) {
        Transaction t = transactionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Transaction", id));
        if (!t.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Transaction", id);
        }
        if (t.getDeletedAt() != null) {
            throw new ResourceNotFoundException("Transaction", id);
        }
        return toResponse(t);
    }

    @Transactional(readOnly = true)
    public Page<TransactionResponse> list(Long userId, LocalDate start, LocalDate end, Pageable pageable) {
        if (start != null && end != null) {
            List<Transaction> list = transactionRepository.findByUserIdAndDateBetween(userId, start, end);
            int from = (int) pageable.getOffset();
            int to = Math.min(from + pageable.getPageSize(), list.size());
            return new org.springframework.data.domain.PageImpl<>(
                list.subList(from, to).stream().map(this::toResponse).collect(Collectors.toList()),
                pageable,
                list.size()
            );
        }
        return transactionRepository.findByUserIdAndDeletedAtIsNull(userId, pageable)
            .map(this::toResponse);
    }

    @Transactional
    public TransactionResponse update(Long id, Long userId, TransactionRequest request, User user) {
        Transaction t = transactionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Transaction", id));
        if (!t.getUser().getId().equals(userId) || t.getDeletedAt() != null) {
            throw new ResourceNotFoundException("Transaction", id);
        }

        Category category = categoryService.getEntityById(request.getCategoryId());
        if (category.getType() != request.getType()) {
            throw new com.tcsion.backend.exception.BadRequestException("Category type does not match transaction type");
        }

        t.setAmount(request.getAmount());
        t.setType(request.getType());
        t.setCategory(category);
        t.setDescription(request.getDescription());
        t.setTransactionDate(request.getTransactionDate());
        t.setIsRecurring(request.getIsRecurring() != null ? request.getIsRecurring() : false);
        t = transactionRepository.save(t);
        return toResponse(t);
    }

    @Transactional
    public void delete(Long id, Long userId) {
        Transaction t = transactionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Transaction", id));
        if (!t.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Transaction", id);
        }
        t.setDeletedAt(java.time.Instant.now());
        transactionRepository.save(t);
    }

    @Transactional(readOnly = true)
    public List<Transaction> findByUserIdAndDateBetween(Long userId, LocalDate start, LocalDate end) {
        return transactionRepository.findByUserIdAndDateBetween(userId, start, end);
    }

    @Transactional(readOnly = true)
    public BigDecimal sumByUserIdAndTypeAndDateBetween(Long userId, Category.TransactionType type, LocalDate start, LocalDate end) {
        List<Transaction> list = transactionRepository.findByUserIdAndDateBetween(userId, start, end);
        return list.stream()
            .filter(t -> t.getType() == type)
            .map(Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private TransactionResponse toResponse(Transaction t) {
        return TransactionResponse.builder()
            .id(t.getId())
            .amount(t.getAmount())
            .type(t.getType())
            .categoryId(t.getCategory().getId())
            .categoryName(t.getCategory().getName())
            .description(t.getDescription())
            .transactionDate(t.getTransactionDate())
            .isRecurring(t.getIsRecurring())
            .createdAt(t.getCreatedAt())
            .updatedAt(t.getUpdatedAt())
            .build();
    }
}
