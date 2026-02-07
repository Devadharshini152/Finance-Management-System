package com.tcsion.backend.repository;

import com.tcsion.backend.entity.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PredictionRepository extends JpaRepository<Prediction, Long> {

    List<Prediction> findByUserIdOrderByTargetMonthAsc(Long userId);

    org.springframework.data.domain.Page<Prediction> findByUserId(Long userId,
            org.springframework.data.domain.Pageable pageable);

    List<Prediction> findByUserIdAndTargetMonthBetween(Long userId, java.time.LocalDate start, java.time.LocalDate end);

    @Query("SELECT p FROM Prediction p WHERE p.user.id = :userId ORDER BY p.createdAt DESC")
    List<Prediction> findLatestByUserId(@Param("userId") Long userId);

    void deleteByUserId(Long userId);
}
