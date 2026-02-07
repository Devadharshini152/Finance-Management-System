package com.tcsion.backend.repository;

import com.tcsion.backend.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Page<Transaction> findByUserIdAndDeletedAtIsNull(Long userId, Pageable pageable);

    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND t.deletedAt IS NULL " +
           "AND t.transactionDate BETWEEN :start AND :end ORDER BY t.transactionDate DESC")
    List<Transaction> findByUserIdAndDateBetween(
        @Param("userId") Long userId,
        @Param("start") LocalDate start,
        @Param("end") LocalDate end
    );

    List<Transaction> findByUserIdAndDeletedAtIsNullOrderByTransactionDateDesc(Long userId, Pageable pageable);

    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND t.deletedAt IS NULL " +
           "AND t.category.id = :categoryId AND t.transactionDate BETWEEN :start AND :end")
    List<Transaction> findByUserIdAndCategoryIdAndDateBetween(
        @Param("userId") Long userId,
        @Param("categoryId") Long categoryId,
        @Param("start") LocalDate start,
        @Param("end") LocalDate end
    );
}
