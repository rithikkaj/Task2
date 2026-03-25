# Online Examination System - Backend

A complete Spring Boot backend for an Online Examination System with automatic evaluation and result management.

## Features

✅ **User Management**
- User registration (ADMIN and STUDENT roles)
- User profile retrieval
- Role-based user queries

✅ **Exam Management**
- Create exams (by ADMIN)
- View all exams
- Get exams by admin
- Question management for exams

✅ **Question Management**
- Add questions to exams
- Support for multiple choice questions (A, B, C, D)
- Question retrieval by exam

✅ **Exam Submission & Auto-Evaluation**
- Students can submit exam answers
- Automatic scoring (correct/incorrect)
- Unique constraint: One student can only submit one exam once
- Score calculation as percentage

✅ **Results Management**
- View student's results
- View all results for an exam
- Detailed submission information

## Technology Stack

- **Framework**: Spring Boot 4.0.4
- **Database**: MySQL 8.0
- **ORM**: JPA/Hibernate
- **Security**: Spring Security with BCrypt password encoding
- **Logging**: SLF4J with Lombok
- **Documentation**: Springdoc OpenAPI (Swagger UI)
- **Java Version**: 17

## Project Structure

```
examsystem/
├── src/main/java/com/example/examsystem/
│   ├── model/                 # JPA entities
│   │   ├── User.java
│   │   ├── UserRole.java
│   │   ├── Exam.java
│   │   ├── Question.java
│   │   ├── Submission.java
│   │   └── Answer.java
│   ├── repository/            # Data access layer
│   │   ├── UserRepository.java
│   │   ├── ExamRepository.java
│   │   ├── QuestionRepository.java
│   │   ├── SubmissionRepository.java
│   │   └── AnswerRepository.java
│   ├── service/               # Business logic
│   │   ├── UserService.java
│   │   ├── ExamService.java
│   │   ├── QuestionService.java
│   │   └── SubmissionService.java
│   ├── controller/            # REST API endpoints
│   │   ├── UserController.java
│   │   ├── ExamController.java
│   │   ├── QuestionController.java
│   │   └── SubmissionController.java
│   ├── dto/                   # Data Transfer Objects
│   │   ├── UserDTO.java
│   │   ├── UserRegisterRequest.java
│   │   ├── ExamDTO.java
│   │   ├── CreateExamRequest.java
│   │   ├── QuestionDTO.java
│   │   ├── CreateQuestionRequest.java
│   │   ├── AnswerRequest.java
│   │   ├── SubmitExamRequest.java
│   │   └── SubmissionResultDTO.java
│   ├── exception/             # Custom exceptions & handlers
│   │   ├── ResourceNotFoundException.java
│   │   ├── UnauthorizedException.java
│   │   ├── BadRequestException.java
│   │   └── GlobalExceptionHandler.java
│   ├── config/                # Configuration classes
│   │   ├── SecurityConfig.java
│   │   └── WebSecurityConfig.java
│   └── ExamsystemApplication.java
├── src/main/resources/
│   └── application.properties  # Configuration
└── pom.xml
```

## Database Setup

### Prerequisites
- MySQL 8.0 or later
- Port 3306 should be available

### Create Database

```sql
CREATE DATABASE exam_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Configure Database Connection

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/exam_system?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
```

The application will automatically create tables on startup due to `spring.jpa.hibernate.ddl-auto=update`

## Running the Application

### Build the Project

```bash
cd examsystem
mvn clean install
```

### Run the Application

```bash
mvn spring-boot:run
```

Or using Java directly:

```bash
java -jar target/examsystem-0.0.1-SNAPSHOT.jar
```

The application will start on **http://localhost:8080**

## API Endpoints

### 1. User Management

#### Register User
```http
POST /api/users/register
Content-Type: application/json

{
    "email": "student@example.com",
    "name": "John Doe",
    "password": "password123",
    "role": "STUDENT"
}
```

**Response:**
```json
{
    "id": 1,
    "email": "student@example.com",
    "name": "John Doe",
    "role": "STUDENT",
    "createdAt": 1234567890000
}
```

#### Get All Students
```http
GET /api/users/role/student
```

#### Get All Admins
```http
GET /api/users/role/admin
```

#### Get User by ID
```http
GET /api/users/{id}
```

#### Get User by Email
```http
GET /api/users/email/{email}
```

### 2. Exam Management

#### Create Exam (Admin only)
```http
POST /api/exams
Content-Type: application/json
X-User-Id: 1

{
    "title": "Java Fundamentals",
    "description": "Basic Java concepts",
    "duration": 60
}
```

**Response:**
```json
{
    "id": 1,
    "title": "Java Fundamentals",
    "description": "Basic Java concepts",
    "duration": 60,
    "totalQuestions": 0,
    "createdBy": "Admin Name",
    "createdAt": 1234567890000
}
```

#### Get All Exams
```http
GET /api/exams
```

#### Get Exam by ID
```http
GET /api/exams/{id}
```

#### Get Exams by Admin
```http
GET /api/exams/admin/{adminId}
```

### 3. Question Management

#### Add Question to Exam
```http
POST /api/questions
Content-Type: application/json
X-User-Id: 1

{
    "questionText": "What is Java?",
    "optionA": "A programming language",
    "optionB": "A coffee brand",
    "optionC": "An island",
    "optionD": "All of the above",
    "correctAnswer": "A",
    "examId": 1
}
```

**Response:**
```json
{
    "id": 1,
    "questionText": "What is Java?",
    "optionA": "A programming language",
    "optionB": "A coffee brand",
    "optionC": "An island",
    "optionD": "All of the above",
    "correctAnswer": "A",
    "examId": 1
}
```

