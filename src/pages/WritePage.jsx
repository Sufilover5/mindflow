import { useNavigate, useParams } from 'react-router-dom';
import { useThoughts } from '../hooks/useThoughts';
import { ThoughtForm } from '../components/ThoughtForm';
import './WritePage.css';

export function WritePage() {
  const { id } = useParams();
  const { getThought, addThought, updateThought } = useThoughts();
  const navigate = useNavigate();

  const thought = id ? getThought(id) : null;

  const handleSave = (data) => {
    if (id) {
      updateThought(id, data);
    } else {
      addThought(data);
    }
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="write-page container">
      <ThoughtForm
        initialData={thought}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
