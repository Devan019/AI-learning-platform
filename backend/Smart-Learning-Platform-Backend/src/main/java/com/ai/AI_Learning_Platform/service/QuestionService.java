package com.ai.AI_Learning_Platform.service;

import com.ai.AI_Learning_Platform.model.Question;
import com.ai.AI_Learning_Platform.model.Quiz;
import com.ai.AI_Learning_Platform.repository.QuestionRepository;
import com.ai.AI_Learning_Platform.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuestionService {
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private QuizRepository quizRepository;

    public List<Question> getQuestionsByQuizId(UUID quizId) {
        return questionRepository.findByQuizId(quizId);
    }

    public Question createQuestion(UUID quizId, Question question) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        question.setQuiz(quiz); // Set valid Quiz object
        return questionRepository.save(question);
    }

    public void deleteQuestion(UUID id) {
        questionRepository.deleteById(id);
    }
}