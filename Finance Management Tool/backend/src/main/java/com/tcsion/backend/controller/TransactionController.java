package com.tcsion.backend.controller;

import com.tcsion.backend.dto.request.TransactionRequest;
import com.tcsion.backend.dto.response.ApiResponse;
import com.tcsion.backend.dto.response.TransactionResponse;
import com.tcsion.backend.entity.User;
import com.tcsion.backend.repository.UserRepository;
import com.tcsion.backend.security.CurrentUser;
import com.tcsion.backend.service.TransactionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor

public class TransactionController {

    private final TransactionService transactionService;
    private final UserRepository userRepository;

    @PostMapping

    public ResponseEntity<ApiResponse<TransactionResponse>> create(
            @CurrentUser Long userId,
            @Valid @RequestBody TransactionRequest request) {
        User user = userRepository.findById(userId).orElseThrow();
        TransactionResponse response = transactionService.create(userId, request, user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Transaction created successfully", response));
    }

    @GetMapping

    public ResponseEntity<ApiResponse<Page<TransactionResponse>>> list(
            @CurrentUser Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            Pageable pageable) {
        Page<TransactionResponse> page = transactionService.list(userId, start, end, pageable);
        return ResponseEntity.ok(ApiResponse.success("OK", page));
    }

    @GetMapping("/{id}")

    public ResponseEntity<ApiResponse<TransactionResponse>> getById(@CurrentUser Long userId, @PathVariable Long id) {
        TransactionResponse response = transactionService.getById(id, userId);
        return ResponseEntity.ok(ApiResponse.success("OK", response));
    }

    @PutMapping("/{id}")

    public ResponseEntity<ApiResponse<TransactionResponse>> update(
            @CurrentUser Long userId,
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest request) {
        User user = userRepository.findById(userId).orElseThrow();
        TransactionResponse response = transactionService.update(id, userId, request, user);
        return ResponseEntity.ok(ApiResponse.success("Transaction updated successfully", response));
    }

    @DeleteMapping("/{id}")

    public ResponseEntity<ApiResponse<Void>> delete(@CurrentUser Long userId, @PathVariable Long id) {
        transactionService.delete(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Transaction deleted successfully", null));
    }
}
