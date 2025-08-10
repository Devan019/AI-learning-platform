package com.ai.AI_Learning_Platform.model;

import com.ai.AI_Learning_Platform.model.Enums.Level;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class CourseDTO {
    private UUID id;
    private String title;
    private String description;
    private Level level;
    private Boolean createdByAI;
}
