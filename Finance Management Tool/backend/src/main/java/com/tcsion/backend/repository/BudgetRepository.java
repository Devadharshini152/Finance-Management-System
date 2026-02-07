package com.tcsion.backend.repository;

import com.tcsion.backend.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByUserId(Long userId);

    List<Budget> findByUserIdAndBudgetMonth(Long userId, YearMonth budgetMonth);

    @Query("SELECT b FROM Budget b WHERE b.user.id = :userId AND b.budgetMonth = :month")
    List<Budget> findByUserIdAndMonth(@Param("userId") Long userId, @Param("month") YearMonth month);

    Optional<Budget> findByUserIdAndCategoryIdAndBudgetMonth(Long userId, Long categoryId, YearMonth budgetMonth);
}
