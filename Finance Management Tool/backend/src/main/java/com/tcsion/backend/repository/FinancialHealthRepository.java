package com.tcsion.backend.repository;

import com.tcsion.backend.entity.FinancialHealth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.YearMonth;
import java.util.Optional;

@Repository
public interface FinancialHealthRepository extends JpaRepository<FinancialHealth, Long> {

    Optional<FinancialHealth> findFirstByUserIdOrderByScoreMonthDesc(Long userId);

    Optional<FinancialHealth> findByUserIdAndScoreMonth(Long userId, YearMonth scoreMonth);
}
