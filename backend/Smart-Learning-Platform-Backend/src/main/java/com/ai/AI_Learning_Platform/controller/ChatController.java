package com.ai.AI_Learning_Platform.controller;

import com.ai.AI_Learning_Platform.model.Chat;
import com.ai.AI_Learning_Platform.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chats")
public class ChatController {
    @Autowired
    private ChatService chatService;

    @PostMapping("/user/{userid}")
    public Chat createChat(@RequestBody  Chat chat, @PathVariable UUID userid){
        System.out.println(chat + " " + userid);
        return chatService.createChat(chat, userid);
    }

    @GetMapping("/user/{userid}")
    public List<Chat> getChats(@PathVariable UUID userid){
        return chatService.getChats(userid);
    }



}
