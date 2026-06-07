package com.forexpro.service;

import com.forexpro.entity.FavoritePair;
import com.forexpro.entity.User;
import com.forexpro.repository.FavoritePairRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class FavoritePairService {

    @Autowired
    private FavoritePairRepository favoritePairRepository;

    public List<FavoritePair> getUserFavorites(Long userId) {
        return favoritePairRepository.findByUserId(userId);
    }

    public FavoritePair addFavorite(User user,
                                    String fromCurrency, String toCurrency) {
        if (favoritePairRepository
                .existsByUserIdAndFromCurrencyAndToCurrency(
                        user.getId(), fromCurrency, toCurrency)) {
            throw new RuntimeException("Pair already in favorites");
        }

        FavoritePair pair = new FavoritePair();
        pair.setUser(user);
        pair.setFromCurrency(fromCurrency);
        pair.setToCurrency(toCurrency);
        return favoritePairRepository.save(pair);
    }

    @Transactional
    public void removeFavorite(Long userId,
                               String fromCurrency, String toCurrency) {
        favoritePairRepository
                .deleteByUserIdAndFromCurrencyAndToCurrency(
                        userId, fromCurrency, toCurrency);
    }

    public boolean isFavorite(Long userId,
                              String fromCurrency, String toCurrency) {
        return favoritePairRepository
                .existsByUserIdAndFromCurrencyAndToCurrency(
                        userId, fromCurrency, toCurrency);
    }
}