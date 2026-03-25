import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { examService } from '../services';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import FormField from '../components/FormField';
import Alert from '../components/Alert';

const CreateExam = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 60,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await examService.createExam(formData);
      navigate(`/edit-exam/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <Card title="Create New Exam">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}

          <form onSubmit={handleSubmit}>
            <FormField
              label="Exam Title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Mathematics Final Exam"
              name="title"
              required
              disabled={loading}
            />

            <FormField
              label="Description"
              type="textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the exam..."
              name="description"
              disabled={loading}
            />

            <FormField
              label="Duration (minutes)"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              name="duration"
              min="1"
              max="480"
              required
              disabled={loading}
            />

            <div className="flex gap-4 mt-8">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50 flex-1"
              >
                {loading ? 'Creating...' : 'Create Exam'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin-dashboard')}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateExam;
