package com.ai.AI_Learning_Platform.controller;

import com.ai.AI_Learning_Platform.model.Admin;
import com.ai.AI_Learning_Platform.model.User;
import com.ai.AI_Learning_Platform.service.AdminService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public User loginAsAdmin(@RequestBody User admin, HttpSession session){
        return adminService.loginAsAdmin(admin, session);
    }

    @PostMapping("/getotp")
    public int getOtp(@RequestBody Admin admin){
        return adminService.GenerateOTPAndSave(admin);
    }

    @PostMapping("/checkOtp")
    public Admin checkOtp(@RequestBody  Admin admin){
        return adminService.checkOtp(admin);
    }

    @PostMapping("/saveAdmin")
    public Admin saveUser(@RequestBody Admin admin){
        return adminService.saveAdmin(admin);
    }
}
