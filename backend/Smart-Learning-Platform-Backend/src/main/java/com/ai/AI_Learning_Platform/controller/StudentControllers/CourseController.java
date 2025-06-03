package com.ai.AI_Learning_Platform.controller.StudentControllers;

import com.ai.AI_Learning_Platform.model.Course;
import com.ai.AI_Learning_Platform.model.CourseContent;
import com.ai.AI_Learning_Platform.model.Student;
import com.ai.AI_Learning_Platform.model.User;
import com.ai.AI_Learning_Platform.repository.CourseContentRepository;
import com.ai.AI_Learning_Platform.repository.CourseRepository;
import com.ai.AI_Learning_Platform.repository.StudentRepository;
import com.ai.AI_Learning_Platform.repository.UserRepository;
import com.ai.AI_Learning_Platform.service.CourseService;
import com.ai.AI_Learning_Platform.service.GeminiService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "${frontend.uri}", allowCredentials = "true", allowedHeaders = "*")
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
    @Autowired
    private final StudentRepository studentRepository;

//    // Create Course
//    @PostMapping
//    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
//        return ResponseEntity.ok(courseService.createCourse(course));
//    }

    //using
    @PostMapping("/user/{userId}")
    public ResponseEntity<?> createCourse(@PathVariable UUID userId, @RequestBody Course course) {
        try {
            // Find user and student
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));
            Student student = studentRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("Student not found"));

            if(student.getCredits () <= 0){
                return ResponseEntity
                        .status( HttpStatus.FORBIDDEN)
                        .body("Your plan is over or limited. Please upgrade your plan.");
            }

            // Create and save course
            Course newCourse = new Course();
            newCourse.setTitle(course.getTitle());
            newCourse.setDescription(course.getDescription());
            newCourse.setLevel(course.getLevel());
            newCourse.setCreatedByAI(true);
            newCourse.setUser(user);

            // Handle contents
            if (course.getContents() != null && !course.getContents().isEmpty()) {
                List<CourseContent> contents = course.getContents().stream()
                        .map(content -> {
                            content.setCourse(newCourse); // Set bidirectional relationship
                            return content;
                        })
                        .collect(Collectors.toList());
                newCourse.setContents(contents);
            }

            // Save course (contents will be saved due to cascade)
            Course savedCourse = courseRepository.save(newCourse);

            // Update student's courses list
            if (student.getCourses() == null) {
                student.setCourses(new ArrayList<>());
            }
            student.getCourses().add(savedCourse);
            studentRepository.save(student);

            return ResponseEntity.ok(savedCourse);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to create course", "details", e.getMessage()));
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