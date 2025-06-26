package com.ai.AI_Learning_Platform.controller;

import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class OauthUserController {

    @GetMapping("/me")
    public Map<String, Object> getUserInfo(Principal principal) {
        if (principal instanceof OAuth2User oauthUser) {
            System.out.println ( oauthUser.getAttributes() + " get it");
            return oauthUser.getAttributes(); // contains email, name, picture, etc.
        }

        return Map.of("error", "User not authenticated");
    }
}
