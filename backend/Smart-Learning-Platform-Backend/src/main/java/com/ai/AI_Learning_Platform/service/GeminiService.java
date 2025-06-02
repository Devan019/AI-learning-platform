package com.ai.AI_Learning_Platform.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {
    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

    @Value("${gemini.model}")
    private String model;  // e.g., "gemini-2.0-flash"

    @Value("${GOOGLE_API_KEY}")
    private String apiKey;

    public String generateContent(String prompt) {
        try {
//            System.setProperty("GOOGLE_API_KEY", apiKey);
            Client client = new Client();
            GenerateContentResponse response = client.models.generateContent(
                    model, // use injected model
                    prompt,
                    null
            );
            return response.text();
        } catch (Exception e) {
            logger.error("Error calling Gemini API: ", e);
            return "{ \"error\": \"Failed to get response from Gemini API\" }\n" + e;
        }
    }
}
