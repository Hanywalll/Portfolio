const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes (no auth required)
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);

// Protected routes (auth required)
router.post('/', authMiddleware, upload.single('image'), projectController.createProject);
router.put('/:id', authMiddleware, upload.single('image'), projectController.updateProject);
router.delete('/:id', authMiddleware, projectController.deleteProject);

module.exports = router;
