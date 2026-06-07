package com.forexpro.service;

import com.forexpro.dto.ConversionRequestDTO;
import com.forexpro.dto.ConversionResponseDTO;
import com.forexpro.entity.ConversionHistory;
import com.forexpro.entity.User;
import com.forexpro.repository.ConversionHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class ConversionService {

    @Autowired
    private ExchangeRateService exchangeRateService;

    @Autowired
    private ConversionHistoryRepository historyRepository;

    public ConversionResponseDTO convert(
            ConversionRequestDTO request, User user) {
        BigDecimal rate = exchangeRateService.getRate(
                request.getFromCurrency(), request.getToCurrency()
        );

        BigDecimal convertedAmount = request.getAmount()
                .multiply(rate)
                .setScale(6, RoundingMode.HALF_UP);

        if (user != null) {
            ConversionHistory history = new ConversionHistory();
            history.setUser(user);
            history.setFromCurrency(request.getFromCurrency());
            history.setToCurrency(request.getToCurrency());
            history.setAmount(request.getAmount());
            history.setConvertedAmount(convertedAmount);
            history.setExchangeRate(rate);
            historyRepository.save(history);
        }

        ConversionResponseDTO response = new ConversionResponseDTO();
        response.setFromCurrency(request.getFromCurrency());
        response.setToCurrency(request.getToCurrency());
        response.setAmount(request.getAmount());
        response.setConvertedAmount(convertedAmount);
        response.setExchangeRate(rate);
        response.setStatus("success");
        response.setMessage("Conversion successful");

        return response;
    }

    public List<ConversionHistory> getUserHistory(Long userId) {
        return historyRepository
                .findByUserIdOrderByConversionDateDesc(userId);
    }

    public List<ConversionHistory> getRecentHistory(Long userId) {
        return historyRepository
                .findTop10ByUserIdOrderByConversionDateDesc(userId);
    }
}