package com.ai.AI_Learning_Platform.controller.StudentControllers;

import com.ai.AI_Learning_Platform.model.Student;
import com.ai.AI_Learning_Platform.model.User;
import com.ai.AI_Learning_Platform.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true", allowedHeaders = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable UUID id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/email/{email}")
    public Student getUserByEmail(@PathVariable String email){
        return userService.getUserByEmail(email);
    }

    @PostMapping("/create")
    public Student createUser(@RequestBody Student student){
        return userService.createNewUser(student);
    }

    @PostMapping
    public Student updateUser(@RequestBody Student user) {
        return userService.updateUser(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateUser(@PathVariable UUID id, @RequestBody Student updatedUser) {
        User existingUser = userService.getUserById(id);
        if (existingUser == null) {
            return ResponseEntity.notFound().build();
        }

        updatedUser.setId(id);
        return ResponseEntity.ok(userService.saveUser(updatedUser));
    }



    @PostMapping("/makeOrder")
    public Student makeOrder(@RequestBody Student student){
        System.out.println(student  + " " + student.getEmail() + " " + student.getOrder_id());
        return userService.makeOrder(student);
    }

    @GetMapping("/student/{userid}")
    public Student getstudent(@PathVariable UUID userid){
        return userService.getStudent(userid);
    }

    @GetMapping("/renew/{userid}")
    public Student renewStudent(@PathVariable UUID userid){
        return  userService.setRenew(userid);
    }


}