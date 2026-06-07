package com.forexpro.controller;

import com.forexpro.entity.User;
import com.forexpro.service.ConversionService;
import com.forexpro.service.FavoritePairService;
import com.forexpro.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {

    @Autowired
    private UserService userService;

    @Autowired
    private ConversionService conversionService;

    @Autowired
    private FavoritePairService favoritePairService;

    @GetMapping("/")
    public String home() {
        return "index";
    }

    @GetMapping("/index")
    public String index() {
        return "index";
    }

    @GetMapping("/dashboard")
    public String dashboard(Authentication authentication, Model model) {
        if (authentication != null) {
            User user = userService.findByUsername(
                    authentication.getName()).orElse(null);
            if (user != null) {
                model.addAttribute("user", user);
                model.addAttribute("recentHistory",
                        conversionService.getRecentHistory(user.getId()));
                model.addAttribute("favorites",
                        favoritePairService.getUserFavorites(user.getId()));
            }
        }
        return "dashboard";
    }

    @GetMapping("/history")
    public String history(Authentication authentication, Model model) {
        if (authentication != null) {
            User user = userService.findByUsername(
                    authentication.getName()).orElse(null);
            if (user != null) {
                model.addAttribute("user", user);
                model.addAttribute("history",
                        conversionService.getUserHistory(user.getId()));
            }
        }
        return "history";
    }

    @GetMapping("/analytics")
    public String analytics(Authentication authentication, Model model) {
        if (authentication != null) {
            User user = userService.findByUsername(
                    authentication.getName()).orElse(null);
            if (user != null) {
                model.addAttribute("user", user);
            }
        }
        return "analytics";
    }

    @GetMapping("/news")
    public String news(Authentication authentication, Model model) {
        if (authentication != null) {
            User user = userService.findByUsername(
                    authentication.getName()).orElse(null);
            if (user != null) {
                model.addAttribute("user", user);
            }
        }
        return "news";
    }
}