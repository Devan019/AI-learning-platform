package com.ai.AI_Learning_Platform.service;

import com.ai.AI_Learning_Platform.model.Chat;
import com.ai.AI_Learning_Platform.model.Student;
import com.ai.AI_Learning_Platform.repository.ChatRepository;
import com.ai.AI_Learning_Platform.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ChatService {
    private StudentRepository studentRepository;
    private ChatRepository chatRepository;

    @Autowired
    public ChatService(StudentRepository studentRepository, ChatRepository chatRepository){
        this.studentRepository = studentRepository;
        this.chatRepository = chatRepository;
    }

    public Chat createChat(Chat chat, UUID userid){
        Optional<Student> student = studentRepository.findById(userid);

        if(student.isEmpty()) return null;


        Student student1 = student.get();
        chat.setStudent(student1);
        Chat savedChat = chatRepository.save(chat);

        student1.getChats().add(savedChat);
        studentRepository.save(student1);
        return savedChat;

    }

    public List<Chat> getChats(UUID userid){
        Optional<Student>  student = studentRepository.findById(userid);
        if(student.isEmpty()) return  null;
        Student student1 =  student.get();
        return student1.getChats();

    }




}
