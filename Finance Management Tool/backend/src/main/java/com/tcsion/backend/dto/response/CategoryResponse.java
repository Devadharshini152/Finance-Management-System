package com.tcsion.backend.dto.response;

import com.tcsion.backend.entity.Category;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponse {

    private Long id;
    private String name;
    private Category.TransactionType type;
    private Boolean isSystem;
}
