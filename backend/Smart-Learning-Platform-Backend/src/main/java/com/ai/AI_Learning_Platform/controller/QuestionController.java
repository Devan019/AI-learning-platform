package com.ai.AI_Learning_Platform.controller;


import com.ai.AI_Learning_Platform.model.Question;
import com.ai.AI_Learning_Platform.model.Quiz;
import com.ai.AI_Learning_Platform.repository.QuizRepository;
import com.ai.AI_Learning_Platform.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.Console;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true", allowedHeaders = "*")
public class QuestionController {
    @Autowired
    private QuestionService questionService;
    @Autowired
    private QuizRepository quizRepository; // Fetch Quiz from DB

    @GetMapping("/{quizId}")
    public List<Question> getQuestionsByQuizId(@PathVariable UUID quizId) {
        return questionService.getQuestionsByQuizId(quizId);
    }

//    @PostMapping
//    public Question createQuestion(@RequestBody Question question) {
//        if (question.getQuiz() == null || question.getQuiz().getId() == null) {
//            throw new RuntimeException("Quiz ID is required");
//        }
//
//        Quiz quiz = quizRepository.findById(question.getQuiz().getId())
//                .orElseThrow(() -> new RuntimeException("Quiz not found"));
//
//        question.setQuiz(quiz); // Set valid Quiz object
//
//        return questionService.createQuestion(question);
//
//    }

    @PostMapping
    public Question createQuestion(@RequestBody Map<String, Object> requestData) {
        UUID quizId = UUID.fromString((String) requestData.get("quizId"));

        Question question = new Question();
        question.setQuestionText((String) requestData.get("questionText"));
        question.setOption1((String) requestData.get("option1"));
        question.setOption2((String) requestData.get("option2"));
        question.setOption3((String) requestData.get("option3"));
        question.setOption4((String) requestData.get("option4"));
        question.setCorrectAnswer((String) requestData.get("correctAnswer"));

        return questionService.createQuestion(quizId, question);
    }


    @DeleteMapping("/{id}")
    public void deleteQuestion(@PathVariable UUID id) {
        questionService.deleteQuestion(id);
    }
}