package com.ai.AI_Learning_Platform.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class QuizQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String courseTitle; // Links the question to a course
    private String question;

    @ElementCollection
    private List<String> options;  // ["A", "B", "C", "D"]

    private String correctAnswer;
    private String difficulty;  // EASY, MEDIUM, HARD

}
