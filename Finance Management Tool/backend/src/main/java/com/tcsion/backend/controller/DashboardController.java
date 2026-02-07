package com.tcsion.backend.controller;

import com.tcsion.backend.dto.response.ApiResponse;
import com.tcsion.backend.dto.response.DashboardResponse;
import com.tcsion.backend.security.CurrentUser;
import com.tcsion.backend.service.DashboardService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor

public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/overview")

    public ResponseEntity<ApiResponse<DashboardResponse>> overview(@CurrentUser Long userId) {
        DashboardResponse response = dashboardService.getOverview(userId);
        return ResponseEntity.ok(ApiResponse.success("OK", response));
    }
}
