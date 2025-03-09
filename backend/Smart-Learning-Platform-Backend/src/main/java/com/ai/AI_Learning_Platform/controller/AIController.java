package com.ai.AI_Learning_Platform.controller;

import com.ai.AI_Learning_Platform.model.*;
import com.ai.AI_Learning_Platform.repository.CourseRepository;
import com.ai.AI_Learning_Platform.repository.UserRepository;
import com.ai.AI_Learning_Platform.service.GeminiService;
import com.ai.AI_Learning_Platform.service.QuizQuestionService;
import com.ai.AI_Learning_Platform.service.QuizService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.model.Content;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gemini")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true", allowedHeaders = "*")
public class AIController {

    @Autowired
    private final GeminiService geminiService;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final CourseRepository courseRepository;
    public AIController(GeminiService geminiService, UserRepository userRepository, CourseRepository courseRepository) {
        this.geminiService = geminiService;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

//    @GetMapping("/course")
//    public String generateCourse() {
//        return geminiService.generateContent("Generate a JSON course structure with a title, description, sections, and levels. Follow this format(give all these params and big content: { \\\\\\\"title\\\\\\\": \\\\\\\"Course Title\\\\\\\", \\\\\\\"description\\\\\\\": \\\\\\\"Brief overview\\\\\\\", \\\\\\\"contents\\\\\\\": [{\\\\\\\"id\\\\\\\": 1, \\\\\\\"sectionTitle\\\\\\\": \\\\\\\"Intro\\\\\\\", \\\\\\\"body\\\\\\\": \\\\\\\"Content here...\\\\\\\"}], \\\\\\\"level\\\\\\\": \\\\\\\"Beginner\\\\\\\", \\\\\\\"createdByAI\\\\\\\": true } ");
//    }
@PostMapping("/course/user/{userId}")
public ResponseEntity<?> generateAndSaveCourse(@PathVariable Long userId) {
    try {
        // 🔍 Fetch the user from the database
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || user.getMainInterest() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found or interest missing"));
        }

        // 💡 Generate course JSON from AI based on user's main interest
        String prompt = "Generate a detailed JSON course structure based on the user's interest: " + user.getMainInterest() +
                ". Format: { \"title\": \"Course Title\", \"description\": \"Brief overview\", " +
                "\"contents\": [{ \"sectionTitle\": \"Intro\", \"body\": \"Content here...\" }], " +
                "\"level\": \"Beginner\", \"createdByAI\": true }.";

        String aiResponse = geminiService.generateContent(prompt);
        System.out.println("AI Response: " + aiResponse); // Debugging log

        // 🛠 Parse the AI-generated JSON to Course object
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false); // Ignore unknown fields
        JsonNode jsonNode = objectMapper.readTree(aiResponse);

        // 📝 Create a new Course object
        Course course = new Course();
        course.setTitle(jsonNode.get("title").asText());
        course.setDescription(jsonNode.get("description").asText());
        course.setLevel(jsonNode.get("level").asText());
        course.setCreatedByAI(jsonNode.get("createdByAI").asBoolean());
        course.setUser(user); // Set the associated user

        // 📚 Parse CourseContents from AI response
        List<CourseContent> contents = new ArrayList<>();
        JsonNode contentsNode = jsonNode.get("contents");
        if (contentsNode != null && contentsNode.isArray()) {
            for (JsonNode contentNode : contentsNode) {
                CourseContent content = new CourseContent();
                content.setSectionTitle(contentNode.get("sectionTitle").asText());
                content.setBody(contentNode.get("body").asText());
                content.setCourse(course); // Establish relationship with course
                contents.add(content);
            }
        }
        course.setContents(contents); // Set parsed contents to the course

        // 💾 Save course and associated contents to the database
        Course savedCourse = courseRepository.save(course);
        return ResponseEntity.ok(savedCourse);

    } catch (Exception e) {
        e.printStackTrace(); // Debugging log
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred", "details", e.getMessage()));
    }
}




    @GetMapping("/course/user/{userId}")
    public String generateCourse(@PathVariable Long userId) {
        try {
            // Fetch user from DB
            User user = userRepository.findById(userId).orElse(null);
            if (user == null || user.getMainInterest() == null) {
                return "{\"error\": \"User not found or main interest is missing\"}";
            }

            // Properly escape the JSON format
            String prompt = "Generate a JSON course structure based on the user's interest: " + user.getMainInterest() +
                    ". Follow this exact JSON format: { \\\"title\\\": \\\"Course Title\\\", \\\"description\\\": \\\"Brief overview\\\", " +
                    "\\\"contents\\\": [{ \\\"sectionTitle\\\": \\\"Intro\\\", \\\"body\\\": \\\"Content here...\\\" }], " +
                    "\\\"level\\\": \\\"Beginner\\\", \\\"createdByAI\\\": true } keep section body a little big!! .";

            // Call Gemini API
            String aiResponse = geminiService.generateContent(prompt);

            // Validate if response is valid JSON
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.readTree(aiResponse); // If invalid, will throw an exception

            return aiResponse;

        } catch (Exception e) {
            return "{\"error\": \"An unexpected error occurred\"}";
        }
    }

    @Autowired
    private QuizQuestionService quizQuestionService;

    // 🔍 Generate a dynamic quiz question based on the course name and difficulty
