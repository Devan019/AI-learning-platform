package com.ai.AI_Learning_Platform.controller;

import com.ai.AI_Learning_Platform.model.*;
import com.ai.AI_Learning_Platform.repository.CourseRepository;
import com.ai.AI_Learning_Platform.repository.StudentRepository;
import com.ai.AI_Learning_Platform.repository.UserRepository;
import com.ai.AI_Learning_Platform.service.GeminiService;
import com.ai.AI_Learning_Platform.service.QuizQuestionService;
import com.ai.AI_Learning_Platform.service.QuizService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.model.Content;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/gemini")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true", allowedHeaders = "*")
public class AIController {

    @Autowired
    private final GeminiService geminiService;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final StudentRepository studentRepository;
    @Autowired
    private final CourseRepository courseRepository;
    public AIController(GeminiService geminiService, UserRepository userRepository, StudentRepository studentRepository, CourseRepository courseRepository) {
        this.geminiService = geminiService;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }


    //using
    @GetMapping("/course/user/{userId}")
    public String generateCourse(@PathVariable UUID userId) {
        try {
            // Fetch user from DB
//            User user = userRepository.findById(userId).orElse(null);

            Optional<Student> student = studentRepository.findById(userId);
            if (student.isEmpty() || student.get().getMainInterest() == null) {
                return "{\"error\": \"User not found or main interest is missing\"}";
            }

            // Properly escape the JSON format
            String prompt = "Generate a JSON course structure based on the user's interest: " + student.get().getMainInterest() +
                    ". Follow this exact JSON format: { \\\"title\\\": \\\"Course Title\\\", \\\"description\\\": \\\"Brief overview\\\", " +
                    "\\\"contents\\\": [{ \\\"sectionTitle\\\": \\\"Intro\\\", \\\"body\\\": \\\"Content here...\\\" }], " +
                    "\\\"level\\\": \\\"Beginner\\\", \\\"createdByAI\\\": true } keep section body a little big!! .";

            // Call Gemini API
            String aiResponse = geminiService.generateContent(prompt);

            // Validate if response is valid JSON
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.readTree(aiResponse); // If invalid, will throw an exception

            return aiResponse;

        } catch (Exception e) {
            return "{\"error\": \"An unexpected error occurred\"}";
        }
    }

    @Autowired
    private QuizQuestionService quizQuestionService;


    @GetMapping("/quiz")
    public String generateQuiz() {
        return geminiService.generateContent("Generate a quiz in JSON format.");
    }

    @GetMapping("/question")
    public String generateQuestion() {
        return geminiService.generateContent("Generate a multiple-choice question in JSON format. for this course ");
    }

    // WE are using

    //using
    @GetMapping("/question/{course}/{difficulty}")
    public String generateQuestion(@PathVariable String course,@PathVariable String difficulty) {
        return geminiService.generateContent("Generate a multiple-choice question in JSON format. for this course "+course + " give me unique question everytime" +
                "and format should be like this " +
                "{ question: What is the capital of France?" +
                "    options: [Paris, London, Berlin, Madrid]" +
                "    answer: Paris" +
                "    explanation:blah blah blah"+
                "    difficulty:easy (easy or hard)"+
                "  }"+
                "Set difficulty as " + difficulty
        );
    }



    //using
    @GetMapping("/chatbot/{prompt}")
    public  String generateChat(@PathVariable String prompt){

        String context = "This is a chatbot for my AI based learning system now in JSON format {reply:} give reply to this prompt  ";

        return  geminiService.generateContent(context+prompt.replaceAll(" ", "-"));
    }



}
