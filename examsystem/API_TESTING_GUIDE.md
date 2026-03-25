# API Testing Guide - Online Examination System

## Testing Tools & Methods

This guide covers various ways to test the Online Examination System APIs.

---

## 1. Using Swagger UI (Easiest)

### Access Swagger UI
1. Start the application: `mvn spring-boot:run`
2. Open browser: **http://localhost:8080/swagger-ui.html**
3. All endpoints will be listed with interactive forms

### Benefits
✅ Visual API documentation
✅ Try-it-out functionality
✅ Automatic request generation
✅ Response visualization

---

## 2. Using cURL (Command Line)

### Prerequisites
- cURL installed (most systems come with it)
- Command terminal/PowerShell

### Basic cURL Syntax
```bash
curl -X METHOD http://localhost:8080/api/endpoint \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{"field": "value"}'
```

### Test Cases

#### 2.1 Register Admin User
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin1@example.com",
    "name": "Admin One",
    "password": "admin123",
    "role": "ADMIN"
  }'
```

**Expected Response:**
```json
{
  "id": 1,
  "email": "admin1@example.com",
  "name": "Admin One",
  "role": "ADMIN",
  "createdAt": 1705017600000
}
```

#### 2.2 Register Student User
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student1@example.com",
    "name": "Student One",
    "password": "student123",
    "role": "STUDENT"
  }'
```

#### 2.3 Get All Students
```bash
curl -X GET http://localhost:8080/api/users/role/student
```

#### 2.4 Create an Exam
```bash
curl -X POST http://localhost:8080/api/exams \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "title": "Java Advanced",
    "description": "Advanced Java concepts",
    "duration": 90
  }'
```

#### 2.5 Get All Exams
```bash
curl -X GET http://localhost:8080/api/exams
```

#### 2.6 Get Exams by Admin
```bash
curl -X GET http://localhost:8080/api/exams/admin/1
```

#### 2.7 Add Question to Exam
```bash
curl -X POST http://localhost:8080/api/questions \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "questionText": "What is the purpose of the main method in Java?",
    "optionA": "Entry point of a Java application",
    "optionB": "Used to define variables",
    "optionC": "Used to import packages",
    "optionD": "None of the above",
    "correctAnswer": "A",
    "examId": 1
  }'
```

#### 2.8 Get Questions for an Exam
```bash
curl -X GET http://localhost:8080/api/questions/exam/1
```

#### 2.9 Submit Exam (Student)
```bash
curl -X POST http://localhost:8080/api/submissions/submit \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 2" \
  -d '{
    "examId": 1,
    "answers": [
      {"questionId": 1, "selectedOption": "A"},
      {"questionId": 2, "selectedOption": "B"},
      {"questionId": 3, "selectedOption": "C"}
    ]
  }'
```

#### 2.10 Get Student Results
```bash
curl -X GET http://localhost:8080/api/submissions/student/2
```

#### 2.11 Get All Exam Results
```bash
curl -X GET http://localhost:8080/api/submissions/exam/1
```

#### 2.12 Get Specific Submission
```bash
curl -X GET http://localhost:8080/api/submissions/1
```

---

## 3. Using Postman (Recommended for Teams)

