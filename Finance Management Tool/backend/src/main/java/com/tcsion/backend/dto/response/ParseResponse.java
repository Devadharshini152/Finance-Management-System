package com.tcsion.backend.dto.response;

import lombok.Data;

@Data
public class ParseResponse {
    private Double amount;
    private String category;
    private String date;
    private String description;
    private String reason;
    private Double confidence;
}
