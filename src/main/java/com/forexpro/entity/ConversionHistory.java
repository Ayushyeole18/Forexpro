package com.forexpro.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "conversion_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConversionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "from_currency", nullable = false)
    private String fromCurrency;

    @Column(name = "to_currency", nullable = false)
    private String toCurrency;

    @Column(nullable = false, precision = 15, scale = 6)
    private BigDecimal amount;

    @Column(name = "converted_amount", nullable = false, precision = 15, scale = 6)
    private BigDecimal convertedAmount;

    @Column(name = "exchange_rate", nullable = false, precision = 15, scale = 6)
    private BigDecimal exchangeRate;

    @Column(name = "conversion_date")
    private LocalDateTime conversionDate;

    @PrePersist
    protected void onCreate() {
        conversionDate = LocalDateTime.now();
    }
}