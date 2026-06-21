import { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch projects dari backend
    axios.get('/api/projects')
      .then(response => {
        setProjects(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>My Portfolio</h1>
      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {projects.map(project => (
            <div key={project.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <p><strong>Tech:</strong> {project.techStack}</p>
              {project.demoUrl && <a href={project.demoUrl} target="_blank">Demo</a>}
              {project.githubUrl && <a href={project.githubUrl} target="_blank" style={{ marginLeft: '10px' }}>GitHub</a>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;