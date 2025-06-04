package com.ai.AI_Learning_Platform.controller.StudentControllers;

import com.ai.AI_Learning_Platform.model.*;
import com.ai.AI_Learning_Platform.repository.CourseRepository;
import com.ai.AI_Learning_Platform.repository.StudentRepository;
import com.ai.AI_Learning_Platform.repository.UserRepository;
import com.ai.AI_Learning_Platform.service.GeminiService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@Getter
@Setter
@RequiredArgsConstructor

@ToString
class GenCourse {
    private String courseName;
    private String courseLevel;
}

@RestController
@RequestMapping("/api/gemini")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true", allowedHeaders = "*")
public class AIController {

    @Autowired
    private final GeminiService geminiService;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final StudentRepository studentRepository;
    @Autowired
    private final CourseRepository courseRepository;

    public AIController(GeminiService geminiService, UserRepository userRepository, StudentRepository studentRepository, CourseRepository courseRepository) {
        this.geminiService = geminiService;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }


    //using
    @PostMapping("/course/user/{userId}")
    public ResponseEntity<?> generateCourse(@PathVariable UUID userId, @RequestBody GenCourse genCourse) {
        try {
            // Fetch student from DB
            Optional<Student> studentOptional = studentRepository.findById(userId);
            if (studentOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("{\"error\": \"User not found\"}");
            }

            Student student = studentOptional.get();

            // Check credits
            if (student.getCredits() <= 0) {
                return ResponseEntity.badRequest().body("{\"error\": \"Insufficient credits\"}");
            }

            // Generate prompt for AI
            String prompt = "Generate a JSON course structure based on the user's interest " + genCourse.getCourseName() +
                    " and course level should be " + genCourse.getCourseLevel() +
                    ". Follow this exact JSON format: { \\\"title\\\": \\\"Course Title\\\", \\\"description\\\": \\\"Brief overview\\\", " +
                    "\\\"contents\\\": [{ \\\"sectionTitle\\\": \\\"Intro\\\", \\\"body\\\": \\\"Content here...\\\" }], " +
                    "\\\"level\\\": \\\"" + genCourse.getCourseLevel() + "\\\", \\\"createdByAI\\\": true } keep section body a little big!!";

            // Call Gemini API
            String aiResponse = geminiService.generateContent(prompt);
            String cleanedText = aiResponse.replaceAll("```json|```", "").trim();
            System.out.println ( cleanedText );
            JSONObject courseJson = new JSONObject(cleanedText);

            // Create and save Course entity
            Course newCourse = new Course();
            newCourse.setTitle(courseJson.getString("title"));
            newCourse.setDescription(courseJson.getString("description"));
            newCourse.setLevel(courseJson.getString("level"));
            newCourse.setCreatedByAI(true);
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));
            newCourse.setUser(user); // Assuming Student has a User reference

            // Process contents
            if (courseJson.has("contents")) {
                JSONArray contentsJson = courseJson.getJSONArray("contents");
                List<CourseContent> contents = new ArrayList<>();

                for (int i = 0; i < contentsJson.length(); i++) {
                    JSONObject contentJson = contentsJson.getJSONObject(i);
                    CourseContent content = new CourseContent();
                    content.setSectionTitle(contentJson.getString("sectionTitle"));
                    content.setBody(contentJson.getString("body"));
                    content.setCourse(newCourse); // Set bidirectional relationship
                    contents.add(content);
                }
                newCourse.setContents(contents);
            }

            // Update student credits and course count
            student.setCredits(student.getCredits() - 10);
            student.setNoOfGeneratedCourses(student.getNoOfGeneratedCourses() + 1);

            // Save everything
            Course savedCourse = courseRepository.save(newCourse);
            System.out.println ( savedCourse );
            studentRepository.save(student);

            return ResponseEntity.ok(savedCourse);

        } catch ( JSONException e) {
            return ResponseEntity.badRequest().body("{\"error\": \"Invalid JSON response from AI\"}");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"error\": \"An unexpected error occurred\"}");
        }
    }




    @GetMapping("/quiz")
    public String generateQuiz() {
        return geminiService.generateContent("Generate a quiz in JSON format.");
    }

    @GetMapping("/question")
    public String generateQuestion() {
        return geminiService.generateContent("Generate a multiple-choice question in JSON format. for this course ");
    }

    // WE are using

    //using
    @GetMapping("/question/{course}/{difficulty}")
    public String generateQuestion(@PathVariable String course, @PathVariable String difficulty) {
        System.out.println (course + " " + difficulty );
        String quiz =  geminiService.generateContent("Generate a multiple-choice question in JSON format. for this course " + course + " give me unique question everytime" +
                "and format should be like this " +
                "{ question: What is the capital of France?" +
                "    options: [Paris, London, Berlin, Madrid]" +
                "    answer: Paris" +
                "    explanation:blah blah blah" +
                "    difficulty:easy (easy or hard)" +
                "  }" +
                "Set difficulty as " + difficulty
        );
        System.out.println (quiz );
        return quiz;
    }


    //using
    @GetMapping("/chatbot/{prompt}")
    public String generateChat(@PathVariable String prompt) {

        String context = "This is a chatbot for my AI based learning system now in JSON format {reply:} give reply to this prompt  ";

        return geminiService.generateContent(context + prompt.replaceAll(" ", "-"));
    }


}
