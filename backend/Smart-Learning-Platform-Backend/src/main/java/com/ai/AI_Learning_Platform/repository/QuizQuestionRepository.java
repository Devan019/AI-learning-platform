package com.ai.AI_Learning_Platform.repository;
import com.ai.AI_Learning_Platform.model.QuizQuestion;
import jakarta.persistence.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {
    List<QuizQuestion> findByCourseTitleAndDifficulty(String courseTitle, String difficulty);
}
