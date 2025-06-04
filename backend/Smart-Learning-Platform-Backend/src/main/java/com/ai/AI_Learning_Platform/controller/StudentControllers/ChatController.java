package com.ai.AI_Learning_Platform.controller.StudentControllers;

import com.ai.AI_Learning_Platform.model.Chat;
import com.ai.AI_Learning_Platform.model.ChatBot;
import com.ai.AI_Learning_Platform.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/chats")
public class ChatController {
    @Autowired
    private ChatService chatService;

    @PostMapping("/user/{userid}/{topic}/newchat")
    public Map<String, List<Chat>> createChat(@RequestBody Chat chat, @PathVariable UUID userid, @PathVariable String topic){
//        System.out.println(chat + " " + userid);
        return chatService.createNew(userid, topic);
    }

    @PostMapping("/user/{userid}/{topic}")
    public Chat createNewChat(@PathVariable UUID userid, @PathVariable String topic, @RequestBody Chat chat){
        return chatService.createChat(userid, topic, chat);
    }

    @GetMapping("/user/{userid}")
    public Map<String, List<Chat>> getChats(@PathVariable UUID userid){
        return chatService.getChats(userid);
    }

    @GetMapping("/user/{userid}/chatbot")
    public ResponseEntity<?> getBot(@PathVariable UUID userid){
        ChatBot chatBot = chatService.getChatBot(userid);
        if(chatBot == null){
            return ResponseEntity.ok(null);
        }
        return ResponseEntity.ok("ok");
    }

    @GetMapping("/user/{userid}/topics")
    public List<String> getTitles(@PathVariable UUID userid){
        return chatService.getTitles(userid);
    }

    @GetMapping("/user/{userid}/{topic}")
    public List<Chat> getChatsByTopic(@PathVariable UUID userid, @PathVariable String topic){
        return  chatService.getChatsByTopic(userid, topic);
    }

    @GetMapping("/user/{userid}/{oldName}/update")
    public List<Chat> renameTopic(@PathVariable UUID userid, @PathVariable String oldName, @RequestParam String newname){
        return  chatService.renameTopic(userid, oldName, newname);
    }

    @DeleteMapping("/user/{userid}/{topic}")
    public ResponseEntity<?> deleteChatsByTopic(@PathVariable UUID userid, @PathVariable String topic){
        return  chatService.deleteChatsNyTopic(userid, topic);
    }

}
