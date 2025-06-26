package com.ai.AI_Learning_Platform.controller.StudentControllers;

import com.ai.AI_Learning_Platform.model.Course;
import com.ai.AI_Learning_Platform.model.User;
import com.ai.AI_Learning_Platform.repository.CourseRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//id: '5',
//title: 'Computer Vision',
//description: 'AI for image recognition',
//level: 'Advanced',
//createdByAI: true,
//contents: [],
//quizzes: [
//        { id: 'q9', title: 'CV Basics Quiz', score: 81, userLevel: 'Advanced' },
//        { id: 'q10', title: 'Object Detection Quiz', score: 79, userLevel: 'Advanced' }
//        ]

@RestController
@RequestMapping("/api")
public class InsightsController {
    @Autowired
    private CourseRepository courseRepository;

    @GetMapping("/insights")
    public Object getInsights(HttpSession httpSession) {
        User user = (User) httpSession.getAttribute("user");
        if (user == null || user.getId() == null) return null;

        List<Course> courses = courseRepository.findByUserId(user.getId());
        List<Map<String, Object>> sendObject = new ArrayList<>();

        for (Course course : courses) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", course.getId());
            map.put("title", course.getTitle());
            map.put("description", course.getDescription());
            map.put("level", course.getLevel());
            map.put("quizzes", course.getQuizzes());
            sendObject.add(map);
        }

        return sendObject;
    }
}
