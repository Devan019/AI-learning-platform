package com.ai.AI_Learning_Platform.service;


import com.ai.AI_Learning_Platform.model.Role;
import com.ai.AI_Learning_Platform.model.Student;
import com.ai.AI_Learning_Platform.model.User;
import com.ai.AI_Learning_Platform.repository.StudentRepository;
import com.ai.AI_Learning_Platform.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(UUID id) {
        return userRepository.findById(id).orElse(null);
    }

    public Student updateUser(Student student){

        Optional<Student> student1 = studentRepository.findById(student.getId());

        if(student1.isEmpty()) return null;

        Student student2 = student1.get();

        student2.setEmail(student.getEmail());
        student2.setCareerGoals(student.getCareerGoals());
        student2.setDegreeProgram(student.getDegreeProgram());
        student2.setFullName(student.getFullName());
        student2.setDomainExpertise(student.getDomainExpertise());
        student2.setGpaScore(student.getGpaScore());
        student2.setMainInterest(student.getMainInterest());
        student2.setExtracurricularActivities(student.getExtracurricularActivities());
        student2.setGraduationYear(student.getGraduationYear());
        student2.setResearchInterests(student.getResearchInterests());
        student2.setTechnicalSkills(student.getTechnicalSkills());
        student2.setUniversity(student.getUniversity());

        studentRepository.save(student2);
        return student2;
    }

    public Student saveUser(Student student) {

        User user1 = userRepository.findByEmail(student.getEmail());
        if(user1 != null){
            System.out.println("user exit" + user1);
            return null;
        }

        System.out.println(student);
        student.setPassword(bCryptPasswordEncoder.encode(student.getPassword()));
        student.setRole(Role.STUDENT);
        return userRepository.save(student);
    }

    public User isVaildUser(User user, HttpSession httpSession){
        System.out.println("Checking email: " + user.getEmail());

        User user1 = userRepository.findByEmail(user.getEmail());
//        String email =  (userRepository.findAll()).get(0).getEmail();
//        System.out.println("email checking : " + email);
        System.out.println("User from DB: " + user1);
        if(user.getRole() != Role.STUDENT || user1 == null) return null;
        System.out.println("all done");
        if(!bCryptPasswordEncoder.matches(user.getPassword(), user1.getPassword()))
            return null;

        System.out.println("password match");

        httpSession.setAttribute("user", user1);
        System.out.println(httpSession.getAttribute("user"));
        return  user1;
    }

    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }
}