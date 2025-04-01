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
  - **Example Request:**
    ```json
    {
      "name": "John Doe",
      "email": "john.doe@example.com"
    }
    ```

- **Update User**
  - **URL:** `/api/users/{id}`
  - **Method:** `PUT`
  - **Example Request:**
    ```json
    {
      "name": "Jane Doe",
      "email": "jane.doe@example.com"
    }
    ```

- **Renew Student**
  - **URL:** `/api/users/renew/{userid}`
  - **Method:** `GET`
  - **Example:** Not Available

### Course APIs

- **Create Course for User**
  - **URL:** `/api/courses/user/{userId}`
  - **Method:** `POST`
  - **Example Request:**
    ```json
    {
      "title": "AI Basics",
      "description": "Introduction to AI",
      "level": "Beginner",
      "contents": [
        {
          "sectionTitle": "Intro",
          "body": "Content here..."
        }
      ]
    }
    ```

- **Get Course by ID**
  - **URL:** `/api/courses/{id}`
  - **Method:** `GET`
  - **Example:** Not Available

- **Get Courses by User ID**
  - **URL:** `/api/courses/user/{userId}`
  - **Method:** `GET`
  - **Example:** Not Available

- **Update Course**
  - **URL:** `/api/courses/{id}`
  - **Method:** `PUT`
  - **Example Request:**
    ```json
    {
      "title": "Updated Course Title",
      "description": "Updated description",
      "level": "Intermediate"
    }
    ```

- **Delete Course**
  - **URL:** `/api/courses/{id}`
  - **Method:** `DELETE`
  - **Example:** Not Available

### Quiz APIs

- **Save Quiz Report**
  - **URL:** `/api/quizzes/{course_id}`
  - **Method:** `POST`
  - **Example Request:**
    ```json
    {
      "title": "AI Quiz 1",
      "questions": [
        {
          "questionText": "What is AI?",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "correctAnswer": "Option 1"
        }
      ]
    }
    ```

- **Get Quiz Reports**
  - **URL:** `/api/quizzes/{course_id}`
  - **Method:** `GET`
  - **Example:** Not Available

### Chat APIs

- **Create New Chat**
  - **URL:** `/api/chats/user/{userid}/{topic}/newchat`
  - **Method:** `POST`
  - **Example Request:**
    ```json
    {
      "message": "Hello, I need help with AI basics."
    }
    ```

- **Get Chats by User**
  - **URL:** `/api/chats/user/{userid}`
  - **Method:** `GET`
  - **Example:** Not Available

- **Get Chats by Topic**
  - **URL:** `/api/chats/user/{userid}/{topic}`
  - **Method:** `GET`
  - **Example:** Not Available

- **Rename Chat Topic**
  - **URL:** `/api/chats/user/{userid}/{oldName}/update`
  - **Method:** `GET`
  - **Example:** Not Available

- **Delete Chats by Topic**
  - **URL:** `/api/chats/user/{userid}/{topic}`
  - **Method:** `DELETE`
  - **Example:** Not Available

### Email APIs

- **Send Email**
  - **URL:** `/api/sendMail`
  - **Method:** `POST`
  - **Example Request:**
    ```json
    {
      "recipient": "user@example.com",
      "subject": "Welcome to AI Learning Platform",
      "message": "Thank you for signing up!"
    }
    ```

- **Send Email with Attachment**
  - **URL:** `/api/sendMailWithAttachment`
  - **Method:** `POST`
  - **Example:** Not Available

### Authentication APIs

- **Sign Up**
  - **URL:** `/api/auth/signup`
  - **Method:** `POST`
  - **Example Request:**
    ```json
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "password123"
    }
    ```

- **Log In**
  - **URL:** `/api/auth/login`
  - **Method:** `POST`
  - **Example Request:**
    ```json
    {
      "email": "john.doe@example.com",
      "password": "password123"
    }
    ```

- **Log Out**
  - **URL:** `/api/auth/logout`
  - **Method:** `GET`
  - **Example:** Not Available

- **Reset Password Token**
  - **URL:** `/api/auth/resetToken/{email}`
  - **Method:** `GET`
  - **Example:** Not Available

- **Change Password**
  - **URL:** `/api/auth/changePassword`
  - **Method:** `POST`
  - **Example Request:**
    ```json
    {
      "email": "john.doe@example.com",
      "newPassword": "newpassword123"
    }
    ```

### Admin APIs

- **Generate OTP**
  - **URL:** `/api/admin/getotp`
  - **Method:** `POST`
  - **Example Request:**
    ```json
    {
      "email": "admin@example.com"
    }
    ```

- **Verify OTP**
  - **URL:** `/api/admin/checkOtp`
  - **Method:** `POST`
  - **Example Request:**
    ```json
    {
      "email": "admin@example.com",
      "otp": "123456"
    }
    ```

- **Get All Users**
  - **URL:** `/api/admin/users`
  - **Method:** `GET`
  - **Example:** Not Available

- **Delete User**
  - **URL:** `/api/admin/{id}`
  - **Method:** `DELETE`
  - **Example:** Not Available

### AI APIs

- **Generate Course**
  - **URL:** `/api/gemini/course/user/{userId}`
  - **Method:** `POST`
  - **Example Request:**
    ```json
    {
      "courseName": "AI Basics",
      "courseLevel": "Beginner"
    }
    ```

- **Generate Quiz**
  - **URL:** `/api/gemini/quiz`
  - **Method:** `GET`
  - **Example:** Not Available

- **Generate Question**
  - **URL:** `/api/gemini/question/{course}/{difficulty}`
  - **Method:** `GET`
  - **Example:** Not Available

- **Chatbot Response**
  - **URL:** `/api/gemini/chatbot/{prompt}`
  - **Method:** `GET`
  - **Example:** Not Available

## Getting Started

To get started with the AI Learning Platform, follow these steps:

1. Clone the repository.
2. Navigate to the frontend directory and run `npm install` to install dependencies.
3. Start the frontend server with `npm start`.
4. Navigate to the backend directory and run `mvn install` to install dependencies.
5. Start the backend server with `mvn spring-boot:run`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

