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
        if(chatBot == null) return null;
        System.out.println("chatbot found");
        List<Chat> chats = getChatsByTopic(userid, topic);
        System.out.println("chats");

        Map<String, List<Chat>> allChats = getChats(userid);
        System.out.println("allchats");
        if (chats == null) chats = new ArrayList<>();
        chats.add(chat);
        System.out.println("added");
        allChats.put(topic, chats);
        System.out.println("before");
        chatBotRepository.save(chatBot);
        System.out.println("save thai gayu");
        return chat;
    }

    public Map<String, List<Chat>> createNew(UUID userid, String Topic) {
        ChatBot chatBot = getChatBot(userid);
        Optional<Student> student = studentRepository.findById(userid);
        if (chatBot == null) {
            student.get().setChatBot(chatBot);
            chatBot = new ChatBot();
        }
        Map<String, List<Chat>> newChats = chatBot.getChats();
        if(newChats == null) newChats = new HashMap<>();
        newChats.put(Topic, null);
        if (student.isEmpty()) {
            return null;
        }
        chatBot.setStudent(student.get());
        chatBot.setChats(newChats);
        chatBotRepository.save(chatBot);
        studentRepository.save(student.get());
        return newChats;
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
