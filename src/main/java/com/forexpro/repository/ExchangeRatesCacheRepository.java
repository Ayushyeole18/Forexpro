package com.forexpro.repository;

import com.forexpro.entity.ExchangeRatesCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExchangeRatesCacheRepository extends JpaRepository<ExchangeRatesCache, Long> {

    Optional<ExchangeRatesCache> findByBaseCurrencyAndTargetCurrency(
            String baseCurrency, String targetCurrency
    );

    List<ExchangeRatesCache> findByBaseCurrency(String baseCurrency);
}