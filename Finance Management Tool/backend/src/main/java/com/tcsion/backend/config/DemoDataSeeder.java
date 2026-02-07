package com.tcsion.backend.config;

import com.tcsion.backend.dto.request.RegisterRequest;
import com.tcsion.backend.dto.request.TransactionRequest;

import com.tcsion.backend.entity.Category;
import com.tcsion.backend.entity.User;
import com.tcsion.backend.repository.CategoryRepository;
import com.tcsion.backend.repository.UserRepository;
import com.tcsion.backend.service.AuthService;
import com.tcsion.backend.service.TransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class DemoDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AuthService authService;
    private final TransactionService transactionService;
    private final CategoryRepository categoryRepository;
    private final com.tcsion.backend.service.PredictionService predictionService;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.existsByEmail("demo@test.com")) {
            log.info("Demo user already exists. Updating data...");
            // Don't return, proceed to ensure predictions are generated.
        } else {
            log.info("Creating demo user...");
            RegisterRequest registerRequest = RegisterRequest.builder()
                    .name("Demo User")
                    .email("demo@test.com")
                    .password("password123")
                    .build();

            authService.register(registerRequest);
        }

        User user = userRepository.findByEmail("demo@test.com").orElseThrow();

        log.info("Seeding transactions for demo user...");
        List<Category> expenseCategories = categoryRepository.findByType(Category.TransactionType.EXPENSE);
        List<Category> incomeCategories = categoryRepository.findByType(Category.TransactionType.INCOME);

        if (expenseCategories.isEmpty() || incomeCategories.isEmpty()) {
            log.warn("Categories not found, skipping transaction seeding.");
            return;
        }

        Random random = new Random();

        // Create 3 months of data
        for (int i = 0; i < 50; i++) {
            boolean isIncome = random.nextInt(10) < 3; // 30% income, 70% expense
            Category category = isIncome
                    ? incomeCategories.get(random.nextInt(incomeCategories.size()))
                    : expenseCategories.get(random.nextInt(expenseCategories.size()));

            BigDecimal amount = isIncome
                    ? BigDecimal.valueOf(2000 + random.nextInt(3000))
                    : BigDecimal.valueOf(10 + random.nextInt(200));

            LocalDate date = LocalDate.now().minusDays(random.nextInt(90));

            TransactionRequest tx = TransactionRequest.builder()
                    .amount(amount)
                    .type(isIncome ? Category.TransactionType.INCOME : Category.TransactionType.EXPENSE)
                    .categoryId(category.getId())
                    .description("Test " + category.getName())
                    .transactionDate(date)
                    .isRecurring(false)
                    .build();

            transactionService.create(user.getId(), tx, user);
        }

        log.info("Generating initial predictions for demo user...");
        predictionService.generatePredictionsForUser(user.getId());

        log.info("Demo data seeded successfully!");
        log.info("Login with: demo@test.com / password123");
    }
}
