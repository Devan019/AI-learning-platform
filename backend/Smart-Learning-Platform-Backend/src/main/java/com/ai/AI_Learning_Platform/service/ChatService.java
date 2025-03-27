package com.ai.AI_Learning_Platform.service;

import com.ai.AI_Learning_Platform.model.Chat;
import com.ai.AI_Learning_Platform.model.ChatBot;
import com.ai.AI_Learning_Platform.model.Student;
import com.ai.AI_Learning_Platform.repository.ChatBotRepository;
import com.ai.AI_Learning_Platform.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ChatService {
    private final StudentRepository studentRepository;
    private final ChatBotRepository chatBotRepository;

    @Autowired
    public ChatService(StudentRepository studentRepository, ChatBotRepository chatRepository) {
        this.studentRepository = studentRepository;
        this.chatBotRepository = chatRepository;
    }

    public ChatBot getChatBot(UUID userid) {
        Optional<Student> student = studentRepository.findById(userid);
        if(student.isEmpty()) return null;
        return student.get().getChatBot();
    }

    public Map<String, List<Chat>> getChats(UUID userid) {
        ChatBot chatBot = getChatBot(userid);
        if (chatBot == null) return null;
        return chatBot.getChats();
    }


    public List<Chat> getChatsByTopic(UUID userid, String topic) {
        Map<String, List<Chat>> allChats = getChats(userid);
        if (allChats == null) return null;
        return allChats.get(topic);
    }


    public Chat createChat(UUID userid, String topic, Chat chat) {
        System.out.println("in");
        ChatBot chatBot = getChatBot(userid);

        // If chatbot doesn't exist, create a new one
        if(chatBot == null){
            createNew(userid, topic);
            chatBot = getChatBot(userid); // Get the newly created chatbot
        }

        System.out.println("chatbot found");

        // Initialize chats map if null
        if (chatBot.getChats() == null) {
            chatBot.setChats(new HashMap<>());
        }

        // Get or create the chat list for the topic
        List<Chat> chats = chatBot.getChats().computeIfAbsent(topic, k -> new ArrayList<>());

        // Add the new chat
        chats.add(chat);
        System.out.println("added");

        // Save the updated chatbot
        chatBotRepository.save(chatBot);
        System.out.println("save thai gayu");

        return chat;
    }

    public List<String> getTitles(UUID userid){
        Map<String, List<Chat>> allChats = getChats(userid);
        if(allChats == null || allChats.keySet() == null) return null;
        return allChats.keySet().stream().toList();
    }

    public Map<String, List<Chat>> createNew(UUID userid, String Topic) {
        Optional<Student> student = studentRepository.findById(userid);
        if (student.isEmpty()) {
            return null;
        }

        ChatBot chatBot = student.get().getChatBot();
        if (chatBot == null) {
            chatBot = new ChatBot();
            chatBot.setStudent(student.get());
            chatBot.setChats(new HashMap<>());
        }

        // Initialize chats if null
        if (chatBot.getChats() == null) {
            chatBot.setChats(new HashMap<>());
        }

        // Add the topic with empty list if not exists
        chatBot.getChats().putIfAbsent(Topic, new ArrayList<>());

        student.get().setChatBot(chatBot);
        chatBotRepository.save(chatBot);
        studentRepository.save(student.get());

        return chatBot.getChats();
    }

    public List<Chat> renameTopic(UUID userid, String oldName, String newName) {
        ChatBot chatBot = getChatBot(userid);
        Map<String, List<Chat>> allChats = chatBot.getChats();
        List<Chat> chats = allChats.get(oldName);
        allChats.remove(oldName);
        allChats.put(newName, chats);
        chatBotRepository.save(chatBot);
        return chats;
    }

    public ResponseEntity<?> deleteChatsNyTopic(UUID userid, String topic) {
        ChatBot chatBot = getChatBot(userid);
        Map<String, List<Chat>> allChats = chatBot.getChats();
        List<Chat> chats = allChats.get(topic);
        allChats.remove(topic);
        chatBotRepository.save(chatBot);
        return ResponseEntity.ok(200);
    }


}
