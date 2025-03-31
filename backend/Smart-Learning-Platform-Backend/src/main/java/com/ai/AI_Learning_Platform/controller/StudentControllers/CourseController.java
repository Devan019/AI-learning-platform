package com.ai.AI_Learning_Platform.controller.StudentControllers;

import com.ai.AI_Learning_Platform.model.Course;
import com.ai.AI_Learning_Platform.model.CourseContent;
import com.ai.AI_Learning_Platform.model.User;
import com.ai.AI_Learning_Platform.repository.CourseContentRepository;
import com.ai.AI_Learning_Platform.repository.CourseRepository;
import com.ai.AI_Learning_Platform.repository.UserRepository;
import com.ai.AI_Learning_Platform.service.CourseService;
import com.ai.AI_Learning_Platform.service.GeminiService;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true", allowedHeaders = "*")
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

    //using
    @PostMapping("/user/{userId}")
    public ResponseEntity<?> createCourse(@PathVariable UUID userId, @RequestBody Course course) {
        try {
            System.out.println("in create");

            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }

            System.out.println("before course");
            Course course2 = new Course();
            course2.setTitle(course.getTitle());
            course2.setDescription(course.getDescription());
            course2.setLevel(course.getLevel());
            course2.setCreatedByAI(true);
            course2.setUser(user);

            // Save `course2` first
            Course savedCourse = courseRepository.save(course2);

            // Assign saved course to each content and save
            List<CourseContent> updatedContents = course.getContents().stream().map(content -> {
                content.setCourse(savedCourse);
                return content;
            }).collect(Collectors.toList());

            List<CourseContent> savedContents = courseContentRepository.saveAll(updatedContents);

            // Add contents to `savedCourse` and update it
            savedCourse.setContents(savedContents);
            courseRepository.save(savedCourse); // Update the course with its contents

            System.out.println("saved users");

            return ResponseEntity.ok(savedCourse);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to create course", "details", e.getMessage()));
        }
    }


    // Get Course by ID
    //using
    @GetMapping("/{id}")
    public ResponseEntity<Optional<Course>> getCourseById(@PathVariable UUID id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    //using
    @GetMapping("/user/{userId}")
    public List<Course> getCoursesByUserId(@PathVariable UUID userId) {
        return courseService.getCoursesByUserId(userId);
    }


    // ✅ Update Course (with optional user update)
    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable UUID id, @RequestParam(required = false) UUID userId, @RequestBody Course updatedCourse) {
        return ResponseEntity.ok(courseService.updateCourse(id, userId, updatedCourse));
    }

    // Delete Course
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable UUID id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }
}