package com.ai.AI_Learning_Platform.controller.StudentControllers;

import com.ai.AI_Learning_Platform.model.Quiz;
import com.ai.AI_Learning_Platform.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {
    @Autowired
    private QuizService quizService;

    @PostMapping("{course_id}")
    public Quiz saveReport(@RequestBody  Quiz quiz, @PathVariable UUID course_id){
        return quizService.saveQuizReport(quiz, course_id);
    }

    @GetMapping("{course_id}")
    public List<Quiz> getQuizzesReports(@PathVariable UUID course_id){
        return quizService.getQuizzesReports(course_id);
    }
}

