package com.tcsion.backend.controller;

import com.tcsion.backend.dto.request.ParseRequest;
import com.tcsion.backend.dto.response.ApiResponse;
import com.tcsion.backend.dto.response.ParseResponse;
import com.tcsion.backend.service.PredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/nlp")
@RequiredArgsConstructor
public class NLPController {

    private final PredictionService predictionService;

    @PostMapping("/parse")
    public ResponseEntity<ApiResponse<ParseResponse>> parse(@RequestBody ParseRequest request) {
        ParseResponse response = predictionService.parseTransaction(request.getText());
        if (response == null) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to parse transaction via ML service", null));
        }
        return ResponseEntity.ok(ApiResponse.success("success", response));
    }
}
