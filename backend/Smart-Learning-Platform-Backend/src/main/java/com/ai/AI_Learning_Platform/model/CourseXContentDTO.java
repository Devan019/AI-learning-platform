package com.ai.AI_Learning_Platform.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CourseXContentDTO {
    private UUID id;
    private String title;
    private String description;
    private String level;
    private Boolean createdByAI;
    private List<ContentDTO> contents;
}
