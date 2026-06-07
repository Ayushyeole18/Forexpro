package com.forexpro.repository;

import com.forexpro.entity.ConversionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConversionHistoryRepository extends JpaRepository<ConversionHistory, Long> {

    List<ConversionHistory> findByUserIdOrderByConversionDateDesc(Long userId);

    List<ConversionHistory> findTop10ByUserIdOrderByConversionDateDesc(Long userId);

    @Query("SELECT c FROM ConversionHistory c WHERE c.user.id = :userId " +
            "AND c.fromCurrency = :from AND c.toCurrency = :to " +
            "ORDER BY c.conversionDate DESC")
    List<ConversionHistory> findByUserAndCurrencyPair(
            @Param("userId") Long userId,
            @Param("from") String from,
            @Param("to") String to
    );
}