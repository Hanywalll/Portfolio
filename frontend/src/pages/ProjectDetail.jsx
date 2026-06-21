import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/projects/${id}`)
      .then(response => {
        setProject(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching project:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!project) return <p>Project not found</p>;

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/">← Back to Home</Link>
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      <p><strong>Tech Stack:</strong> {project.techStack}</p>
      {project.imageUrl && <img src={project.imageUrl} alt={project.title} style={{ maxWidth: '100%' }} />}
      <div>
        {project.demoUrl && <a href={project.demoUrl} target="_blank">Live Demo</a>}
        {project.githubUrl && <a href={project.githubUrl} target="_blank" style={{ marginLeft: '10px' }}>GitHub</a>}
      </div>
    </div>
  );
}

export default ProjectDetail;