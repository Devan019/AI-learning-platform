package com.ai.AI_Learning_Platform.service;

import com.ai.AI_Learning_Platform.model.Course;
import com.ai.AI_Learning_Platform.model.Quiz;
import com.ai.AI_Learning_Platform.repository.CourseRepository;
import com.ai.AI_Learning_Platform.repository.QuizRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class QuizService {
    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private CourseRepository courseRepository;

    public Quiz saveQuizReport(Quiz quiz, UUID course_id) {
        Course course = courseRepository.findById(course_id)
                .orElseThrow(() -> new EntityNotFoundException("Course not found with id: " + course_id));

        quiz.setCourse(course);

        if (course.getQuizzes() == null) {
            course.setQuizzes(new ArrayList<>());
        }

        course.getQuizzes().add(quiz);

        Quiz savedQuiz = quizRepository.save(quiz);

        courseRepository.save(course);

        return savedQuiz;
    }

    public List<Quiz> getQuizzesReports(UUID course_id){
        Optional<Course> course = courseRepository.findById(course_id);
        if(course.isEmpty()) return null;

        return course.get().getQuizzes();
    }
}