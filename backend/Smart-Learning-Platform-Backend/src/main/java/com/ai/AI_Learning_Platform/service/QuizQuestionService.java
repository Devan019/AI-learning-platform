package com.ai.AI_Learning_Platform.service;

import com.ai.AI_Learning_Platform.model.QuizQuestion;
import com.ai.AI_Learning_Platform.repository.QuizQuestionRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class QuizQuestionService {

    @Autowired
    private QuizQuestionRepository quizQuestionRepository;
    private final ObjectMapper objectMapper = new ObjectMapper(); // JSON Parser
    @Autowired
    private GeminiService geminiService;  // AI service to generate dynamic questions

    // ✅ Create a new quiz question
    public QuizQuestion createQuizQuestion(QuizQuestion quizQuestion) {
        return quizQuestionRepository.save(quizQuestion);
    }

    // ✅ Get all quiz questions
    public List<QuizQuestion> getAllQuizQuestions() {
        return quizQuestionRepository.findAll();
    }

    // ✅ Get a quiz question by ID
    public Optional<QuizQuestion> getQuizQuestionById(Long id) {
        return quizQuestionRepository.findById(id);
    }

    // ✅ Get quiz questions by Course Title & Difficulty Level
    public List<QuizQuestion> getQuizQuestionsByCourseAndDifficulty(String courseTitle, String difficulty) {
        return quizQuestionRepository.findByCourseTitleAndDifficulty(courseTitle, difficulty);
    }

    // ✅ Generate AI-based Quiz Question for a course
    public String generateQuizQuestion(String courseTitle) {
        String prompt = "Generate a multiple-choice question in JSON format for the course: " + courseTitle;
        return geminiService.generateContent(prompt);
    }

    // ✅ Delete a quiz question by ID
    public void deleteQuizQuestion(Long id) {
        quizQuestionRepository.deleteById(id);
    }

    public QuizQuestion generateAndSaveQuestion(String courseTitle, String difficulty) {
        // AI prompt to generate a quiz question
        String prompt = "Generate a multiple-choice question in JSON format for the course: "
                + courseTitle + " with " + difficulty + " difficulty.";

        // Get response from AI
        String aiGeneratedQuestion = geminiService.generateContent(prompt);

        // Convert AI response (JSON) to QuizQuestion object
        QuizQuestion quizQuestion = parseAIResponse(aiGeneratedQuestion,courseTitle);
        quizQuestion.setCourseTitle(courseTitle);
        quizQuestion.setDifficulty(difficulty);

        // Save to DB
        return quizQuestionRepository.save(quizQuestion);
    }


    private QuizQuestion parseAIResponse(String aiResponse, String courseTitle) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(aiResponse);

            // 🔍 Print the response to debug
            System.out.println("AI Response: " + aiResponse);

            JsonNode contents = rootNode.get("contents");
            if (contents == null || !contents.isArray() || contents.isEmpty()) {
                throw new RuntimeException("Invalid AI response: 'contents' field is missing.");
            }

            JsonNode firstPart = contents.get(0).get("parts");
            if (firstPart == null || !firstPart.isArray() || firstPart.isEmpty()) {
                throw new RuntimeException("Invalid AI response: 'parts' field is missing.");
            }

            String questionJson = firstPart.get(0).get("text").asText();
            JsonNode questionNode = objectMapper.readTree(questionJson);

            // Extract fields safely
            String questionText = questionNode.has("question") ? questionNode.get("question").asText() : "Unknown Question";
            String correctAnswer = questionNode.has("correctAnswer") ? questionNode.get("correctAnswer").asText() : "A";
            String difficulty = questionNode.has("difficulty") ? questionNode.get("difficulty").asText() : "EASY";

            List<String> options = new ArrayList<>();
            if (questionNode.has("options") && questionNode.get("options").isArray()) {
                for (JsonNode option : questionNode.get("options")) {
                    options.add(option.asText());
                }
            }

            return new QuizQuestion(null, courseTitle, questionText, options, correctAnswer, difficulty);

        } catch (Exception e) {
            throw new RuntimeException("Error parsing AI response: " + e.getMessage(), e);
        }
    }

}
