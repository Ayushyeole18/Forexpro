package com.forexpro.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExchangeRateDTO {

    private String baseCurrency;
    private Map<String, BigDecimal> rates;
    private LocalDateTime lastUpdated;
    private String status;
}