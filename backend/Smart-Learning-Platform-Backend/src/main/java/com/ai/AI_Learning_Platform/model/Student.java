package com.ai.AI_Learning_Platform.model;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.boot.context.properties.bind.DefaultValue;

import java.util.Date;
import java.util.List;

@Entity
@DiscriminatorValue("STUDENT")
@Getter
@Setter
@ToString()
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
    @Column(columnDefinition = "DATETIME")
    private Date payment_date;
    @Column(columnDefinition = "DATETIME")
    private Date renew_date;
    @Enumerated(value = EnumType.STRING)
    private SUBSCRIPTION subscription;

    @ElementCollection
    private List<String> technicalSkills;

    @ElementCollection
    private List<String> domainExpertise;

    @OneToOne(mappedBy = "student")
    @JsonIgnore
    @JsonManagedReference
    private ChatBot chatBot;

    private int NoOfGeneratedCourses = 0;
}