#### Get Questions by Exam
```http
GET /api/questions/exam/{examId}
```

#### Get Question by ID
```http
GET /api/questions/{id}
```

### 4. Exam Submission & Results

#### Submit Exam
```http
POST /api/submissions/submit
Content-Type: application/json
X-User-Id: 2

{
    "examId": 1,
    "answers": [
        {
            "questionId": 1,
            "selectedOption": "A"
        },
        {
            "questionId": 2,
            "selectedOption": "B"
        }
    ]
}
```

**Response:**
```json
{
    "id": 1,
    "studentName": "John Doe",
    "examTitle": "Java Fundamentals",
    "score": 100.0,
    "submittedAt": 1234567890000,
    "totalQuestions": 2,
    "correctAnswers": 2
}
```

#### Get Submission Result
```http
GET /api/submissions/{submissionId}
```

#### Get Student Results
```http
GET /api/submissions/student/{studentId}
```

#### Get All Exam Results
```http
GET /api/submissions/exam/{examId}
```

## Data Models

### User
```
id: Long (Primary Key)
email: String (Unique)
name: String
password: String (BCrypt hashed)
role: Enum (ADMIN, STUDENT)
createdAt: Long (Timestamp)
```

### Exam
```
id: Long (Primary Key)
title: String
description: String
duration: Integer (in minutes)
totalQuestions: Integer
createdBy: User (FK to Admin)
createdAt: Long
updatedAt: Long
```

### Question
```
id: Long (Primary Key)
questionText: String
optionA, optionB, optionC, optionD: String
correctAnswer: Character (A, B, C, D)
exam: Exam (FK)
createdAt: Long
```

### Submission
```
id: Long (Primary Key)
student: User (FK)
exam: Exam (FK)
score: Double (0-100)
submittedAt: Long
createdAt: Long
updatedAt: Long
UNIQUE(student_id, exam_id) - One student can submit only once per exam
```

### Answer
```
id: Long (Primary Key)
submission: Submission (FK)
question: Question (FK)
selectedOption: Character (A, B, C, D)
isCorrect: Boolean (auto-evaluated)
createdAt: Long
```

## Key Features & Constraints

### 1. Unique Submission Constraint
Each student can submit a particular exam only **once**. Trying to submit again will raise a `BadRequestException`.

### 2. Automatic Score Calculation
Score is automatically calculated as: `(correctAnswers / totalQuestions) * 100`

### 3. Auto-Evaluation
When answers are submitted, the system automatically:
- Compares each answer with the correct answer
- Marks answers as correct/incorrect
- Calculates and stores the final score

### 4. Password Security
All passwords are hashed using **BCrypt** before storage.

## Error Handling

The application includes a global exception handler with the following error responses:

### ResourceNotFoundException (404)
```json
{
    "status": 404,
    "message": "Resource not found"
}
```

### BadRequestException (400)
```json
{
    "status": 400,
    "message": "Invalid request"
}
```

### UnauthorizedException (401)
```json
{
    "status": 401,
    "message": "Unauthorized access"
}
```

### Internal Server Error (500)
```json
{
    "status": 500,
    "message": "An unexpected error occurred"
}
```

## Swagger/OpenAPI Documentation

Once the application is running, access the API documentation at:

**http://localhost:8080/swagger-ui.html**

## Sample Workflow

### 1. Create Admin Account
```bash
POST http://localhost:8080/api/users/register
{
    "email": "admin@example.com",
    "name": "Admin User",
    "password": "admin123",
    "role": "ADMIN"
}
# Response: User with id=1
```

### 2. Create Student Account
```bash
POST http://localhost:8080/api/users/register
{
    "email": "student@example.com",
    "name": "Student User",
    "password": "student123",
    "role": "STUDENT"
}
# Response: User with id=2
```

### 3. Create Exam
```bash
POST http://localhost:8080/api/exams
Headers: X-User-Id: 1
{
    "title": "Java Test",
    "description": "Test your Java knowledge",
    "duration": 60
}
# Response: Exam with id=1
```

### 4. Add Questions
```bash
POST http://localhost:8080/api/questions
Headers: X-User-Id: 1
{
    "questionText": "Question 1",
    "optionA": "Option A",
    "optionB": "Option B",
    "optionC": "Option C",
    "optionD": "Option D",
    "correctAnswer": "A",
    "examId": 1
}
# Repeat for more questions
```

### 5. Submit Exam
```bash
POST http://localhost:8080/api/submissions/submit
Headers: X-User-Id: 2
{
    "examId": 1,
    "answers": [
        {"questionId": 1, "selectedOption": "A"},
        {"questionId": 2, "selectedOption": "B"}
    ]
}
# Response: Submission result with score
```

### 6. View Results
```bash
GET http://localhost:8080/api/submissions/student/2
# Get all results for student

GET http://localhost:8080/api/submissions/exam/1
# Get all results for exam
```

## Logging Configuration

The application uses SLF4J with different logging levels:

- **ROOT**: INFO
- **Application Package**: DEBUG
- **Spring Web**: INFO
- **Hibernate SQL**: DEBUG
- **SQL Parameters**: TRACE

View logs in console when running with `mvn spring-boot:run`

## Future Enhancements

- [ ] JWT Authentication
- [ ] Role-based access control (authorization)
- [ ] Exam scheduling and time tracking
- [ ] Question bank management
- [ ] Batch operations for questions
- [ ] Analytics and reporting
- [ ] Email notifications
- [ ] Unit and Integration tests
- [ ] Docker containerization

## License

MIT License

## Contact

For issues or questions, please create an issue in the repository.
