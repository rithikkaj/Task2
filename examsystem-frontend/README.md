# Exam System Frontend

A modern React-based frontend application for the Exam System, providing a complete user interface for students and administrators to take exams and manage exam content.

## Features

### Student Features
- User registration and login
- View available exams on dashboard
- Take exams with real-time timer
- Multiple choice question interface
- View exam results and feedback
- Track exam history and scores

### Admin Features
- Admin dashboard with system statistics
- Create new exams
- Add questions to exams
- View exam submissions and results
- Track student performance

## Technology Stack

- **React 18** - UI framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API communication
- **Tailwind CSS** - Utility-first CSS framework
- **Context API** - State management for authentication

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Backend API running on http://localhost:8080

## Installation

1. Clone the repository
```bash
cd examsystem-frontend
```

2. Install dependencies
```bash
npm install
```

3. Create environment configuration
```bash
cp .env.example .env
```

4. Update `.env` if your backend runs on a different URL:
```
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

## Running the Application

Start the development server:
```bash
npm start
```

The application will open at http://localhost:3000

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.js       # Navigation bar
│   ├── ProtectedRoute.js # Route protection wrapper
│   ├── Card.js         # Card component
│   ├── Alert.js        # Alert/notification component
│   └── FormField.js    # Form input component
├── context/            # React context for state management
│   └── AuthContext.js  # Authentication context
├── pages/              # Page components
│   ├── Login.js        # Login page
│   ├── Register.js     # Registration page
│   ├── StudentDashboard.js   # Student dashboard
│   ├── TakeExam.js     # Exam taking interface
│   ├── SubmissionResult.js   # Exam results page
│   ├── AdminDashboard.js     # Admin dashboard
│   ├── CreateExam.js   # Exam creation
│   ├── EditExam.js     # Edit exam and add questions
│   └── MyExams.js      # View created exams
├── services/           # API service layer
│   ├── api.js          # Axios instance configuration
│   └── index.js        # API service endpoints
├── utils/              # Utility functions
├── App.js              # Main app component with routing
├── index.js            # React root
└── index.css           # Global styles

```

## API Integration

The frontend communicates with the backend API at `http://localhost:8080/api`. All API endpoints are abstracted in `src/services/index.js`.

### Key API Endpoints

**Authentication:**
- `POST /auth/login` - User login
- `POST /users/register` - User registration

**Exams:**
- `GET /exams` - Get all exams
- `GET /exams/{id}` - Get exam details
- `POST /exams` - Create exam

**Questions:**
- `GET /questions/exam/{examId}` - Get exam questions
- `GET /questions/exam/{examId}/student` - Get questions for student
- `POST /questions` - Add question to exam

**Submissions:**
- `POST /submissions/submit` - Submit exam answers
- `GET /submissions/{submissionId}` - Get submission result
- `GET /submissions/exam/{examId}` - Get exam results

**Dashboard:**
- `GET /dashboard/student` - Get student dashboard data
- `GET /dashboard/admin` - Get admin dashboard data

## Authentication

The app uses Context API for authentication state management with the following features:

- User login/logout
- Token persistence in localStorage
- User ID header injection in API requests
- Automatic redirect on unauthorized access
- Role-based route protection (Student/Admin)

## Building for Production

```bash
npm run build
```

Creates a production-ready build in the `build/` folder.

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from create-react-app (not reversible)

## Styling

The application uses Tailwind CSS for styling. Custom styles are in `src/index.css`.

### Utility Classes
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.btn-danger` - Danger button
- `.input-field` - Input field styling
- `.card` - Card container
- `.error` - Error text
- `.success` - Success text

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### API Connection Issues
- Ensure backend is running on http://localhost:8080
- Check REACT_APP_API_BASE_URL in .env file
- Check browser console for CORS errors

### Login Not Working
- Verify credentials with backend
- Check localStorage for token storage
- Review Network tab in browser DevTools

### State Issues
- Clear localStorage and refresh (logout will do this)
- Check AuthContext is wrapping the app
- Review browser console for errors

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Support

For issues or questions, please create an issue in the repository or contact the development team.
