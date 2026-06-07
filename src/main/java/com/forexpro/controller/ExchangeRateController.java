package com.forexpro.controller;

import com.forexpro.dto.ConversionRequestDTO;
import com.forexpro.dto.ConversionResponseDTO;
import com.forexpro.entity.User;
import com.forexpro.service.ConversionService;
import com.forexpro.service.ExchangeRateService;
import com.forexpro.service.FavoritePairService;
import com.forexpro.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ExchangeRateController {

    @Autowired
    private ExchangeRateService exchangeRateService;

    @Autowired
    private ConversionService conversionService;

    @Autowired
    private FavoritePairService favoritePairService;

    @Autowired
    private UserService userService;

    @GetMapping("/rates/{baseCurrency}")
    public ResponseEntity<Map<String, BigDecimal>> getRates(
            @PathVariable String baseCurrency) {
        Map<String, BigDecimal> rates =
                exchangeRateService.getLatestRates(baseCurrency.toUpperCase());
        return ResponseEntity.ok(rates);
    }

    @GetMapping("/rates/{from}/{to}")
    public ResponseEntity<Map<String, Object>> getRate(
            @PathVariable String from,
            @PathVariable String to) {
        BigDecimal rate = exchangeRateService.getRate(
                from.toUpperCase(), to.toUpperCase());
        Map<String, Object> response = new HashMap<>();
        response.put("from", from.toUpperCase());
        response.put("to", to.toUpperCase());
        response.put("rate", rate);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/convert")
    public ResponseEntity<ConversionResponseDTO> convert(
            @Valid @RequestBody ConversionRequestDTO request,
            Authentication authentication) {
        User user = null;
        if (authentication != null) {
            user = userService.findByUsername(
                    authentication.getName()).orElse(null);
        }
        ConversionResponseDTO response =
                conversionService.convert(request, user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/historical")
    public ResponseEntity<Map<String, Object>> getHistoricalRates(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        Map<String, Object> data = exchangeRateService.getHistoricalRates(
                from.toUpperCase(), to.toUpperCase(), startDate, endDate);
        return ResponseEntity.ok(data);
    }

    @PostMapping("/favorites/add")
    public ResponseEntity<Map<String, Object>> addFavorite(
            @RequestParam String from,
            @RequestParam String to,
            Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        if (authentication == null) {
            response.put("status", "error");
            response.put("message", "Please login first");
            return ResponseEntity.ok(response);
        }
        User user = userService.findByUsername(
                authentication.getName()).orElse(null);
        if (user == null) {
            response.put("status", "error");
            response.put("message", "User not found");
            return ResponseEntity.ok(response);
        }
        try {
            favoritePairService.addFavorite(user,
                    from.toUpperCase(), to.toUpperCase());
            response.put("status", "success");
            response.put("message", "Added to favorites");
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/favorites/remove")
    public ResponseEntity<Map<String, Object>> removeFavorite(
            @RequestParam String from,
            @RequestParam String to,
            Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        if (authentication == null) {
            response.put("status", "error");
            response.put("message", "Please login first");
            return ResponseEntity.ok(response);
        }
        User user = userService.findByUsername(
                authentication.getName()).orElse(null);
        if (user != null) {
            favoritePairService.removeFavorite(user.getId(),
                    from.toUpperCase(), to.toUpperCase());
            response.put("status", "success");
            response.put("message", "Removed from favorites");
        }
        return ResponseEntity.ok(response);
    }
}