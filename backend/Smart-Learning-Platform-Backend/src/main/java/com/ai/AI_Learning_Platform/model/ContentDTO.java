package com.ai.AI_Learning_Platform.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ContentDTO {
    private UUID id;
    private String sectionTitle;
    private String body;
}
