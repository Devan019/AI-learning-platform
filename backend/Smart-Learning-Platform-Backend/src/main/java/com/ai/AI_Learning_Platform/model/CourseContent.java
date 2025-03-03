package com.ai.AI_Learning_Platform.model;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "course_content")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString(exclude = "course")  // Prevents infinite recursion
public class CourseContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increments ID (1,2,3...)
    private Long id;

    private String sectionTitle;

    @Lob
    @Column(columnDefinition = "TEXT")  // Allow long text
    private String body;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    @JsonBackReference
    private Course course;
}
