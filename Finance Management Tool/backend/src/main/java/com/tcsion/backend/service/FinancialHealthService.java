package com.tcsion.backend.service;

import com.tcsion.backend.entity.FinancialHealth;
import com.tcsion.backend.entity.User;
import com.tcsion.backend.repository.FinancialHealthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.YearMonth;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FinancialHealthService {

    private final FinancialHealthRepository financialHealthRepository;

    @Transactional(readOnly = true)
    public Optional<FinancialHealth> getLatestByUserId(Long userId) {
        return financialHealthRepository.findFirstByUserIdOrderByScoreMonthDesc(userId);
    }

    @Transactional(readOnly = true)
    public Optional<FinancialHealth> getByUserIdAndMonth(Long userId, YearMonth month) {
        return financialHealthRepository.findByUserIdAndScoreMonth(userId, month);
    }
}
