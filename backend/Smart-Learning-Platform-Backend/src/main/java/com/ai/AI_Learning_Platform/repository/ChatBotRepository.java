package com.ai.AI_Learning_Platform.repository;

import com.ai.AI_Learning_Platform.model.ChatBot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ChatBotRepository extends JpaRepository<ChatBot, UUID> {

}
