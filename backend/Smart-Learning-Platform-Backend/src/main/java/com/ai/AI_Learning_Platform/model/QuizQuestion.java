package com.ai.AI_Learning_Platform.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class QuizQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID id;

    private String courseTitle; // Links the question to a course
    private String question;
    private List<String> options;

    private String correctAnswer;
    private String difficulty;  // EASY, MEDIUM, HARD

}
