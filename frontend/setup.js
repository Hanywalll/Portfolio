const fs = require('fs');
const path = require('path');

// Folder structure
const pagesDir = path.join(__dirname, 'src', 'pages');
const componentsDir = path.join(__dirname, 'src', 'components');

// Create folders if not exist
if (!fs.existsSync(pagesDir)) fs.mkdirSync(pagesDir, { recursive: true });
if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });

// File contents
const files = {
  'src/pages/AdminDashboard.jsx': `import { useState, useEffect } from 'react';
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
        await axios.delete(\`/api/projects/\${id}\`, {
          headers: { Authorization: \`Bearer \${token}\` }
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
                <Link to={\`/admin/edit/\${project.id}\`} style={{ marginRight: '10px' }}>✏️ Edit</Link>
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

export default AdminDashboard;`,

  'src/pages/CreateProject.jsx': `import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateProject() {
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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/projects', formData, {
        headers: { Authorization: \`Bearer \${token}\` }
      });
      alert('Project created successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px' }}>
      <h1>Create New Project</h1>
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
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
}

export default CreateProject;`,

  'src/pages/EditProject.jsx': `import { useState, useEffect } from 'react';
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
      const response = await axios.get(\`/api/projects/\${id}\`);
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
      await axios.put(\`/api/projects/\${id}\`, formData, {
        headers: { Authorization: \`Bearer \${token}\` }
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

export default EditProject;`,

  'src/components/ProtectedRoute.jsx': `import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;`,

  'src/components/Navbar.jsx': `import { Link } from 'react-router-dom';

function Navbar() {
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav style={{
      padding: '15px 30px',
      background: '#333',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
          My Portfolio
        </Link>
      </div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        {isLoggedIn ? (
          <>
            <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
            <button onClick={handleLogout} style={{
              background: 'red',
              color: 'white',
              border: 'none',
              padding: '5px 15px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;`
};

// Create all files
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ Created: ${filePath}`);
});

console.log('\n🎉 All files created successfully!');
console.log('\nFiles created:');
console.log('  - src/pages/AdminDashboard.jsx');
console.log('  - src/pages/CreateProject.jsx');
console.log('  - src/pages/EditProject.jsx');
console.log('  - src/components/ProtectedRoute.jsx');
console.log('  - src/components/Navbar.jsx');