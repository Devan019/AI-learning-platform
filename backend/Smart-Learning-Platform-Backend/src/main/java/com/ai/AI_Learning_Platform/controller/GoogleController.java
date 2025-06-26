package com.ai.AI_Learning_Platform.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/google")
public class GoogleController {
    @GetMapping("/oauth")
    public void redirectToGoogle(HttpServletResponse response) throws IOException {
        System.out.println ("out bro" );
        response.sendRedirect("/oauth2/authorization/google");
    }

    @GetMapping("/callback")
    public void callbackHandler(HttpServletResponse response) throws IOException {
        System.out.println ("in bro" );
        // Spring Security will automatically handle this
        response.sendRedirect("http://localhost:3000/success");
    }

    @GetMapping("/profile")
    public Map<String, Object> getUserDetails(Principal principal) {
        if (principal instanceof OAuth2User oauth2User) {
            System.out.println ( oauth2User.getAttributes());
            return oauth2User.getAttributes();
        }
        return Map.of("error", "Not authenticated");
    }

}
