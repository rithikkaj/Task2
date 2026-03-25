import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TakeExam from './pages/TakeExam';
import SubmissionResult from './pages/SubmissionResult';
import AdminDashboard from './pages/AdminDashboard';
import CreateExam from './pages/CreateExam';
import EditExam from './pages/EditExam';
import MyExams from './pages/MyExams';

const Home = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">Exam System</h1>
      <p className="text-xl text-gray-600 mb-8">A comprehensive platform for online exams</p>
      <div className="flex gap-4 justify-center">
        <a href="/login" className="btn-primary">
          Login
        </a>
        <a href="/register" className="btn-secondary">
          Register
        </a>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Student Routes */}
            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exam/:examId"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <TakeExam />
                </ProtectedRoute>
              }
            />
            <Route
              path="/submission-result/:submissionId"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <SubmissionResult />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-exam"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <CreateExam />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-exam/:examId"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <EditExam />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-exams"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <MyExams />
                </ProtectedRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
