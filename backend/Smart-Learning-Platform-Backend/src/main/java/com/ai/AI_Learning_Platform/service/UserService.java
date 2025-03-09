package com.ai.AI_Learning_Platform.service;


import com.ai.AI_Learning_Platform.model.User;
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

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User updateUser(User user){
        User user1 = userRepository.findByEmail(user.getEmail());
        if(user1 == null) return null;

        user1.setEmail(user.getEmail());
        user1.setCareerGoals(user.getCareerGoals());
        user1.setDegreeProgram(user.getDegreeProgram());
        user1.setFullName(user.getFullName());
        user1.setDomainExpertise(user.getDomainExpertise());
        user1.setGpaScore(user.getGpaScore());
        user1.setMainInterest(user.getMainInterest());
        user1.setExtracurricularActivities(user.getExtracurricularActivities());
        user1.setGraduationYear(user.getGraduationYear());
        user1.setResearchInterests(user.getResearchInterests());
        user1.setTechnicalSkills(user.getTechnicalSkills());
        user1.setUniversity(user.getUniversity());

        userRepository.save(user1);
        return user1;
    }

    public User saveUser(User user) {

        User user1 = userRepository.findByEmail(user.getEmail());
        if(user1 != null){
            System.out.println("user exit" + user1);
            return null;
        }

        System.out.println(user);
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User isVaildUser(User user, HttpSession httpSession){
        System.out.println(user);
        if(userRepository.findByEmail(user.getEmail()) == null ) return null;
        User user1 = userRepository.findByEmail(user.getEmail());
        if(!bCryptPasswordEncoder.matches(user.getPassword(), user1.getPassword()))
            return null;
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(new UsernamePasswordAuthenticationToken(user1, null, new ArrayList<>()));
        SecurityContextHolder.setContext(context);
        httpSession.setAttribute("user", user1);
        System.out.println(httpSession.getAttribute("user"));
        return  user1;
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}