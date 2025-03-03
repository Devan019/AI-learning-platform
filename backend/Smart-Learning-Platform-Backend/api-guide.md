# API Documentation - AI Learning Platform

## Courses API

### 1. Get All Courses
**Endpoint:** `GET /api/courses`

**Response:**
```json
[
  {
    "id": "4cefe053-5c8b-4456-b069-e33ab51609b2",
    "title": "AI Basics",
    "description": "Introduction to AI concepts",
    "contents": [
      {
        "id": 1,
        "sectionTitle": "Introduction to AI",
        "body": "This section introduces the fundamentals of AI..."
      },
      {
        "id": 2,
        "sectionTitle": "AI Applications",
        "body": "AI is used in various domains such as healthcare, finance..."
      }
    ],
    "level": "Beginner",
    "createdByAI": true
  }
]
```

### 2. Create a New Course
**Endpoint:** `POST /api/courses`

**Request Body:**
```json
{
  "title": "Deep Learning Fundamentals",
  "description": "Covers deep learning concepts including neural networks and optimization.",
  "contents": [
    {
      "id": 1,
      "sectionTitle": "Introduction to Deep Learning",
      "body": "Deep Learning is a subset of ML focused on neural networks..."
    },
    {
      "id": 2,
      "sectionTitle": "Neural Networks",
      "body": "Artificial Neural Networks (ANNs) consist of input, hidden, and output layers..."
    }
  ],
  "level": "Intermediate",
  "createdByAI": false
}
```

### 3. Update a Course
**Endpoint:** `PUT /api/courses/{id}`

**Request Body:**
```json
{
  "title": "Updated Deep Learning Fundamentals",
  "description": "Updated content with additional topics on CNNs and RNNs",
  "contents": [
    {
      "id": 1,
      "sectionTitle": "Introduction to Deep Learning",
      "body": "Deep Learning enables AI models to learn from vast amounts of data..."
    },
    {
      "id": 2,
      "sectionTitle": "Convolutional Neural Networks (CNNs)",
      "body": "CNNs are designed for image processing tasks and consist of convolutional layers..."
    }
  ],
  "level": "Advanced",
  "createdByAI": true
}
```

### 4. Delete a Course
**Endpoint:** `DELETE /api/courses/{id}`

---

## Quizzes API


### 1. Create a Quiz
**Endpoint:** `POST /api/quizzes`

**Request Body:**
```json
{
  "title": "AI Basics Quiz",
  "courseId": "4cefe053-5c8b-4456-b069-e33ab51609b2",
  "difficulty": "Easy"
}
```

### 2. Get All Quizzes

**Endpoint:** `GET /api/quizzes`

**Response:**
```json
[
  {
    "id": "f8e24fed-1712-4238-bdd5-22941316d100",
    "title": "AI Basics Quiz",
    "courseId": "4cefe053-5c8b-4456-b069-e33ab51609b2",
    "difficulty": "Easy"
  }
]
```


### 3. Get a Quiz by ID
**Endpoint:** `GET /api/quizzes/{id}`

**Response**
```json
{
    "id": "60e2e386-0a71-4f2d-8300-1e245a907d5a",
    "title": "Deep learning Quiz",
    "courseId": "06bfcb70-7650-4027-92f0-8ea2638a1a14",
    "difficulty": "Easy"
}
```

### 4. Delete a Quiz
**Endpoint:** `DELETE /api/quizzes/{id}`

---

## Questions API


### 1. Create a Question
**Endpoint:** `POST /api/questions`

**Request Body:**
```json
{
  "quizId": "f8e24fed-1712-4238-bdd5-22941316d100",
  "questionText": "What is AI?",
  "option1": "Artificial Intelligence",
  "option2": "Automated Input",
  "option3": "Advanced Information",
  "option4": "None of the above",
  "correctAnswer": "Artificial Intelligence"
}
```

### 2. Get Questions by Quiz ID
**Endpoint:** `GET /api/questions/{quizId}`

**Response:**
```json
[
  {
    "id": "3f3c84ef-fcd9-4815-ab2d-a4deb481b6aa",
    "quiz": {
      "id": "f8e24fed-1712-4238-bdd5-22941316d100",
      "title": "AI Basics Quiz",
      "courseId": "4cefe053-5c8b-4456-b069-e33ab51609b2",
      "difficulty": "Easy"
    },
    "questionText": "What is AI?",
    "option1": "Artificial Intelligence",
    "option2": "Automated Input",
    "option3": "Analytical Interpretation",
    "option4": "None of the above",
    "correctAnswer": "Artificial Intelligence"
  }
]
```


### 3. Delete a Question
**Endpoint:** `DELETE /api/questions/{id}`
