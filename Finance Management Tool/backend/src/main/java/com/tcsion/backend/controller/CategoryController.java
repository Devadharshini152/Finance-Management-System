package com.tcsion.backend.controller;

import com.tcsion.backend.dto.response.ApiResponse;
import com.tcsion.backend.dto.response.CategoryResponse;
import com.tcsion.backend.entity.Category;
import com.tcsion.backend.service.CategoryService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor

public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping

    public ResponseEntity<ApiResponse<List<CategoryResponse>>> list(
            @com.tcsion.backend.security.CurrentUser Long userId) {
        List<CategoryResponse> list = categoryService.findAll(userId);
        return ResponseEntity.ok(ApiResponse.success("OK", list));
    }

    @GetMapping("/income")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> income(
            @com.tcsion.backend.security.CurrentUser Long userId) {
        List<CategoryResponse> list = categoryService.findByType(Category.TransactionType.INCOME, userId);
        return ResponseEntity.ok(ApiResponse.success("OK", list));
    }

    @GetMapping("/expense")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> expense(
            @com.tcsion.backend.security.CurrentUser Long userId) {
        List<CategoryResponse> list = categoryService.findByType(Category.TransactionType.EXPENSE, userId);
        return ResponseEntity.ok(ApiResponse.success("OK", list));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> create(
            @com.tcsion.backend.security.CurrentUser Long userId,
            @jakarta.validation.Valid @RequestBody com.tcsion.backend.dto.request.CategoryRequest request) {
        com.tcsion.backend.entity.User user = new com.tcsion.backend.entity.User();
        user.setId(userId); // Partial user object reference
        CategoryResponse response = categoryService.create(request, user);
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED)
                .body(ApiResponse.success("Category created successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> update(
            @com.tcsion.backend.security.CurrentUser Long userId,
            @PathVariable Long id,
            @jakarta.validation.Valid @RequestBody com.tcsion.backend.dto.request.CategoryRequest request) {
        CategoryResponse response = categoryService.update(id, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Category updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@com.tcsion.backend.security.CurrentUser Long userId,
            @PathVariable Long id) {
        categoryService.delete(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully", null));
    }
}
