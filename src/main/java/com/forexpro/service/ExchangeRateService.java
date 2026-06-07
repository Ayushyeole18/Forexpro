package com.forexpro.service;

import com.forexpro.entity.ExchangeRatesCache;
import com.forexpro.entity.HistoricalRate;
import com.forexpro.repository.ExchangeRatesCacheRepository;
import com.forexpro.repository.HistoricalRateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
public class ExchangeRateService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ExchangeRatesCacheRepository cacheRepository;

    @Autowired
    private HistoricalRateRepository historicalRateRepository;

    @Value("${exchangerate.api.key}")
    private String apiKey;

    @Value("${exchangerate.api.base-url}")
    private String baseUrl;

    @Value("${frankfurter.api.base-url}")
    private String frankfurterUrl;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, BigDecimal> getLatestRates(String baseCurrency) {
        try {
            String url = baseUrl + "/" + apiKey + "/latest/" + baseCurrency;
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);

            Map<String, BigDecimal> rates = new HashMap<>();
            JsonNode ratesNode = root.get("conversion_rates");
            if (ratesNode != null) {
                ratesNode.fields().forEachRemaining(entry ->
                        rates.put(entry.getKey(),
                                new BigDecimal(entry.getValue().asText()))
                );
                updateCache(baseCurrency, rates);
            }
            return rates;
        } catch (Exception e) {
            return getRatesFromCache(baseCurrency);
        }
    }

    public BigDecimal getRate(String fromCurrency, String toCurrency) {
        try {
            Map<String, BigDecimal> rates = getLatestRates(fromCurrency);
            return rates.getOrDefault(toCurrency, BigDecimal.ZERO);
        } catch (Exception e) {
            return getRateFromCache(fromCurrency, toCurrency);
        }
    }

    public Map<String, Object> getHistoricalRates(
            String baseCurrency, String targetCurrency,
            String startDate, String endDate) {
        try {
            String url = frankfurterUrl + "/" + startDate + ".." + endDate +
                    "?from=" + baseCurrency + "&to=" + targetCurrency;
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);

            Map<String, Object> result = new HashMap<>();
            List<String> dates = new ArrayList<>();
            List<BigDecimal> rates = new ArrayList<>();

            JsonNode ratesNode = root.get("rates");
            if (ratesNode != null) {
                ratesNode.fields().forEachRemaining(entry -> {
                    dates.add(entry.getKey());
                    JsonNode rateNode = entry.getValue().get(targetCurrency);
                    if (rateNode != null) {
                        BigDecimal rate = new BigDecimal(rateNode.asText());
                        rates.add(rate);
                        saveHistoricalRate(baseCurrency, targetCurrency,
                                rate, LocalDate.parse(entry.getKey()));
                    }
                });
            }

            result.put("dates", dates);
            result.put("rates", rates);
            result.put("baseCurrency", baseCurrency);
            result.put("targetCurrency", targetCurrency);
            return result;
        } catch (Exception e) {
            return getHistoricalRatesFromDB(baseCurrency, targetCurrency);
        }
    }

    private void updateCache(String baseCurrency, Map<String, BigDecimal> rates) {
        rates.forEach((targetCurrency, rate) -> {
            ExchangeRatesCache cache = cacheRepository
                    .findByBaseCurrencyAndTargetCurrency(baseCurrency, targetCurrency)
                    .orElse(new ExchangeRatesCache());
            cache.setBaseCurrency(baseCurrency);
            cache.setTargetCurrency(targetCurrency);
            cache.setRate(rate);
            cacheRepository.save(cache);
        });
    }

    private Map<String, BigDecimal> getRatesFromCache(String baseCurrency) {
        Map<String, BigDecimal> rates = new HashMap<>();
        cacheRepository.findByBaseCurrency(baseCurrency)
                .forEach(cache -> rates.put(cache.getTargetCurrency(), cache.getRate()));
        return rates;
    }

    private BigDecimal getRateFromCache(String fromCurrency, String toCurrency) {
        return cacheRepository
                .findByBaseCurrencyAndTargetCurrency(fromCurrency, toCurrency)
                .map(ExchangeRatesCache::getRate)
                .orElse(BigDecimal.ONE);
    }

    private void saveHistoricalRate(String base, String target,
                                    BigDecimal rate, LocalDate date) {
        if (!historicalRateRepository
                .findByBaseCurrencyAndTargetCurrencyAndRateDate(base, target, date)
                .isPresent()) {
            HistoricalRate historicalRate = new HistoricalRate();
            historicalRate.setBaseCurrency(base);
            historicalRate.setTargetCurrency(target);
            historicalRate.setRate(rate);
            historicalRate.setRateDate(date);
            historicalRateRepository.save(historicalRate);
        }
    }

    private Map<String, Object> getHistoricalRatesFromDB(
            String baseCurrency, String targetCurrency) {
        Map<String, Object> result = new HashMap<>();
        List<String> dates = new ArrayList<>();
        List<BigDecimal> rates = new ArrayList<>();

        historicalRateRepository
                .findByBaseCurrencyAndTargetCurrencyOrderByRateDateAsc(
                        baseCurrency, targetCurrency)
                .forEach(hr -> {
                    dates.add(hr.getRateDate().toString());
                    rates.add(hr.getRate());
                });

        result.put("dates", dates);
        result.put("rates", rates);
        result.put("baseCurrency", baseCurrency);
        result.put("targetCurrency", targetCurrency);
        return result;
    }

    @Scheduled(fixedRate = 3600000)
    public void refreshRates() {
        List<String> currencies = Arrays.asList(
                "USD", "EUR", "GBP", "JPY", "INR",
                "AUD", "CAD", "CHF", "CNY"
        );
        currencies.forEach(this::getLatestRates);
    }
}