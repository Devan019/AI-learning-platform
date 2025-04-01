# Team

1. Devan Chauhan - [GitHub](https://github.com/Devan019)
2. Hasan Ravda - [GitHub](https://github.com/hasanravda)
3. Chintan Bhutiya - [GitHub](https://github.com/chintanbhai)
4. Soneirsinh Jadeja - [GitHub](https://github.com/SoneirsinhJadeja)

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

## Backend APIs

The backend of the AI Learning Platform provides a variety of APIs to manage users, courses, quizzes, questions, chats, emails, and authentication. Below is a detailed list of the available endpoints:

### User APIs

- **Get All Users**
  - **URL:** `/api/users`
  - **Method:** `GET`

- **Get User by ID**
  - **URL:** `/api/users/{id}`
  - **Method:** `GET`

- **Get User by Email**
  - **URL:** `/api/users/email/{email}`
  - **Method:** `GET`

- **Create User**
  - **URL:** `/api/users/create`
  - **Method:** `POST`

- **Update User**
  - **URL:** `/api/users/{id}`
  - **Method:** `PUT`

- **Renew Student**
  - **URL:** `/api/users/renew/{userid}`
  - **Method:** `GET`

### Course APIs

- **Create Course for User**
  - **URL:** `/api/courses/user/{userId}`
  - **Method:** `POST`

- **Get Course by ID**
  - **URL:** `/api/courses/{id}`
  - **Method:** `GET`

- **Get Courses by User ID**
  - **URL:** `/api/courses/user/{userId}`
  - **Method:** `GET`

- **Update Course**
  - **URL:** `/api/courses/{id}`
  - **Method:** `PUT`

- **Delete Course**
  - **URL:** `/api/courses/{id}`
  - **Method:** `DELETE`

### Quiz APIs

- **Save Quiz Report**
  - **URL:** `/api/quizzes/{course_id}`
  - **Method:** `POST`

- **Get Quiz Reports**
  - **URL:** `/api/quizzes/{course_id}`
  - **Method:** `GET`

### Chat APIs

- **Create New Chat**
  - **URL:** `/api/chats/user/{userid}/{topic}/newchat`
  - **Method:** `POST`

- **Get Chats by User**
  - **URL:** `/api/chats/user/{userid}`
  - **Method:** `GET`

- **Get Chats by Topic**
  - **URL:** `/api/chats/user/{userid}/{topic}`
  - **Method:** `GET`

- **Rename Chat Topic**
  - **URL:** `/api/chats/user/{userid}/{oldName}/update`
  - **Method:** `GET`

- **Delete Chats by Topic**
  - **URL:** `/api/chats/user/{userid}/{topic}`
  - **Method:** `DELETE`

### Email APIs

- **Send Email**
  - **URL:** `/api/sendMail`
  - **Method:** `POST`

- **Send Email with Attachment**
  - **URL:** `/api/sendMailWithAttachment`
  - **Method:** `POST`

### Authentication APIs

- **Sign Up**
  - **URL:** `/api/auth/signup`
  - **Method:** `POST`

- **Log In**
  - **URL:** `/api/auth/login`
  - **Method:** `POST`

- **Log Out**
  - **URL:** `/api/auth/logout`
  - **Method:** `GET`

- **Reset Password Token**
  - **URL:** `/api/auth/resetToken/{email}`
  - **Method:** `GET`

- **Change Password**
  - **URL:** `/api/auth/changePassword`
  - **Method:** `POST`

### Admin APIs

- **Generate OTP**
  - **URL:** `/api/admin/getotp`
  - **Method:** `POST`

- **Verify OTP**
  - **URL:** `/api/admin/checkOtp`
  - **Method:** `POST`

- **Get All Users**
  - **URL:** `/api/admin/users`
  - **Method:** `GET`

- **Delete User**
  - **URL:** `/api/admin/{id}`
  - **Method:** `DELETE`

### AI APIs

- **Generate Course**
  - **URL:** `/api/gemini/course/user/{userId}`
  - **Method:** `POST`

- **Generate Quiz**
  - **URL:** `/api/gemini/quiz`
  - **Method:** `GET`

- **Generate Question**
  - **URL:** `/api/gemini/question/{course}/{difficulty}`
  - **Method:** `GET`

- **Chatbot Response**
  - **URL:** `/api/gemini/chatbot/{prompt}`
  - **Method:** `GET`

## Getting Started

To get started with the AI Learning Platform, follow these steps:

1. Clone the repository.
2. Navigate to the frontend directory and run `npm install` to install dependencies.
3. Start the frontend server with `npm start`.
4. Navigate to the backend directory and run `mvn install` to install dependencies.
5. Start the backend server with `mvn spring-boot:run`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

