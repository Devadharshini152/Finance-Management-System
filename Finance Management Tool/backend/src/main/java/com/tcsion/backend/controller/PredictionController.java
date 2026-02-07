package com.tcsion.backend.controller;

import com.tcsion.backend.dto.response.ApiResponse;
import com.tcsion.backend.dto.response.PredictionResponse;
import com.tcsion.backend.security.CurrentUser;
import com.tcsion.backend.service.PredictionService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/predictions")
@RequiredArgsConstructor

public class PredictionController {

    private final PredictionService predictionService;

    @GetMapping
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<PredictionResponse>>> list(
            @CurrentUser Long userId,
            org.springframework.data.domain.Pageable pageable) {
        var page = predictionService.getByUserId(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success("OK", page));
    }

    @GetMapping("/latest")

    public ResponseEntity<ApiResponse<List<PredictionResponse>>> latest(@CurrentUser Long userId) {
        List<PredictionResponse> list = predictionService.getLatestByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("OK", list));
    }
}
