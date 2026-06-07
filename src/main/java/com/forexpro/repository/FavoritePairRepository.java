package com.forexpro.repository;

import com.forexpro.entity.FavoritePair;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FavoritePairRepository extends JpaRepository<FavoritePair, Long> {

    List<FavoritePair> findByUserId(Long userId);

    Optional<FavoritePair> findByUserIdAndFromCurrencyAndToCurrency(
            Long userId, String fromCurrency, String toCurrency
    );

    Boolean existsByUserIdAndFromCurrencyAndToCurrency(
            Long userId, String fromCurrency, String toCurrency
    );

    void deleteByUserIdAndFromCurrencyAndToCurrency(
            Long userId, String fromCurrency, String toCurrency
    );
}