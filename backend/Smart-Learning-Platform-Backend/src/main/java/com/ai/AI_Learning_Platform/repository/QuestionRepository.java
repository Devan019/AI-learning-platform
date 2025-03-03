package com.ai.AI_Learning_Platform.repository;

import com.ai.AI_Learning_Platform.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface QuestionRepository extends JpaRepository<Question, UUID> {
    List<Question> findByQuizId(UUID quizId); // Get questions for a specific quiz
}