### Installation
1. Download from [postman.com](https://www.postman.com)
2. Install and open Postman

### Setup Environment

1. **Create New Collection**: "Exam System API"
2. **Create Environment Variables**:
   - `base_url`: http://localhost:8080
   - `admin_id`: 1
   - `student_id`: 2
   - `exam_id`: 1

### Import Collection Alternative

Create requests manually:

#### Request 1: Register Admin
```
Name: Register Admin
Method: POST
URL: {{base_url}}/api/users/register
Headers: Content-Type: application/json
Body (raw JSON):
{
  "email": "admin@test.com",
  "name": "Admin Test",
  "password": "admin123",
  "role": "ADMIN"
}
```

#### Request 2: Register Student
```
Name: Register Student
Method: POST
URL: {{base_url}}/api/users/register
Headers: Content-Type: application/json
Body (raw JSON):
{
  "email": "student@test.com",
  "name": "Student Test",
  "password": "student123",
  "role": "STUDENT"
}
```

#### Request 3: Create Exam
```
Name: Create Exam
Method: POST
URL: {{base_url}}/api/exams
Headers: 
  - Content-Type: application/json
  - X-User-Id: {{admin_id}}
Body (raw JSON):
{
  "title": "Python Basics",
  "description": "Learn Python fundamentals",
  "duration": 75
}
```

#### Request 4: Add Question
```
Name: Add Question
Method: POST
URL: {{base_url}}/api/questions
Headers:
  - Content-Type: application/json
  - X-User-Id: {{admin_id}}
Body (raw JSON):
{
  "questionText": "Which of these is a Python keyword?",
  "optionA": "class",
  "optionB": "Class",
  "optionC": "CLASS",
  "optionD": "clazz",
  "correctAnswer": "A",
  "examId": {{exam_id}}
}
```

#### Request 5: Submit Exam
```
Name: Submit Exam
Method: POST
URL: {{base_url}}/api/submissions/submit
Headers:
  - Content-Type: application/json
  - X-User-Id: {{student_id}}
Body (raw JSON):
{
  "examId": {{exam_id}},
  "answers": [
    {"questionId": 1, "selectedOption": "A"}
  ]
}
```

---

## 4. Using VS Code REST Client Extension

### Installation
1. Install "REST Client" extension in VS Code
2. Create file `requests.rest`

### Sample File Content

```rest
### Variables
@baseUrl = http://localhost:8080
@adminId = 1
@studentId = 2
@examId = 1
@contentType = application/json

### 1. Register Admin
POST {{baseUrl}}/api/users/register
Content-Type: {{contentType}}

{
  "email": "admin@test.com",
  "name": "Admin User",
  "password": "admin123",
  "role": "ADMIN"
}

### 2. Register Student
POST {{baseUrl}}/api/users/register
Content-Type: {{contentType}}

{
  "email": "student@test.com",
  "name": "Student User",
  "password": "student123",
  "role": "STUDENT"
}

### 3. Create Exam
POST {{baseUrl}}/api/exams
Content-Type: {{contentType}}
X-User-Id: {{adminId}}

{
  "title": "Spring Boot Basics",
  "description": "Learn Spring Boot",
  "duration": 60
}

### 4. Get All Exams
GET {{baseUrl}}/api/exams

### 5. Add Question
POST {{baseUrl}}/api/questions
Content-Type: {{contentType}}
X-User-Id: {{adminId}}

{
  "questionText": "What is Spring Boot?",
  "optionA": "Framework for Java applications",
  "optionB": "A type of shoe",
  "optionC": "Programming language",
  "optionD": "Database",
  "correctAnswer": "A",
  "examId": {{examId}}
}

### 6. Get Questions
GET {{baseUrl}}/api/questions/exam/{{examId}}

### 7. Submit Exam
POST {{baseUrl}}/api/submissions/submit
Content-Type: {{contentType}}
X-User-Id: {{studentId}}

{
  "examId": {{examId}},
  "answers": [
    {"questionId": 1, "selectedOption": "A"}
  ]
}

### 8. Get Student Results
GET {{baseUrl}}/api/submissions/student/{{studentId}}

### 9. Get Exam Results
GET {{baseUrl}}/api/submissions/exam/{{examId}}

### 10. Get User by Email
GET {{baseUrl}}/api/users/email/student@test.com
```

**Usage in VS Code:**
- Click "Send Request" above each request
- View response in right panel

---

## 5. Using Java HttpClient (Program Testing)

```java
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;

public class APITester {
    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        
        // Register User
        String registerJson = "{\"email\":\"test@example.com\",\"name\":\"Test\",\"password\":\"123\",\"role\":\"STUDENT\"}";
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("http://localhost:8080/api/users/register"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(registerJson))
            .build();
        
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println("Status: " + response.statusCode());
        System.out.println("Body: " + response.body());
    }
}
```

---

## 6. Testing Workflow

### Complete Test Sequence

```bash
# All commands execute in order

# Step 1: Register Admin
ADMIN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","name":"Admin","password":"admin123","role":"ADMIN"}')
echo "Admin Response: $ADMIN_RESPONSE"

# Step 2: Register Student
STUDENT_RESPONSE=$(curl -s -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","name":"Student","password":"student123","role":"STUDENT"}')
echo "Student Response: $STUDENT_RESPONSE"

# Step 3: Create Exam
EXAM_RESPONSE=$(curl -s -X POST http://localhost:8080/api/exams \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{"title":"Test Exam","description":"Test","duration":60}')
echo "Exam Response: $EXAM_RESPONSE"

# Step 4: Add Questions
curl -s -X POST http://localhost:8080/api/questions \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{"questionText":"Question 1?","optionA":"A","optionB":"B","optionC":"C","optionD":"D","correctAnswer":"A","examId":1}'

# Step 5: Submit Exam
SUBMIT_RESPONSE=$(curl -s -X POST http://localhost:8080/api/submissions/submit \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 2" \
  -d '{"examId":1,"answers":[{"questionId":1,"selectedOption":"A"}]}')
echo "Submit Response: $SUBMIT_RESPONSE"

# Step 6: Get Results
curl -s -X GET http://localhost:8080/api/submissions/student/2
```

---

## 7. Error Testing

### Test Error Cases

#### Duplicate Email
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test 2","password":"123","role":"STUDENT"}'
```

**Expected Response (400):**
```json
{
  "status": 400,
  "message": "User with this email already exists"
}
```

#### Invalid Exam ID
```bash
curl -X GET http://localhost:8080/api/exams/999
```

**Expected Response (404):**
```json
{
  "status": 404,
  "message": "Exam not found with id: 999"
}
```

#### Duplicate Submission
```bash
# Submit twice with same student
curl -X POST http://localhost:8080/api/submissions/submit \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 2" \
  -d '{"examId":1,"answers":[{"questionId":1,"selectedOption":"A"}]}'

# Second submission should fail
curl -X POST http://localhost:8080/api/submissions/submit \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 2" \
  -d '{"examId":1,"answers":[{"questionId":1,"selectedOption":"B"}]}'
```

**Expected Response (400):**
```json
{
  "status": 400,
  "message": "You have already submitted this exam. One student can only submit one exam once."
}
```

---

## 8. Performance Testing

### Using Apache JMeter

1. **Download JMeter** from https://jmeter.apache.org/
2. **Create Test Plan**:
   - Thread Group (100 users, ramp-up 10s)
   - HTTP Request Samplers
   - View Results Tree
   - Summary Report

### Using LoadRunner (Enterprise)

Similar configuration with:
- Virtual users
- Think time
- Correlation rules
- Server monitoring

---

## 9. Test Data Checklist

### Before Testing

- [ ] MySQL running on localhost:3306
- [ ] Database `exam_system` created
- [ ] Spring Boot application started
- [ ] Port 8080 accessible
- [ ] Swagger UI accessible at http://localhost:8080/swagger-ui.html

### Test Coverage

Endpoint Tests:
- [ ] All 16 REST endpoints tested
- [ ] Happy path scenarios
- [ ] Error handling (404, 400, 500)
- [ ] Data validation
- [ ] Constraint enforcement

---

## 10. Debugging

### View Logs
```bash
# In terminal running mvn spring-boot:run
# Look for:
# - UserService logs
# - ExamService logs
# - SubmissionService logs
# - SQL queries (if DEBUG is enabled)
```

### Enable SQL Logging
Edit `application.properties`:
```properties
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
```

### Check Database
```bash
mysql -u root -p
USE exam_system;
SELECT * FROM users;
SELECT * FROM exams;
SELECT * FROM questions;
SELECT * FROM submissions;
SELECT * FROM answers;
```

---

## Summary

| Tool | Ease | Best For | Learning Curve |
|------|------|----------|---|
| Swagger UI | ⭐⭐⭐⭐⭐ | Quick testing | None |
| cURL | ⭐⭐⭐⭐ | CLI testing | Low |
| Postman | ⭐⭐⭐⭐ | Team testing | Low |
| VS Code REST | ⭐⭐⭐⭐ | Development | Low |
| Java HttpClient | ⭐⭐⭐ | Integration testing | Medium |
| JMeter | ⭐ | Performance testing | High |

---

**Recommended Testing Path:**
1. Start with Swagger UI for quick validation
2. Use Postman for detailed API testing
3. Use cURL for CI/CD automation
4. Use JMeter for performance testing

---

**Happy Testing! 🧪**
