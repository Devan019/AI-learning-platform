package com.ai.AI_Learning_Platform.model;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@DiscriminatorValue("STUDENT")
@Getter
@Setter
@ToString(exclude = "chats")
@AllArgsConstructor
@NoArgsConstructor
public class Student extends User{

    private String fullName;
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

    @OneToOne(mappedBy = "student")
    private ChatBot chatBot;
}
