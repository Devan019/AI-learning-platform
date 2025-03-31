package com.ai.AI_Learning_Platform.service;


import com.ai.AI_Learning_Platform.model.*;
import com.ai.AI_Learning_Platform.repository.StudentRepository;
import com.ai.AI_Learning_Platform.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

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

    public Student createNewUser(Student student){
        student.setPassword(bCryptPasswordEncoder.encode(student.getPassword()));
        return studentRepository.save(student);
    }

    public Student updateUser(Student student){
        System.out.println("id is " + student.getId() + " email is" + student.getEmail());

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
        student2.setPhone(student.getPhone());

        studentRepository.save(student2);
        return student2;
    }

    public Student saveUser(Student student) {

        User user1 = userRepository.findByEmail(student.getEmail());
        if(user1 != null){
            System.out.println("user exit" + user1);
            return null;
        }

        System.out.println("saved " + student);
        student.setPassword(bCryptPasswordEncoder.encode(student.getPassword()));
        student.setRole(Role.STUDENT);
        return userRepository.save(student);
    }

    public User isVaildUser(User user, HttpSession httpSession){
        System.out.println("Checking email: " + user.getEmail() + " role is " + user.getRole());

        User user1 = userRepository.findByEmail(user.getEmail().trim());

        if(user.getRole() != Role.STUDENT || user1 == null)   throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found");
        System.out.println("all done");
        if(!bCryptPasswordEncoder.matches(user.getPassword(), user1.getPassword()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found ");

        System.out.println("password match");

        Object obj = httpSession.getAttribute("user");
        if(obj != null){
            httpSession.removeAttribute("user");
        }

        httpSession.setAttribute("user", user1);
        return  user1;
    }

    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }

    public UUID createToken(String email){
        User user1 = null;
        List<User> users = userRepository.findAll();
        for (var checkUser: users){
            if(email.trim().equals(checkUser.getEmail().trim())){
                user1 = checkUser;
                break;
            }
        }

        if(user1 == null) return null;

       UUID resetToken = UUID.randomUUID();

        user1.setResetToken(resetToken);

        User savedUser = userRepository.save(user1);
        return savedUser.getResetToken();
    }

    public String getEmailByResetToken(UUID resetToken){
        User user = userRepository.findByResetToken(resetToken);
        if (user == null) return null;
        return user.getEmail();
    }

    public User changePassword(User userInfo){
        System.out.println(userInfo.getEmail() + " " + userInfo.getResetToken() + " " + "set");
        User user1 = null;
        List<User> users = userRepository.findAll();
        for (var checkUser: users){
            if(userInfo.getEmail().trim().equals(checkUser.getEmail().trim())){
                user1 = checkUser;
                break;
            }
        }


        if(user1 == null) return null;
        System.out.println("user found");

        if(!user1.getResetToken().equals(userInfo.getResetToken())) return  null;
        System.out.println("code getit");
        user1.setPassword(bCryptPasswordEncoder.encode(userInfo.getPassword()));
        user1.setResetToken(null);
        return userRepository.save(user1);
    }
    private Date calculateRenewDate(int daysToAdd) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        calendar.add(Calendar.DATE, daysToAdd);
        return calendar.getTime();
    }

    public Student makeOrder(Student student){
        student.setPayment_date( new Date());

        // Set renew date based on subscription type
        if (student.getSubscription() == SUBSCRIPTION.MONTHLY) {
            student.setRenew_date(calculateRenewDate(30)); // 30 days for monthly
        } else if (student.getSubscription() == SUBSCRIPTION.YEARLY) {
            student.setRenew_date(calculateRenewDate(365)); // 365 days for yearly
        }

        return studentRepository.save(student);
    }

    public Student getStudent(UUID uuid){
        Optional<Student> student =  studentRepository.findById(uuid);
        if (student.isEmpty()) return  null;
        return  student.get();
    }

    public Student setRenew(UUID uuid){
        Optional<Student> student = studentRepository.findById(uuid);
        if( student.isEmpty()) return null;
        Student student1 = student.get();
        student1.setRenew_date(null);
        student1.setPayment_date(null);
        student1.setOrder_id(null);
        return  studentRepository.save(student1);
    }

    public Student getUserByEmail(String email){
        System.out.println("email is " + email);
        return studentRepository.findByEmail(email);
    }


}