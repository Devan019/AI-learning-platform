package com.ai.AI_Learning_Platform.controller;

import com.ai.AI_Learning_Platform.model.Student;
import com.ai.AI_Learning_Platform.model.User;
import com.ai.AI_Learning_Platform.repository.StudentRepository;
import com.ai.AI_Learning_Platform.service.AuthService;
import com.ai.AI_Learning_Platform.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true", allowedHeaders = "*")
public class AuthController {
    @Autowired
    private AuthService authService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public List<User> getUsers(){
      return userService.getAllUsers();
    }

    //using
    @PostMapping("/signup")
    public User doSignup(@RequestBody Student student){
        return userService.saveUser(student);
    }

    //using
    @PostMapping("/login")
    public User doLogin(@RequestBody  User user, HttpSession httpSession){
        return userService.isVaildUser(user, httpSession);
    }

    //using
    @GetMapping("/user")
    public Object getCurrentUser(HttpSession httpSession){
        System.out.println("in home");
        return httpSession.getAttribute("user");
    }

    //using
    @GetMapping("/logout")
    public ResponseEntity<?> doLogout(HttpSession httpSession){
        System.out.println("in logout");
        try{
            httpSession.removeAttribute("user");
            return ResponseEntity.ok(200);
        } catch (Exception e) {
            System.out.println(e);
            return  ResponseEntity.ok(500);
        }
    }

}
