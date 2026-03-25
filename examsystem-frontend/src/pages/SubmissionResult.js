import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { submissionService } from '../services';
import Card from '../components/Card';
import Alert from '../components/Alert';

const SubmissionResult = () => {
  const { submissionId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResult();
  }, [submissionId]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const response = await submissionService.getSubmissionResult(submissionId);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load result');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading result...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <Alert type="error" message={error} />
      </div>
    );
  }

  const scorePercentage = (result.correctAnswers / result.totalQuestions) * 100;
  const isPass = scorePercentage >= 50;

  return (
    <div className="container py-8">
      <Card className="mb-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Exam Completed!</h1>
          <p className="text-gray-600">{result.examTitle}</p>
        </div>

        {/* Score Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm font-medium mb-2">Your Score</p>
            <p className={`text-4xl font-bold ${isPass ? 'text-green-600' : 'text-red-600'}`}>
              {result.score.toFixed(2)}%
            </p>
          </div>

          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm font-medium mb-2">Correct Answers</p>
            <p className="text-4xl font-bold text-primary-600">
              {result.correctAnswers}/{result.totalQuestions}
            </p>
          </div>

          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm font-medium mb-2">Result</p>
            <p className={`text-2xl font-bold ${isPass ? 'text-green-600' : 'text-red-600'}`}>
              {isPass ? 'PASS' : 'FAIL'}
            </p>
          </div>
        </div>

        {/* Feedback */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Answer Review</h2>
          <div className="space-y-4">
            {result.feedback.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-l-4 ${
                  item.isCorrect
                    ? 'bg-green-50 border-green-500'
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <p className="font-medium text-gray-800 mb-2">
                  Q{idx + 1}: {item.questionText}
                </p>
                <div className="ml-4 space-y-1 text-sm">
                  <p className="text-gray-600">
                    Your Answer: <span className="font-medium">{item.selectedOption}</span>
                  </p>
                  {!item.isCorrect && (
                    <p className="text-green-700">
                      Correct Answer: <span className="font-medium">{item.correctAnswer}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Link to="/student-dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SubmissionResult;
