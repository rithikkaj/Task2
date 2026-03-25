import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { examService, submissionService } from '../services';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Alert from '../components/Alert';

const MyExams = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [expandedExam, setExpandedExam] = useState(null);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await examService.getExamsCreatedByAdmin(user.id);
      setExams(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const handleExpandExam = async (examId) => {
    if (expandedExam === examId) {
      setExpandedExam(null);
      return;
    }

    setExpandedExam(examId);

    if (!results[examId]) {
      try {
        const response = await submissionService.getExamResults(examId);
        setResults(prev => ({
          ...prev,
          [examId]: response.data,
        }));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load exam results');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Exams</h1>
        <Link to="/create-exam" className="btn-primary">
          Create Exam
        </Link>
      </div>

      {exams.length === 0 ? (
        <Card>
          <p className="text-gray-600 text-center py-8">No exams created yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {exams.map(exam => (
            <Card key={exam.id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{exam.title}</h2>
                  <p className="text-gray-600 mb-4">{exam.description}</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Duration</p>
                      <p className="font-medium">{exam.duration} minutes</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Questions</p>
                      <p className="font-medium">{exam.totalQuestions}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Created</p>
                      <p className="font-medium">{new Date(exam.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Link
                    to={`/edit-exam/${exam.id}`}
                    className="btn-primary text-sm text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleExpandExam(exam.id)}
                    className="btn-secondary text-sm"
                  >
                    {expandedExam === exam.id ? 'Hide Results' : 'View Results'}
                  </button>
                </div>
              </div>

              {/* Results */}
              {expandedExam === exam.id && results[exam.id] && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-4">
                    Submissions ({results[exam.id].length})
                  </h3>
                  {results[exam.id].length === 0 ? (
                    <p className="text-gray-600">No submissions yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left">Student</th>
                            <th className="px-4 py-2 text-left">Score</th>
                            <th className="px-4 py-2 text-left">Correct</th>
                            <th className="px-4 py-2 text-left">Submitted</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results[exam.id].map((submission, idx) => (
                            <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="px-4 py-2">{submission.studentName}</td>
                              <td className="px-4 py-2 font-medium">{submission.score.toFixed(2)}%</td>
                              <td className="px-4 py-2">
                                {submission.correctAnswers}/{submission.totalQuestions}
                              </td>
                              <td className="px-4 py-2">
                                {new Date(submission.submittedAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyExams;
