# Quick Start Guide - Online Examination System

## Prerequisites

- Java 17 or higher installed
- MySQL 8.0 or higher running
- Maven installed
- Git (optional)

## Step 1: Database Setup

### Option 1: Using MySQL CLI

```bash
# Connect to MySQL
mysql -u root -p

# Run the SQL script
source database-schema.sql

# Verify (optional)
USE exam_system;
SHOW TABLES;
SELECT * FROM users;
```

### Option 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Open the `database-schema.sql` file
3. Execute the script

## Step 2: Configure Database Connection

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/exam_system
spring.datasource.username=root
spring.datasource.password=your_password
```

## Step 3: Build & Run

```bash
# Navigate to project directory
cd examsystem

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start at: **http://localhost:8080**

## Step 4: Test the API

### Using Postman

1. Import the Postman collection (if available)
2. Or manually create requests below

### Using cURL

#### Register a Student

```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "name": "John Doe",
    "password": "password123",
    "role": "STUDENT"
  }'
```

#### Register an Admin

```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "name": "Admin User",
    "password": "admin123",
    "role": "ADMIN"
  }'
```

#### Create an Exam

```bash
curl -X POST http://localhost:8080/api/exams \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "title": "Java Test",
    "description": "Test your Java knowledge",
    "duration": 60
  }'
```

#### Add Questions

```bash
curl -X POST http://localhost:8080/api/questions \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "questionText": "What is Java?",
    "optionA": "A programming language",
    "optionB": "A coffee brand",
    "optionC": "An island",
    "optionD": "All of the above",
    "correctAnswer": "A",
    "examId": 1
  }'
```

#### Submit Exam

```bash
curl -X POST http://localhost:8080/api/submissions/submit \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 2" \
  -d '{
    "examId": 1,
    "answers": [
      {"questionId": 1, "selectedOption": "A"}
    ]
  }'
```

#### Get Student Results

```bash
curl http://localhost:8080/api/submissions/student/2
```

## Step 5: Access Swagger Documentation

Open in your browser: **http://localhost:8080/swagger-ui.html**

## Troubleshooting

### Database Connection Error

```
Error: Access denied for user 'root'@'localhost'
```

**Solution:** Update `application.properties` with correct MySQL credentials

### Port Already in Use

```
Error: Port 8080 is already in use
```

**Solution:** Change port in `application.properties`:
```properties
server.port=8081
```

### Tables Not Created

**Solution:** Ensure `spring.jpa.hibernate.ddl-auto=update` is set in `application.properties`

### Build Error

```bash
# Clear Maven cache
mvn clean

# Rebuild
mvn install -DskipTests
```

## Sample Workflow

### Complete Exam Workflow

1. **Admin registers** (ID: 1)
2. **Student registers** (ID: 2)
3. **Admin creates exam** (Exam ID: 1)
4. **Admin adds questions** (Question IDs: 1, 2, 3)
5. **Student submits answers**
6. **View results**

### API Sequence

```
1. POST /api/users/register (Admin) → User ID: 1
2. POST /api/users/register (Student) → User ID: 2
3. POST /api/exams (Admin, header X-User-Id: 1) → Exam ID: 1
4. POST /api/questions (Admin, header X-User-Id: 1) → Question ID: 1
5. POST /api/questions (repeat for more questions)
6. POST /api/submissions/submit (Student, header X-User-Id: 2) → Result
7. GET /api/submissions/student/2 → All student results
8. GET /api/submissions/exam/1 → All exam results
```

## Key Points

- **X-User-Id Header**: Required for exam creation and submission
- **Role-Based Operations**: 
  - ADMIN: Create exams, add questions
  - STUDENT: View exams, submit answers
- **Unique Submission**: A student can submit only ONE answer per exam
- **Auto-Evaluation**: Score is calculated automatically

## Logs Location

Logs are printed to console when running with `mvn spring-boot:run`

For file logging, add to `application.properties`:
```properties
logging.file.name=logs/application.log
```

## Performance Tips

- Build without tests: `mvn install -DskipTests`
- Use database indexes properly (already configured)
- Connection pooling is auto-configured

## Next Steps

1. Set up Spring Security with JWT tokens
2. Add email notifications
3. Implement advanced analytics
4. Create front-end application
5. Deploy to production

## Support

For issues, please check:
- Application logs
- Database connectivity
- Java version compatibility
- MySQL version compatibility

## Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
