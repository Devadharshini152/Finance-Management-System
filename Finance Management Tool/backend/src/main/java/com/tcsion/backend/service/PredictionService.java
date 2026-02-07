package com.tcsion.backend.service;

import com.tcsion.backend.dto.response.PredictionResponse;
import com.tcsion.backend.entity.Prediction;
import com.tcsion.backend.entity.User;

import com.tcsion.backend.repository.PredictionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class PredictionService {

    private final PredictionRepository predictionRepository;
    private final com.tcsion.backend.repository.TransactionRepository transactionRepository;
    private final com.tcsion.backend.service.MLServiceClient mlServiceClient;
    private final com.tcsion.backend.repository.CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<PredictionResponse> getByUserId(Long userId) {
        return predictionRepository.findByUserIdOrderByTargetMonthAsc(userId).stream()
                .map(this::toResponse)
                .sorted(Comparator.comparing(PredictionResponse::getTargetMonth))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<PredictionResponse> getByUserId(Long userId, Pageable pageable) {
        return predictionRepository.findByUserId(userId, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public List<PredictionResponse> getLatestByUserId(Long userId) {
        List<Prediction> all = predictionRepository.findLatestByUserId(userId);
        return all.stream()
                .limit(50)
                .map(this::toResponse)
                .sorted(Comparator.comparing(PredictionResponse::getTargetMonth))
                .collect(Collectors.toList());
    }

    private PredictionResponse toResponse(Prediction p) {
        return PredictionResponse.builder()
                .id(p.getId())
                .targetMonth(java.time.YearMonth.from(p.getTargetMonth()))
                .categoryId(p.getCategory().getId())
                .categoryId(p.getCategory().getId())
                .categoryName(p.getCategory().getName())
                .predictedAmount(p.getPredictedAmount())
                .confidenceScore(p.getConfidenceScore())
                .createdAt(p.getCreatedAt())
                .build();
    }

    /**
     * Generates predictions for the given user by calling the ML service
     * and saving the results to the database.
     */
    @Transactional
    public void generatePredictionsForUser(Long userId) {
        // 1. Fetch user's transactions (use existing repo method effectively)
        // Using Pageable.unpaged() if supported or just a large page
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.Pageable.unpaged();
        List<com.tcsion.backend.entity.Transaction> transactions = transactionRepository
                .findByUserIdAndDeletedAtIsNullOrderByTransactionDateDesc(userId, pageable);

        if (transactions.isEmpty()) {
            log.warn("No transactions found for user {}", userId);
            return;
        }
        log.info("Found {} transactions for user {}", transactions.size(), userId);

        // Limit to reasonable amount for ML (e.g. last 100)
        if (transactions.size() > 100) {
            transactions = transactions.subList(0, 100);
        }

        // 2. Convert to DTOs for ML service
        List<com.tcsion.backend.dto.request.TransactionRequest> dtos = transactions.stream()
                .map(t -> com.tcsion.backend.dto.request.TransactionRequest.builder()
                        .amount(t.getAmount())
                        .type(t.getCategory().getType())
                        .categoryId(t.getCategory().getId())
                        .categoryName(t.getCategory().getName())
                        .description(t.getDescription())
                        .transactionDate(t.getTransactionDate())
                        .build())
                .collect(Collectors.toList());

        // 3. Call ML Service
        log.info("Calling ML Service with {} transactions...", dtos.size());
        com.tcsion.backend.dto.response.MLPredictionResponse response = mlServiceClient.predictSpending(dtos);

        if (response != null && response.getPredictions() != null) {
            log.info("Received {} predictions from ML Service", response.getPredictions().size());
            // 4. Clear existing predictions for user
            predictionRepository.deleteByUserId(userId);

            List<com.tcsion.backend.entity.Category> allCategories = categoryRepository.findAll();
            List<Prediction> newPredictions = new java.util.ArrayList<>();

            for (com.tcsion.backend.dto.response.MLPredictionResponse.PredictionItem item : response.getPredictions()) {
                // Find category by name
                com.tcsion.backend.entity.Category cat = allCategories.stream()
                        .filter(c -> c.getName().equalsIgnoreCase(item.getCategory()))
                        .findFirst()
                        .orElse(null);

                if (cat == null)
                    continue;

                Prediction p = Prediction.builder()
                        .user(User.builder().id(userId).build())
                        .category(cat)
                        .predictedAmount(item.getPredicted_amount())
                        // Fix: Convert Double to BigDecimal
                        .confidenceScore(java.math.BigDecimal.valueOf(item.getConfidence()))
                        // Logic: Distribute targets using target_month from ML service
                        .targetMonth(java.time.YearMonth.now().plusMonths(item.getTarget_month()).atDay(1))
                        .build();

                newPredictions.add(p);
            }

            log.info("Saving {} processed predictions to repository", newPredictions.size());
            predictionRepository.saveAll(newPredictions);
        } else {
            log.warn("ML Service returned null or empty predictions");
        }
    }

    public com.tcsion.backend.dto.response.ParseResponse parseTransaction(String text) {
        return mlServiceClient.parseTransaction(text);
    }
}
