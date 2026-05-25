const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {
  // Login
  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username and password are required'
        });
      }

      // Find admin by username
      const admin = await Admin.findOne({ where: { username } });

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, admin.password);

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: admin.id, username: admin.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: admin.id,
            username: admin.username,
            email: admin.email
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during login'
      });
    }
  }

  // Get current user
  async me(req, res) {
    try {
      const admin = await Admin.findByPk(req.user.id, {
        attributes: ['id', 'username', 'email']
      });

      res.json({
        success: true,
        data: admin
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }

  // Logout (client-side token removal, but we can log it)
  async logout(req, res) {
    res.json({
      success: true,
      message: 'Logout successful'
    });
  }
}

module.exports = new AuthController();
