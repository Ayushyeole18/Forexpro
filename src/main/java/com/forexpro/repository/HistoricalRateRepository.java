package com.forexpro.repository;

import com.forexpro.entity.HistoricalRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HistoricalRateRepository extends JpaRepository<HistoricalRate, Long> {

    List<HistoricalRate> findByBaseCurrencyAndTargetCurrencyOrderByRateDateAsc(
            String baseCurrency, String targetCurrency
    );

    List<HistoricalRate> findByBaseCurrencyAndTargetCurrencyAndRateDateBetweenOrderByRateDateAsc(
            String baseCurrency, String targetCurrency,
            LocalDate startDate, LocalDate endDate
    );

    Optional<HistoricalRate> findByBaseCurrencyAndTargetCurrencyAndRateDate(
            String baseCurrency, String targetCurrency, LocalDate rateDate
    );
}