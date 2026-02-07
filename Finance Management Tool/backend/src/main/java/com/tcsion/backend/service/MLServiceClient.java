package com.tcsion.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class MLServiceClient {

    @Value("${ml.service.base-url}")
    private String mlServiceBaseUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    /**
     * Call ML service to classify transaction description into a category.
     * Returns category name or null if service unavailable.
     */
    public String classifyTransaction(String description) {
        try {
            String url = mlServiceBaseUrl + "/classify";
            Map<String, Object> body = new HashMap<>();
            body.put("description", description != null ? description : "");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode node = objectMapper.readTree(response.getBody());
                if (node.has("predicted_category")) {
                    return node.get("predicted_category").asText();
                }
            }
        } catch (Exception e) {
            log.warn("ML classification failed: {}", e.getMessage());
        }
        return null;
    }

    /**
     * Call ML service to predict spending for upcoming months.
     */
    public com.tcsion.backend.dto.response.MLPredictionResponse predictSpending(
            java.util.List<com.tcsion.backend.dto.request.TransactionRequest> transactions) {
        try {
            String url = mlServiceBaseUrl + "/predict";
            Map<String, Object> body = new HashMap<>();

            // Map TransactionRequest to structure expected by ML service (date as string)
            var txList = transactions.stream().map(t -> {
                Map<String, Object> m = new java.util.HashMap<>();
                m.put("amount", t.getAmount());
                m.put("date", t.getTransactionDate().toString());
                m.put("type", t.getType().toString());
                m.put("description", t.getDescription());
                m.put("category", t.getCategoryName());
                // category is optional for ML if description is good, but let's pass it if
                // needed?
                // ML service predict_spending uses "description" or "category" logic.
                // Let's stick to what ML service expects:
                // class Transaction(BaseModel):
                // amount: float
                // date: str
                // type: str # INCOME/EXPENSE
                // description: Optional[str] = None
                return m;
            }).toList();

            body.put("transactions", txList);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<com.tcsion.backend.dto.response.MLPredictionResponse> response = restTemplate.exchange(url,
                    HttpMethod.POST, entity, com.tcsion.backend.dto.response.MLPredictionResponse.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            }
        } catch (Exception e) {
            log.warn("ML prediction failed: {}", e.getMessage());
        }
        return null;
    }

    public com.tcsion.backend.dto.response.ParseResponse parseTransaction(String text) {
        try {
            String url = mlServiceBaseUrl + "/nlp/parse";
            Map<String, String> body = new HashMap<>();
            body.put("text", text);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<com.tcsion.backend.dto.response.ParseResponse> response = restTemplate.exchange(url,
                    HttpMethod.POST, entity, com.tcsion.backend.dto.response.ParseResponse.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            }
        } catch (Exception e) {
            log.warn("ML parse failed: {}", e.getMessage());
        }
        return null;
    }
}
