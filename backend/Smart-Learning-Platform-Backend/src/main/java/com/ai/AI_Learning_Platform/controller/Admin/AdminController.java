package com.ai.AI_Learning_Platform.controller.Admin;

import com.ai.AI_Learning_Platform.model.Admin;
import com.ai.AI_Learning_Platform.model.User;
import com.ai.AI_Learning_Platform.service.AdminService;
import com.ai.AI_Learning_Platform.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserService userService;


    @PostMapping("/getotp")
    public int getOtp(@RequestBody Admin admin){
        return adminService.GenerateOTPAndSave(admin);
    }

    @PostMapping("/checkOtp")
    public Admin checkOtp(@RequestBody  Admin admin){
        return adminService.checkOtp(admin);
    }


    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
