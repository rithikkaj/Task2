import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService, examService } from '../services';
import Card from '../components/Card';
import Alert from '../components/Alert';

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, examsRes] = await Promise.all([
        dashboardService.getStudentDashboard(),
        examService.getAllExams(),
      ]);
      setDashboardData(dashboardRes.data);
      setExams(examsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm font-medium">Available Exams</p>
            <p className="text-4xl font-bold text-primary-600">{dashboardData?.availableExams || 0}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm font-medium">Completed Exams</p>
            <p className="text-4xl font-bold text-primary-600">{dashboardData?.completedExams || 0}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm font-medium">Average Score</p>
            <p className="text-4xl font-bold text-primary-600">
              {dashboardData?.averageScore ? dashboardData.averageScore.toFixed(2) : 0}%
            </p>
          </div>
        </Card>
      </div>

      {/* Available Exams */}
      <Card title="Available Exams">
        {exams.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No exams available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exams.map(exam => (
              <div key={exam.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{exam.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{exam.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">
                    Duration: {exam.duration} minutes
                  </span>
                  <span className="text-sm text-gray-500">
                    Questions: {exam.totalQuestions}
                  </span>
                </div>
                <Link
                  to={`/exam/${exam.id}`}
                  className="btn-primary w-full text-center"
                >
                  Take Exam
                </Link>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default StudentDashboard;