//    @GetMapping("/question/{courseTitle}/{difficulty}")
//    public QuizQuestion generateQuestion(@PathVariable String courseTitle, @PathVariable String difficulty) {
//        return quizQuestionService.generateAndSaveQuestion(courseTitle, difficulty);
//    }

    // 📚 Get a list of quiz questions by course title and difficulty
    @GetMapping("/questions/{courseTitle}/{difficulty}")
    public List<QuizQuestion> getQuestionsByCourse(@PathVariable String courseTitle, @PathVariable String difficulty) {
        return quizQuestionService.getQuizQuestionsByCourseAndDifficulty(courseTitle, difficulty);
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

    @GetMapping("/question/{course}")
    public String generateQuestion(@PathVariable String course) {
        return geminiService.generateContent("Generate a multiple-choice question in JSON format. for this course "+course + " give me unique question everytime" +
                "and format should be like this " +
                "{ question: What is the capital of France?" +
                "    options: [Paris, London, Berlin, Madrid]" +
                "    answer: Paris" +
                "    explanation:blah blah blah"+
                "    difficulty:easy (easy or hard)"+
                "  }"
        );
    }

    @GetMapping("/question/{course}/{difficulty}")
    public String generateQuestion(@PathVariable String course,@PathVariable String difficulty) {
        return geminiService.generateContent("Generate a multiple-choice question in JSON format. for this course "+course + " give me unique question everytime" +
                "and format should be like this " +
                "{ question: What is the capital of France?" +
                "    options: [Paris, London, Berlin, Madrid]" +
                "    answer: Paris" +
                "    explanation:blah blah blah"+
                "    difficulty:easy (easy or hard)"+
                "  }"+
                "Set difficulty as " + difficulty
        );
    }

    @GetMapping("/chatbot/{prompt}")
    public  String generateChat(@PathVariable String prompt){

        String context = "This is a chatbot for my AI based learning system now in JSON format {reply:} give reply to this prompt  ";

        return  geminiService.generateContent(context+prompt.replaceAll(" ", "-"));
    }

    @GetMapping("/roadmap")
    public String generateRoadmap(){
        String format = "{roadmaps:[{title:Full Stack Developer,description:Learn frontend, backend, and database technologies.,steps:[{name:Step 1: Learn HTML & CSS,details:Understand HTML structure and CSS styling techniques.,topics:[HTML5,CSS3,Flexbox,Grid,Responsive Design],prerequisites:[],substeps:[Understand semantic HTML elements,Master CSS box model and positioning,Work with Flexbox and CSS Grid,Create responsive layouts using media queries]},{name:Step 2: JavaScript Basics,details:Learn JavaScript fundamentals for interactive web applications.,topics:[ES6+,DOM Manipulation,Event Handling],prerequisites:[HTML & CSS],substeps:[Learn ES6+ syntax (let, const, arrow functions),Understand DOM manipulation and events,Work with asynchronous JavaScript (Promises, async/await)]}]},{title:Machine Learning Engineer,description:Master machine learning concepts and AI development.,steps:[{name:Step 1: Learn Python,details:Understand Python syntax and libraries for data science.,topics:[Python Basics,Numpy,Pandas],prerequisites:[],substeps:[Learn Python syntax and data structures,Work with Numpy for numerical computations,Use Pandas for data manipulation]},{name:Step 2: Machine Learning Basics,details:Understand fundamental ML concepts and algorithms.,topics:[Supervised Learning,Unsupervised Learning,Neural Networks],prerequisites:[Python],substeps:[Learn Linear Regression and Decision Trees,Understand K-Means Clustering and PCA,Work with neural networks in TensorFlow/PyTorch]}]}]}";
        String context = "For AI based learning system project generate a roadmap of different courses in this json format  " +
                format +
                " , reply strictly following this json format give only roadmap value ";

        return geminiService.generateContent(context);
    }

    @PostMapping("/generate")
    public String generateContent(@RequestBody PromptRequest request) {
        return geminiService.generateContent(request.getPrompt());
    }
}
