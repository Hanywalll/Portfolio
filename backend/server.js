const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import database to initialize connection
const sequelize = require('./models/index');

// Import models to ensure they're registered
const Admin = require('./models/Admin');
const Project = require('./models/Project');

// Import routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Portfolio CMS API',
    version: '1.0.0',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me (protected)',
        logout: 'POST /api/auth/logout (protected)'
      },
      projects: {
        getAll: 'GET /api/projects',
        getById: 'GET /api/projects/:id',
        create: 'POST /api/projects (protected)',
        update: 'PUT /api/projects/:id (protected)',
        delete: 'DELETE /api/projects/:id (protected)'
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Sync database and start server
const initializeServer = async () => {
  try {
    // Sync database (creates tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized successfully');

    // Check if admin exists, if not create default admin
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
      
      await Admin.create({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: hashedPassword,
        email: 'admin@portfolio.com'
      });
      
      console.log('✅ Default admin user created');
      console.log(`   Username: ${process.env.ADMIN_USERNAME || 'admin'}`);
      console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to initialize server:', error);
    process.exit(1);
  }
};

initializeServer();

module.exports = app;
