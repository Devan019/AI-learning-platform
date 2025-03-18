package com.ai.AI_Learning_Platform.repository;

import com.ai.AI_Learning_Platform.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChatRepository extends JpaRepository<Chat, UUID> {
    public List<Chat> findByTopic(String topic);
}
