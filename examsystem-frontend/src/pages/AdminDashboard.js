import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService, userService, examService, submissionService } from '../services';
import Card from '../components/Card';
import Alert from '../components/Alert';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getAdminDashboard();
      setDashboardData(response.data);
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm font-medium">Total Students</p>
            <p className="text-4xl font-bold text-primary-600">{dashboardData?.totalStudents || 0}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm font-medium">Total Admins</p>
            <p className="text-4xl font-bold text-primary-600">{dashboardData?.totalAdmins || 0}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm font-medium">Total Exams</p>
            <p className="text-4xl font-bold text-primary-600">{dashboardData?.totalExams || 0}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm font-medium">Total Submissions</p>
            <p className="text-4xl font-bold text-primary-600">{dashboardData?.totalSubmissions || 0}</p>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/create-exam"
            className="btn-primary text-center block"
          >
            Create New Exam
          </Link>
          <Link
            to="/my-exams"
            className="btn-primary text-center block"
          >
            My Exams
          </Link>
          <Link
            to="/exam-results"
            className="btn-primary text-center block"
          >
            View Results
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
