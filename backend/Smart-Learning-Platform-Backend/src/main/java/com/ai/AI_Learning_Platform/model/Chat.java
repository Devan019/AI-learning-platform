package com.ai.AI_Learning_Platform.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.UUID;


@Embeddable
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Chat {
    @Enumerated(EnumType.STRING)
    private ChatFrom chatFrom;

    private String message;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt = new Date();

}
