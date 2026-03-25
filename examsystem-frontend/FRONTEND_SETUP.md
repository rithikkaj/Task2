# Frontend Setup Guide

## Project Overview

A complete React frontend for the Exam System with full authentication, student exam-taking interface, and admin exam management capabilities.

## Project Location

```
c:\Users\jrith\OneDrive\Desktop\TASK2\examsystem-frontend
```

## Quick Start

### 1. Install Dependencies
```bash
cd examsystem-frontend
npm install
```

### 2. Configure Environment
Create `.env` file:
```
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

### 3. Start Development Server
```bash
npm start
```

The app will open at http://localhost:3000

## Directory Structure

### Configuration Files
- `package.json` - Dependencies and scripts
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `.env.example` - Environment variables template
- `.gitignore` - Git ignore rules

### Source Code (src/)
- **index.js** - React root entry point
- **index.css** - Global Tailwind styles
- **App.js** - Main app with routing

#### Components (`src/components/`)
- `Navbar.js` - Navigation bar with user menu
- `ProtectedRoute.js` - Route protection wrapper
- `Card.js` - Reusable card container
- `Alert.js` - Alert/notification component
- `FormField.js` - Form input wrapper

#### Context (`src/context/`)
- `AuthContext.js` - Authentication state management
  - Handles user login/logout
  - Persists session to localStorage
  - Provides useAuth hook

#### Services (`src/services/`)
- `api.js` - Axios instance with interceptors
  - Injects user ID header
  - Handles 401 errors
- `index.js` - All API endpoints organized by resource

#### Pages (`src/pages/`)
**Public Pages:**
- `Login.js` - User login page
- `Register.js` - User registration

**Student Pages:**
- `StudentDashboard.js` - Dashboard with available exams
- `TakeExam.js` - Exam interface with timer
- `SubmissionResult.js` - Result with detailed feedback

**Admin Pages:**
- `AdminDashboard.js` - System statistics
- `CreateExam.js` - Create new exam
- `EditExam.js` - Manage exam and add questions
- `MyExams.js` - View created exams and results

## Features Implemented

### Authentication
✅ Login/Logout functionality
✅ User registration
✅ Token persistence
✅ Role-based access (Student/Admin)
✅ Protected routes

### Student Features
✅ View available exams
✅ Take exams with real-time countdown timer
✅ Multiple choice question interface
✅ Answer review with feedback
✅ Score calculation and display
✅ Exam history tracking

### Admin Features
✅ Dashboard with system statistics
✅ Create new exams
✅ Add/manage questions (MCQ format)
✅ View student submissions
✅ Track exam performance

### UI/UX
✅ Responsive design (mobile, tablet, desktop)
✅ Tailwind CSS styling
✅ Loading states
✅ Error handling
✅ Confirmation dialogs
✅ Form validation

## API Integration

All API calls use the axios instance in `src/services/api.js`:

```javascript
import { authService, examService, questionService, submissionService, dashboardService } from '../services';
```

Services are organized by resource type and handle all communication with the backend.

## Authentication Flow

1. User logs in → API validates credentials
2. Backend returns user data and token
3. Frontend stores user in localStorage via AuthContext
4. User ID automatically added to API headers
5. On logout → Clear localStorage and redirect to login

## State Management

- **AuthContext** - Manages user authentication state
  - `user` - Current user object
  - `isAuthenticated` - Boolean flag
  - `isAdmin` / `isStudent` - Role checks
  - `login()` / `logout()` - Auth methods

## Styling

Tailwind CSS utility classes with custom utilities:
- Color scheme: Primary blue (#0284c7)
- Responsive grid layouts
- Custom button styles
- Form styling
- Card and container utilities

## Routing Structure

```
/                          → Home page
/login                     → Login page
/register                  → Registration page

/student-dashboard         → Student dashboard
/exam/:examId              → Take exam
/submission-result/:id     → View exam result

/admin-dashboard           → Admin dashboard
/create-exam               → Create exam
/edit-exam/:examId         → Manage exam & questions
/my-exams                  → View my exams & results
```

## Available NPM Scripts

```bash
npm start      # Start development server (port 3000)
npm build      # Build for production
npm test       # Run tests
npm eject      # Eject configuration (not reversible)
```

## Environment Variables

**.env file:**
```
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

All React environment variables must start with `REACT_APP_`

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## File Sizes

- Main bundle: ~150KB (after build optimization)
- Tailwind CSS: ~30KB (purged)

## Next Steps

1. Install dependencies: `npm install`
2. Ensure backend is running on port 8080
3. Start frontend: `npm start`
4. Test login/register functionality
5. Test student exam flow
6. Test admin exam creation and management

## Troubleshooting

**Port already in use:**
```bash
npm start -- --port 3001
```

**API connection failed:**
- Check backend running on http://localhost:8080
- Verify .env REACT_APP_API_BASE_URL
- Check browser console for CORS errors

**Styling not applied:**
- Rebuild: `npm start`
- Clear browser cache
- Check Tailwind classes are valid

## Notes

- Frontend uses Create React App scaffolding
- No backend required for frontend to run (will show API errors)
- All user data stored in localStorage (not persistent across browsers)
- Session expires on browser close (token-based auth)
