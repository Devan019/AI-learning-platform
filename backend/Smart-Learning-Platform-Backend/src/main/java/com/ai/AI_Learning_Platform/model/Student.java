package com.ai.AI_Learning_Platform.model;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.engine.internal.Cascade;
import org.springframework.boot.context.properties.bind.DefaultValue;

import java.util.Date;
import java.util.List;

@Entity
@DiscriminatorValue("STUDENT")
@Getter
@Setter
@ToString
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
    private String phone;

    private String order_id;

    private int credits = 30;

    @ElementCollection
    private List<String> technicalSkills;

    @ElementCollection
    private List<String> domainExpertise;

    @OneToOne(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @JsonManagedReference
    private ChatBot chatBot;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Course> courses;

    private int NoOfGeneratedCourses = 0;
}
