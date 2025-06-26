package com.ai.AI_Learning_Platform.model;

import com.ai.AI_Learning_Platform.model.Enums.Level;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "quizzes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String title;

    @ManyToOne
    @JoinColumn(name = "course_id")
    @JsonBackReference
    @ToString.Exclude
    private Course course;

    private int score;

    @Enumerated(EnumType.STRING)
    private Level userLevel;
}