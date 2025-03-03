package com.ai.AI_Learning_Platform.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "courses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString(exclude = "contents")  // Prevents infinite recursion
@JsonIgnoreProperties(ignoreUnknown = true)
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String title;
    @Column(length = 1000)
    private String description;

//    @Lob
//    private String content;
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CourseContent> contents;

    // ✅ Relationship with User (Foreign Key)
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)  // Creates a foreign key column
    @JsonIgnore
    private User user;

    private String level;

    @JsonProperty("createdByAI")  // Ensures Jackson recognizes the field correctly
    private Boolean createdByAI;

    // ✅ Ensure contents are correctly linked to the course before saving
    public void setContents(List<CourseContent> contents) {
        this.contents = contents;
        if (contents != null) {
            for (CourseContent content : contents) {
                content.setCourse(this);  // ✅ Ensures correct linkage
            }
        }
    }
}
