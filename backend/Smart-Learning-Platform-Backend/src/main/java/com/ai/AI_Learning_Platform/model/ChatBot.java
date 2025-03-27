package com.ai.AI_Learning_Platform.model;

import com.ai.AI_Learning_Platform.Configs.MapToJsonConverter;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "chatbot")
@Getter
@Setter
@ToString(exclude = "student")
@RequiredArgsConstructor
public class ChatBot {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    //    @ElementCollection
//    @CollectionTable(name = "topics_chats", joinColumns = @JoinColumn(name = "chat_id"))
//    @MapKey(name = "topic")
    @Column(columnDefinition = "LONGTEXT")
    @Convert(converter = MapToJsonConverter.class)
    private Map<String, List<Chat>> chats;

    @OneToOne
    @JoinColumn(name = "student_id")
    @JsonBackReference
    private Student student;

}
