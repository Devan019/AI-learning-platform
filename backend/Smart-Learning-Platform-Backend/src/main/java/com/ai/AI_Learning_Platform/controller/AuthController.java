package com.ai.AI_Learning_Platform.controller;

import com.ai.AI_Learning_Platform.model.Admin;
import com.ai.AI_Learning_Platform.model.Student;
import com.ai.AI_Learning_Platform.model.User;
import com.ai.AI_Learning_Platform.repository.StudentRepository;
import com.ai.AI_Learning_Platform.service.AdminService;
import com.ai.AI_Learning_Platform.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api/auth")
//@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true", allowedHeaders = "*")
public class AuthController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private AdminService adminService;

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
    @Transactional
    public Object getCurrentUser(HttpSession httpSession){
        System.out.println("Session ID: " + httpSession.getId());
        return httpSession.getAttribute("user");
    }

    //using
    @GetMapping("/logout")
    public ResponseEntity<?> doLogout(HttpSession httpSession){
//        System.out.println("in logout");
        try{
            httpSession.removeAttribute("user");
            return ResponseEntity.ok(200);
        } catch (Exception e) {
//            System.out.println(e);
            return  ResponseEntity.ok(500);
        }
    }

    @GetMapping("/resetToken/{email}")
    public UUID getToken(@PathVariable String email){
        return userService.createToken(email);
    }

    @GetMapping("/resetToken/email/{resetToken}")
    public String getEmail(@PathVariable UUID resetToken){
        return userService.getEmailByResetToken(resetToken);
    }


    @PostMapping("/changePassword")
    public User changePassword(@RequestBody User user){
        return userService.changePassword(user);
    }

    @PostMapping("/admin/login")
    public User loginAsAdmin(@RequestBody User admin, HttpSession session){
        return adminService.loginAsAdmin(admin, session);
    }

    @PostMapping("/saveAdmin")
    public Admin saveUser(@RequestBody Admin admin){
        return adminService.saveAdmin(admin);
    }


}
