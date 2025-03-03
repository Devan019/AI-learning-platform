package com.ai.AI_Learning_Platform.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GeminiService {
    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);
    @Value("${gemini.model}")
    private String API_URL;
    @Value("${gemini.key}")
    private String API_KEY; // Replace with your key


//    private final String COURSE_PROMPT = "Generate a JSON course structure with the following fields: title (string), description (string), contents (array of objects with id, sectionTitle, body), level (string), createdByAI (boolean). Provide only the JSON output with big content body.";
//    public String generateCourse() {
//        return generateContent(COURSE_PROMPT);
//    }


    public String generateContent(String prompt) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Correct JSON format for Gemini API
        String requestBody = "{ \"contents\": [{ \"parts\": [{ \"text\": \"" + prompt + "\" }] }] }";

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response;

        try {
            response = restTemplate.exchange(API_URL + "?key=" + API_KEY, HttpMethod.POST, entity, String.class);
            return response.getBody();
        } catch (Exception e) {
            logger.error("Error calling Gemini API: ", e);
            return "{ \"error\": \"Failed to get response from Gemini API\" }\n" + e;
        }
    }
}