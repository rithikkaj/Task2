import apiClient from './api';

// Auth endpoints
export const authService = {
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
  
  register: (userData) =>
    apiClient.post('/users/register', userData),
};

// User endpoints
export const userService = {
  getUserById: (id) =>
    apiClient.get(`/users/${id}`),
  
  getUserByEmail: (email) =>
    apiClient.get(`/users/email/${email}`),
  
  getAllStudents: () =>
    apiClient.get('/users/role/student'),
  
  getAllAdmins: () =>
    apiClient.get('/users/role/admin'),
};

// Exam endpoints
export const examService = {
  getAllExams: () =>
    apiClient.get('/exams'),
  
  getExamById: (id) =>
    apiClient.get(`/exams/${id}`),
  
  getExamsCreatedByAdmin: (adminId) =>
    apiClient.get(`/exams/admin/${adminId}`),
  
  createExam: (examData) =>
    apiClient.post('/exams', examData),
};

// Question endpoints
export const questionService = {
  getQuestionById: (id) =>
    apiClient.get(`/questions/${id}`),
  
  getQuestionsByExamId: (examId) =>
    apiClient.get(`/questions/exam/${examId}`),
  
  getStudentQuestionsByExamId: (examId) =>
    apiClient.get(`/questions/exam/${examId}/student`),
  
  addQuestion: (questionData) =>
    apiClient.post('/questions', questionData),
};

// Submission endpoints
export const submissionService = {
  submitExam: (submissionData) =>
    apiClient.post('/submissions/submit', submissionData),
  
  getSubmissionResult: (submissionId) =>
    apiClient.get(`/submissions/${submissionId}`),
  
  getStudentResults: (studentId) =>
    apiClient.get(`/submissions/student/${studentId}`),
  
  getExamResults: (examId) =>
    apiClient.get(`/submissions/exam/${examId}`),
};

// Dashboard endpoints
export const dashboardService = {
  getStudentDashboard: () =>
    apiClient.get('/dashboard/student'),
  
  getAdminDashboard: () =>
    apiClient.get('/dashboard/admin'),
};
