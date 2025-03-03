package com.ai.AI_Learning_Platform.repository;

import com.ai.AI_Learning_Platform.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface QuizRepository extends JpaRepository<Quiz, UUID> {
}