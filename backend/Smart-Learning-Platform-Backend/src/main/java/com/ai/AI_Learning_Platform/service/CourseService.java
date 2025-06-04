package com.ai.AI_Learning_Platform.service;

import com.ai.AI_Learning_Platform.model.Course;
import com.ai.AI_Learning_Platform.model.CourseContent;
import com.ai.AI_Learning_Platform.model.User;
import com.ai.AI_Learning_Platform.repository.CourseContentRepository;
import com.ai.AI_Learning_Platform.repository.CourseRepository;
import com.ai.AI_Learning_Platform.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
//import org.springframework.ai.chat.client.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;
    private final CourseContentRepository courseContentRepository;
    private final UserRepository userRepository;

    // Create a new course
    @Transactional
    public Course createCourse(Course course,UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

//        System.out.println("Received Course: " + course);
        course.setUser(user);
//        System.out.println("after set user");
        // Save the course first
        Course savedCourse = courseRepository.save(course);
//        System.out.println("after sve course");

        // If contents exist, associate them with the saved course
        if (course.getContents() != null) {
            for (CourseContent content : course.getContents()) {
                content.setCourse(savedCourse);

            }
            courseContentRepository.saveAll(course.getContents());
        }
//        System.out.println("done vhai");

        return savedCourse;
    }

    // Get all courses
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // Get course by ID
    public Optional<Course> getCourseById(UUID id) {
        return courseRepository.findById(id);
    }

    public List<Course> getCoursesByUserId(UUID userId) {
        return courseRepository.findByUserId(userId);
    }

    // Update a course
    public Course updateCourse(UUID id, UUID userId,Course updatedCourse) {
        return courseRepository.findById(id).map(course -> {
            if (userId != null) {
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("User not found"));
                course.setUser(user);
            }

            course.setTitle(updatedCourse.getTitle());
            course.setDescription(updatedCourse.getDescription());
            // Remove old content and add new content
            courseContentRepository.deleteAll(course.getContents());
            List<CourseContent> updatedContents = updatedCourse.getContents();
            if (updatedContents != null) {
                for (CourseContent content : updatedContents) {
                    content.setCourse(course);
                    courseContentRepository.save(content);
                }
            }

            course.setLevel(updatedCourse.getLevel());
            return courseRepository.save(course);
        }).orElseThrow(() -> new RuntimeException("Course not found"));
    }

    // Delete a course
    public void deleteCourse(UUID id) {
        courseRepository.deleteById(id);
    }
}