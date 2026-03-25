import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { examService, questionService } from '../services';
import Card from '../components/Card';
import FormField from '../components/FormField';
import Alert from '../components/Alert';

const EditExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [formData, setFormData] = useState({
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExamData();
  }, [examId]);

  const fetchExamData = async () => {
    try {
      setLoading(true);
      const [examRes, questionsRes] = await Promise.all([
        examService.getExamById(examId),
        questionService.getQuestionsByExamId(examId),
      ]);
      setExam(examRes.data);
      setQuestions(questionsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load exam');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const questionData = {
        ...formData,
        examId: parseInt(examId),
      };

      const response = await questionService.addQuestion(questionData);
      setQuestions([...questions, response.data]);

      // Reset form
      setFormData({
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
      });
      setShowQuestionForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add question');
    } finally {
      setSubmitting(false);
    }
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

  if (!exam) {
    return (
      <div className="container py-8">
        <Alert type="error" message="Exam not found" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <Card title={exam.title} className="mb-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600 text-sm">Description</p>
            <p className="text-gray-800 font-medium">{exam.description}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Duration</p>
            <p className="text-gray-800 font-medium">{exam.duration} minutes</p>
          </div>
        </div>
      </Card>

      {/* Questions */}
      <Card title={`Questions (${questions.length})`} className="mb-6">
        {questions.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No questions added yet.</p>
        ) : (
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={q.id} className="border border-gray-200 rounded-lg p-4">
                <p className="font-medium text-gray-800 mb-3">Q{idx + 1}: {q.questionText}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className={`p-2 rounded ${q.correctAnswer === 'A' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                    A. {q.optionA}
                  </div>
                  <div className={`p-2 rounded ${q.correctAnswer === 'B' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                    B. {q.optionB}
                  </div>
                  <div className={`p-2 rounded ${q.correctAnswer === 'C' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                    C. {q.optionC}
                  </div>
                  <div className={`p-2 rounded ${q.correctAnswer === 'D' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                    D. {q.optionD}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Question Form */}
        {!showQuestionForm && (
          <button
            onClick={() => setShowQuestionForm(true)}
            className="btn-primary mt-6 w-full"
          >
            Add Question
          </button>
        )}

        {showQuestionForm && (
          <form onSubmit={handleAddQuestion} className="mt-6 pt-6 border-t border-gray-200">
            <FormField
              label="Question Text"
              type="textarea"
              value={formData.questionText}
              onChange={handleChange}
              placeholder="Enter the question"
              name="questionText"
              required
              disabled={submitting}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Option A"
                value={formData.optionA}
                onChange={handleChange}
                placeholder="Option A"
                name="optionA"
                required
                disabled={submitting}
              />
              <FormField
                label="Option B"
                value={formData.optionB}
                onChange={handleChange}
                placeholder="Option B"
                name="optionB"
                required
                disabled={submitting}
              />
              <FormField
                label="Option C"
                value={formData.optionC}
                onChange={handleChange}
                placeholder="Option C"
                name="optionC"
                required
                disabled={submitting}
              />
              <FormField
                label="Option D"
                value={formData.optionD}
                onChange={handleChange}
                placeholder="Option D"
                name="optionD"
                required
                disabled={submitting}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Correct Answer
              </label>
              <select
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleChange}
                className="input-field"
                disabled={submitting}
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add Question'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowQuestionForm(false);
                  setFormData({
                    questionText: '',
                    optionA: '',
                    optionB: '',
                    optionC: '',
                    optionD: '',
                    correctAnswer: 'A',
                  });
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Link to="/my-exams" className="btn-secondary flex-1 text-center">
          Back to Exams
        </Link>
      </div>
    </div>
  );
};

export default EditExam;
