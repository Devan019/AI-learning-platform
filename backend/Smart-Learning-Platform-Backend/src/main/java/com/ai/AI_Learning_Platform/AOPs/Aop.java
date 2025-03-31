package com.ai.AI_Learning_Platform.AOPs;

import com.ai.AI_Learning_Platform.model.Role;
import com.ai.AI_Learning_Platform.model.Student;
import com.ai.AI_Learning_Platform.model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.server.ResponseStatusException;

import java.util.Enumeration;

@Aspect
@Component
public class Aop {

    public User getUser(){
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if (attributes != null) {
            HttpSession httpSession = attributes.getRequest().getSession(false);

            if (httpSession != null) {
                return (User) httpSession.getAttribute("user");
            }
        }
        return null;
    }

    public void isStudent(){
        User user = getUser();

        if (user!= null && user.getRole() == Role.STUDENT) {
            System.out.println("Access granted: STUDENT role confirmed.");
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Access denied: Not an STUDENT.");
        }
    }


    @Before("execution(public * com.ai.AI_Learning_Platform.controller.Admin.AdminController.*(..))")
    public void isAdmin(JoinPoint joinPoint){
        System.out.println("in admin bro: " + joinPoint.getSignature());

        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if (attributes != null) {
            HttpSession httpSession = attributes.getRequest().getSession(false);

            if (httpSession != null) {
                User user = (User) httpSession.getAttribute("user");
                System.out.println("in middle " + user);
                if (user!= null && user.getRole() == Role.ADMIN) {
                    System.out.println("Access granted: Admin role confirmed.");
                } else {
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Access denied: Not an admin.");
                }
            } else {
                System.out.println("No active session found!");

            }
        } else {
            System.out.println("No request context found!");

        }
    }

    @Before("execution(public * com.ai.AI_Learning_Platform.controller.StudentControllers.CourseController.*(..))")
    public void isStudentForCourse(){
        isStudent();
    }

    @Before("execution(public * com.ai.AI_Learning_Platform.controller.StudentControllers.AIController.*(..))")
    public void isStudentForGemini(){
        isStudent();
    }

    @Before("execution(public * com.ai.AI_Learning_Platform.controller.StudentControllers.ChatController.*(..))")
    public void isStudentForChatbot() {
        isStudent();
    }

    @Before("execution(public * com.ai.AI_Learning_Platform.controller.StudentControllers.ChatController.*(..))")
    public void isStudentForQuizController() {
        isStudent();
    }



}
