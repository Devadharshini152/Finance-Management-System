package com.tcsion.backend.controller;

import com.tcsion.backend.dto.response.ApiResponse;
import com.tcsion.backend.security.CurrentUser;
import com.tcsion.backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/budget-recommendations")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getBudgetRecommendations(@CurrentUser Long userId) {
        return ResponseEntity.ok(ApiResponse.success("success", analyticsService.getBudgetRecommendations(userId)));
    }

    @GetMapping("/health-score")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealthScore(@CurrentUser Long userId) {
        return ResponseEntity.ok(ApiResponse.success("success", analyticsService.getFinancialHealthScore(userId)));
    }
}
