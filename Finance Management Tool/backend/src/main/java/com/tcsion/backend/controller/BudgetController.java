package com.tcsion.backend.controller;

import com.tcsion.backend.dto.request.BudgetRequest;
import com.tcsion.backend.dto.response.ApiResponse;
import com.tcsion.backend.dto.response.BudgetResponse;
import com.tcsion.backend.entity.User;
import com.tcsion.backend.repository.UserRepository;
import com.tcsion.backend.security.CurrentUser;
import com.tcsion.backend.service.BudgetService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor

public class BudgetController {

    private final BudgetService budgetService;
    private final UserRepository userRepository;

    @PostMapping

    public ResponseEntity<ApiResponse<BudgetResponse>> create(
            @CurrentUser Long userId,
            @Valid @RequestBody BudgetRequest request) {
        User user = userRepository.findById(userId).orElseThrow();
        BudgetResponse response = budgetService.create(userId, request, user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Budget created successfully", response));
    }

    @GetMapping

    public ResponseEntity<ApiResponse<List<BudgetResponse>>> list(@CurrentUser Long userId) {
        List<BudgetResponse> list = budgetService.listByUser(userId);
        return ResponseEntity.ok(ApiResponse.success("OK", list));
    }

    @GetMapping("/status")

    public ResponseEntity<ApiResponse<List<BudgetResponse>>> status(
            @CurrentUser Long userId,
            @RequestParam(required = false) YearMonth month) {
        YearMonth target = month != null ? month : YearMonth.now();
        List<BudgetResponse> list = budgetService.listByUserAndMonth(userId, target);
        return ResponseEntity.ok(ApiResponse.success("OK", list));
    }

    @GetMapping("/{id}")

    public ResponseEntity<ApiResponse<BudgetResponse>> getById(@CurrentUser Long userId, @PathVariable Long id) {
        BudgetResponse response = budgetService.getById(id, userId);
        return ResponseEntity.ok(ApiResponse.success("OK", response));
    }

    @PutMapping("/{id}")

    public ResponseEntity<ApiResponse<BudgetResponse>> update(
            @CurrentUser Long userId,
            @PathVariable Long id,
            @Valid @RequestBody BudgetRequest request) {
        User user = userRepository.findById(userId).orElseThrow();
        BudgetResponse response = budgetService.update(id, userId, request, user);
        return ResponseEntity.ok(ApiResponse.success("Budget updated successfully", response));
    }

    @DeleteMapping("/{id}")

    public ResponseEntity<ApiResponse<Void>> delete(@CurrentUser Long userId, @PathVariable Long id) {
        budgetService.delete(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Budget deleted successfully", null));
    }
}
