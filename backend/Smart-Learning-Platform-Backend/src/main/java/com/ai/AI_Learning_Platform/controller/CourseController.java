package com.ai.AI_Learning_Platform.controller;

import com.ai.AI_Learning_Platform.model.Course;
import com.ai.AI_Learning_Platform.model.User;
import com.ai.AI_Learning_Platform.repository.CourseContentRepository;
import com.ai.AI_Learning_Platform.repository.CourseRepository;
import com.ai.AI_Learning_Platform.repository.UserRepository;
import com.ai.AI_Learning_Platform.service.CourseService;
import com.ai.AI_Learning_Platform.service.GeminiService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(value = "*")
@RequiredArgsConstructor
@ToString
public class CourseController {
    @Autowired
    private final CourseService courseService;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final GeminiService geminiService;
    @Autowired
    private final CourseRepository courseRepository;
    @Autowired
    private final CourseContentRepository courseContentRepository;

//    // Create Course
//    @PostMapping
//    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
//        return ResponseEntity.ok(courseService.createCourse(course));
//    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<?> createCourse(@PathVariable Long userId, @RequestBody Course course) {
        try {
            System.out.println("in crete ");
            // Fetch user from DB
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }

            // Set user to the course and save
//            course.setUser(user);
//            Course savedCourse = courseService.createCourse(course, userId);
            System.out.println("before course");
            Course course2 = new Course();
            course2.setTitle(course.getTitle());
            course2.setDescription(course.getDescription());
            course2.setLevel(course.getLevel());
            course2.setCreatedByAI(true);
            course2.setUser(user);
//            course2.setContents(course.getContents());
//            courseContentRepository.saveAll(course2.getContents());
            System.out.println("saved users");

            Course savedCourse = courseRepository.save(course2);

            return ResponseEntity.ok(savedCourse);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to create course", "details", e.getMessage()));
        }
    }


    @GetMapping("/course/user/{userId}")
    public ResponseEntity<?> fetchGeneratedCourse(@PathVariable Long userId) {
        try {
            // Step 1: Fetch user from DB
            User user = userRepository.findById(userId).orElse(null);
            if (user == null || user.getMainInterest() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found or interest missing"));
            }

            // Step 2: Generate Course JSON from AI
            String prompt = "Generate a detailed JSON course structure based on the user's interest: " + user.getMainInterest() +
                    ". Format it like this: { \"title\": \"Course Title\", \"description\": \"Brief overview\", " +
                    "\"contents\": [{ \"id\": 1, \"sectionTitle\": \"Intro\", \"body\": \"Content here...\" }], " +
                    "\"level\": \"Beginner\", \"createdByAI\": true }.";

            String aiResponse = geminiService.generateContent(prompt);

            // Step 3: Convert AI Response (JSON) to Course Object
            ObjectMapper objectMapper = new ObjectMapper();
            Course aiGeneratedCourse = objectMapper.readValue(aiResponse, Course.class);

            // Step 4: Set user and save to DB
            aiGeneratedCourse.setUser(user);
            Course savedCourse = courseService.createCourse(aiGeneratedCourse, userId);

            return ResponseEntity.ok(savedCourse);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to process AI response", "details", e.getMessage()));
        }
    }


    // Get All Courses
    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    // Get Course by ID
    @GetMapping("/{id}")
    public ResponseEntity<Optional<Course>> getCourseById(@PathVariable UUID id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Course>> getCoursesByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(courseService.getCoursesByUserId(userId));
    }


    // ✅ Update Course (with optional user update)
    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable UUID id, @RequestParam(required = false) Long userId, @RequestBody Course updatedCourse) {
        return ResponseEntity.ok(courseService.updateCourse(id, userId, updatedCourse));
    }

    // Delete Course
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable UUID id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }
}