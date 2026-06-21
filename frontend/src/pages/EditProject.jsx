import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    demoUrl: '',
    githubUrl: '',
    imageUrl: '',
    featured: false,
    published: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`/api/projects/${id}`);
      setFormData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching project:', error);
      alert('Project not found');
      navigate('/admin');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/projects/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Project updated successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project');
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px' }}>
      <h1>Edit Project</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Tech Stack</label>
          <input
            type="text"
            name="techStack"
            value={formData.techStack}
            onChange={handleChange}
            placeholder="React, Node.js, MySQL"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Demo URL</label>
          <input
            type="url"
            name="demoUrl"
            value={formData.demoUrl}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>GitHub URL</label>
          <input
            type="url"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="/uploads/project.jpg"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
            />
            Featured Project
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
            />
            Published
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            width: '100%',
            padding: '10px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          {saving ? 'Saving...' : 'Update Project'}
        </button>
      </form>
    </div>
  );
}

export default EditProject;