import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project');
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Admin Dashboard</h1>
        <Link to="/admin/create" style={{
          background: '#007bff',
          color: 'white',
          padding: '10px 20px',
          textDecoration: 'none',
          borderRadius: '4px'
        }}>
          + Create New Project
        </Link>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Title</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Tech Stack</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Featured</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Published</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project.id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{project.title}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{project.techStack}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{project.featured ? '✅' : '❌'}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{project.published ? '✅' : '❌'}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                <Link to={`/admin/edit/${project.id}`} style={{ marginRight: '10px' }}>✏️ Edit</Link>
                <button onClick={() => handleDelete(project.id)} style={{
                  background: 'red',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;