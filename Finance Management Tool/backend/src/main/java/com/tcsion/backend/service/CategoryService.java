package com.tcsion.backend.service;

import com.tcsion.backend.dto.response.CategoryResponse;
import com.tcsion.backend.entity.Category;
import com.tcsion.backend.entity.Category.TransactionType;
import com.tcsion.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryResponse> findAll(Long userId) {
        return categoryRepository.findByUserIdOrIsSystemTrue(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> findByType(TransactionType type, Long userId) {
        return categoryRepository.findByTypeAndUserIdOrTypeAndIsSystemTrue(type, userId, type).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryResponse create(com.tcsion.backend.dto.request.CategoryRequest request,
            com.tcsion.backend.entity.User user) {
        Category category = Category.builder()
                .name(request.getName())
                .type(request.getType())
                .isSystem(false)
                .user(user)
                .build();
        category = categoryRepository.save(category);
        return toResponse(category);
    }

    @Transactional
    public CategoryResponse update(Long id, com.tcsion.backend.dto.request.CategoryRequest request, Long userId) {
        Category category = getEntityById(id);
        if (Boolean.TRUE.equals(category.getIsSystem())
                || (category.getUser() != null && !category.getUser().getId().equals(userId))) {
            throw new com.tcsion.backend.exception.ForbiddenException("Cannot update this category");
        }
        category.setName(request.getName());
        category.setType(request.getType());
        category = categoryRepository.save(category);
        return toResponse(category);
    }

    @Transactional
    public void delete(Long id, Long userId) {
        Category category = getEntityById(id);
        if (Boolean.TRUE.equals(category.getIsSystem())
                || (category.getUser() != null && !category.getUser().getId().equals(userId))) {
            throw new com.tcsion.backend.exception.ForbiddenException("Cannot delete this category");
        }
        // TODO: specific check if transactions exist? For now, we rely on FK
        // constraints or simply let it fall
        // Ideally we should block deletion if used.
        if (!category.getTransactions().isEmpty() || !category.getBudgets().isEmpty()) {
            throw new com.tcsion.backend.exception.BadRequestException(
                    "Cannot delete category with associated transactions or budgets");
        }
        categoryRepository.delete(category);
    }

    @Transactional(readOnly = true)
    public Category getEntityById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new com.tcsion.backend.exception.ResourceNotFoundException("Category", id));
    }

    private CategoryResponse toResponse(Category c) {
        return CategoryResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .type(c.getType())
                .isSystem(c.getIsSystem())
                .build();
    }
}
