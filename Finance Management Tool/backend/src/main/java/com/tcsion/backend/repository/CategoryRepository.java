package com.tcsion.backend.repository;

import com.tcsion.backend.entity.Category;
import com.tcsion.backend.entity.Category.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByType(TransactionType type);

    List<Category> findByTypeOrderByName(TransactionType type);

    // Find system categories OR user's categories
    List<Category> findByUserIdOrIsSystemTrue(Long userId);

    List<Category> findByTypeAndUserIdOrTypeAndIsSystemTrue(TransactionType type1, Long userId, TransactionType type2);

}
