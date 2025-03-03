# AI Learning Platform

Welcome to the AI Learning Platform! This project is designed to provide an interactive and engaging learning experience for users interested in artificial intelligence. The platform offers various courses, quizzes, and a chatbot to assist users in their learning journey.

## Description

The AI Learning Platform consists of a frontend built with React and a backend powered by Spring Boot. The platform allows users to browse courses, take quizzes, and interact with a chatbot for additional support. The backend provides APIs to manage users, courses, quizzes, and questions.

## Tech Stack

- **Frontend:** React (JSX)
- **Backend:** Spring Boot
- **Database:** MySQL
- **API Testing:** Postman

## Endpoints

### User Endpoints

- **Get All Users**
  - **URL:** `/api/users`
  - **Method:** `GET`
  - **Example Response:**
    ```json
    [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@example.com"
      }
    ]
    ```

- **Get User by ID**
  - **URL:** `/api/users/{id}`
  - **Method:** `GET`
  - **Example Response:**
    ```json
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com"
    }
    ```

- **Create User**
  - **URL:** `/api/users`
  - **Method:** `POST`
  - **Example Request:**
    ```json
    {
      "name": "Jane Doe",
      "email": "jane.doe@example.com"
    }
    ```

- **Update User**
  - **URL:** `/api/users/{id}`
  - **Method:** `PUT`
  - **Example Request:**
    ```json
    {
      "name": "Jane Smith",
      "email": "jane.smith@example.com"
    }
    ```

- **Delete User**
  - **URL:** `/api/users/{id}`
  - **Method:** `DELETE`

### Course Endpoints

- **Generate Course for User**
  - **URL:** `/api/gemini/course/user/{userId}`
  - **Method:** `POST`
  - **Example Response:**
    ```json
    {
      "title": "AI Basics",
      "description": "Introduction to AI",
      "contents": [
        {
          "id": 1,
          "sectionTitle": "Intro",
          "body": "Content here..."
        }
      ],
      "level": "Beginner",
      "createdByAI": true
    }
    ```

### Quiz Endpoints

- **Get All Quizzes**
  - **URL:** `/api/quizzes`
  - **Method:** `GET`
  - **Example Response:**
    ```json
    [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "title": "AI Quiz 1"
      }
    ]
    ```

- **Get Quiz by ID**
  - **URL:** `/api/quizzes/{id}`
  - **Method:** `GET`
  - **Example Response:**
    ```json
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "AI Quiz 1"
    }
    ```

- **Create Quiz**
  - **URL:** `/api/quizzes`
  - **Method:** `POST`
  - **Example Request:**
    ```json
    {
      "title": "AI Quiz 2"
    }
    ```

- **Delete Quiz**
  - **URL:** `/api/quizzes/{id}`
  - **Method:** `DELETE`

### Question Endpoints

- **Get Questions by Quiz ID**
  - **URL:** `/api/questions/{quizId}`
  - **Method:** `GET`
  - **Example Response:**
    ```json
    [
      {
        "id": "123e4567-e89b-12d3-a456-426614174001",
        "questionText": "What is AI?",
        "option1": "Option 1",
        "option2": "Option 2",
        "option3": "Option 3",
        "option4": "Option 4",
        "correctAnswer": "Option 1"
      }
    ]
    ```

- **Create Question**
  - **URL:** `/api/questions`
  - **Method:** `POST`
  - **Example Request:**
    ```json
    {
      "quizId": "123e4567-e89b-12d3-a456-426614174000",
      "questionText": "What is AI?",
      "option1": "Option 1",
      "option2": "Option 2",
      "option3": "Option 3",
      "option4": "Option 4",
      "correctAnswer": "Option 1"
    }
    ```

- **Delete Question**
  - **URL:** `/api/questions/{id}`
  - **Method:** `DELETE`

## Getting Started

To get started with the AI Learning Platform, follow these steps:

1. Clone the repository.
2. Navigate to the frontend directory and run `npm install` to install dependencies.
3. Start the frontend server with `npm start`.
4. Navigate to the backend directory and run `mvn install` to install dependencies.
5. Start the backend server with `mvn spring-boot:run`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
