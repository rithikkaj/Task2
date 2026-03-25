import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examService, questionService, submissionService } from '../services';
import Card from '../components/Card';
import Alert from '../components/Alert';

const TakeExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    fetchExamData();
  }, [examId]);

  useEffect(() => {
    if (!exam) return;

    setTimeLeft(exam.duration * 60); // Convert minutes to seconds

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [exam]);

  const fetchExamData = async () => {
    try {
      setLoading(true);
      const [examRes, questionsRes] = await Promise.all([
        examService.getExamById(examId),
        questionService.getStudentQuestionsByExamId(examId),
      ]);
      setExam(examRes.data);
      setQuestions(questionsRes.data);
      
      // Initialize answers object
      const initialAnswers = {};
      questionsRes.data.forEach(q => {
        initialAnswers[q.id] = '';
      });
      setAnswers(initialAnswers);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load exam');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmitExam = async () => {
    setSubmitting(true);
    try {
      const submissionData = {
        examId: parseInt(examId),
        answers: questions.map(q => ({
          questionId: q.id,
          selectedOption: answers[q.id],
        })),
      };

      const response = await submissionService.submitExam(submissionData);
      navigate(`/submission-result/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit exam');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="container py-8">
        <Alert type="error" message="Unable to load exam data" />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered = answers[currentQuestion.id] !== '';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{exam.title}</h1>
              <p className="text-gray-600 mt-2">{exam.description}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Time Remaining</p>
              <p className="text-3xl font-bold text-primary-600">{formatTime(timeLeft)}</p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-700 font-medium">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <div className="flex gap-2">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    answers[q.id] !== ''
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } ${idx === currentQuestionIndex ? 'ring-2 ring-primary-600' : ''}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <Card>
          <h2 className="text-xl font-bold text-gray-800 mb-6">{currentQuestion.questionText}</h2>

          <div className="space-y-3 mb-8">
            {['A', 'B', 'C', 'D'].map(option => (
              <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                style={{
                  borderColor: answers[currentQuestion.id] === option ? '#0284c7' : '#e5e7eb',
                  backgroundColor: answers[currentQuestion.id] === option ? '#f0f9ff' : '#ffffff',
                }}>
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={answers[currentQuestion.id] === option}
                  onChange={() => handleAnswerChange(currentQuestion.id, option)}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="ml-3 text-gray-800 font-medium">
                  {option}. {currentQuestion[`option${option}`]}
                </span>
              </label>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className="btn-secondary disabled:opacity-50"
            >
              Previous
            </button>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmitExam}
                disabled={submitting}
                className="btn-primary disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Exam'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                className="btn-primary"
              >
                Next
              </button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TakeExam;
