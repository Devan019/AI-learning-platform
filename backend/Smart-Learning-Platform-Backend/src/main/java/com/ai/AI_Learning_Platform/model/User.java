package com.ai.AI_Learning_Platform.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "users")
@Setter
@Getter
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String email;
    private String degreeProgram;
    private String university;
    private String mainInterest;
    private String graduationYear;
    private String gpaScore;
    private String extracurricularActivities;
    private String researchInterests;
    private String careerGoals;

    @ElementCollection
    private List<String> technicalSkills;

    @ElementCollection
    private List<String> domainExpertise;

    public User() {}

    // Getters and Setters
}
