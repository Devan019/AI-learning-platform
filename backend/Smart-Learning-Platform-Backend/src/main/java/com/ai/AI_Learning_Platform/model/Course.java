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
@ToString(exclude = "contents")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String title;
    @Column(length = 1000)
    private String description;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CourseContent> contents;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    private String level;

    @JsonProperty("createdByAI")
    private Boolean createdByAI;

    public void setContents(List<CourseContent> contents) {
        this.contents = contents;
        if (contents != null) {
            for (CourseContent content : contents) {
                content.setCourse(this);
            }
        }
    }
}
