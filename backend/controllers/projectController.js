const Project = require('../models/Project');
const fs = require('fs');
const path = require('path');

class ProjectController {
  // Get all projects (public)
  async getAllProjects(req, res) {
    try {
      const { published, featured } = req.query;
      const where = {};

      if (published !== undefined) {
        where.published = published === 'true';
      }

      if (featured !== undefined) {
        where.featured = featured === 'true';
      }

      const projects = await Project.findAll({
        where,
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        count: projects.length,
        data: projects
      });
    } catch (error) {
      console.error('Get projects error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error fetching projects'
      });
    }
  }

  // Get single project by ID (public)
  async getProjectById(req, res) {
    try {
      const project = await Project.findByPk(req.params.id);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      console.error('Get project error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error fetching project'
      });
    }
  }

  // Create new project (admin only)
  async createProject(req, res) {
    try {
      const { title, description, techStack, demoUrl, githubUrl, featured, published } = req.body;

      // Validate required fields
      if (!title || !description || !techStack) {
        return res.status(400).json({
          success: false,
          message: 'Title, description, and tech stack are required'
        });
      }

      // Get image URL from uploaded file
      let imageUrl = null;
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
      }

      const project = await Project.create({
        title,
        description,
        techStack,
        demoUrl,
        githubUrl,
        imageUrl,
        featured: featured || false,
        published: published !== undefined ? published : true
      });

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: project
      });
    } catch (error) {
      console.error('Create project error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error creating project'
      });
    }
  }

  // Update project (admin only)
  async updateProject(req, res) {
    try {
      const { id } = req.params;
      const { title, description, techStack, demoUrl, githubUrl, featured, published } = req.body;

      const project = await Project.findByPk(id);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      // Handle image upload
      let imageUrl = project.imageUrl;
      if (req.file) {
        // Delete old image if exists
        if (project.imageUrl && fs.existsSync(path.join(__dirname, '..', project.imageUrl))) {
          fs.unlinkSync(path.join(__dirname, '..', project.imageUrl));
        }
        imageUrl = `/uploads/${req.file.filename}`;
      }

      await project.update({
        title: title || project.title,
        description: description || project.description,
        techStack: techStack || project.techStack,
        demoUrl: demoUrl !== undefined ? demoUrl : project.demoUrl,
        githubUrl: githubUrl !== undefined ? githubUrl : project.githubUrl,
        imageUrl: imageUrl,
        featured: featured !== undefined ? featured : project.featured,
        published: published !== undefined ? published : project.published,
        updatedAt: new Date()
      });

      res.json({
        success: true,
        message: 'Project updated successfully',
        data: project
      });
    } catch (error) {
      console.error('Update project error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error updating project'
      });
    }
  }

  // Delete project (admin only)
  async deleteProject(req, res) {
    try {
      const { id } = req.params;

      const project = await Project.findByPk(id);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      // Delete associated image if exists
      if (project.imageUrl && fs.existsSync(path.join(__dirname, '..', project.imageUrl))) {
        fs.unlinkSync(path.join(__dirname, '..', project.imageUrl));
      }

      await project.destroy();

      res.json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error) {
      console.error('Delete project error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error deleting project'
      });
    }
  }
}

module.exports = new ProjectController();
