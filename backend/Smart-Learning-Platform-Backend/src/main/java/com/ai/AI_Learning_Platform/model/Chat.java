package com.ai.AI_Learning_Platform.model;

import com.ai.AI_Learning_Platform.model.Enums.ChatFrom;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;


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
