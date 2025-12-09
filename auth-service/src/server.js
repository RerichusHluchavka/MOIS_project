const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { Pool } = require('pg');
const { authenticateToken } = require('../auth-middleware');

const app = express();
app.use(express.json());
app.use(cors());

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'auth-db',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'auth_db',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin',
});

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'jwt-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Initialize database tables
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL
      )
    `);

    // Create default users if they don't exist
    const hashedPassword = await bcrypt.hash('password', 10);

    const defaultUsers = [
      { username: 'admin',     password: hashedPassword, role: 'admin' },
      { username: 'kitchen',   password: hashedPassword, role: 'kitchen' },
      { username: 'inventory', password: hashedPassword, role: 'inventory' },
      { username: 'prison',    password: hashedPassword, role: 'prison' }
    ];

    for (const user of defaultUsers) {
      await pool.query(
        'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING',
        [user.username, user.password, user.role]
      );
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Find user in database
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Token verification endpoint
app.post('/verify', (req, res) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ')
      ? header.split(' ')[1]
      : header;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, error: 'Invalid token' });
  }
});

// Create new user - only admin can do it
app.post('/users', authenticateToken(['admin']), async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Validate input
    if (!username || !password || !role) {
      return res.status(400).json({
        error: 'Username, password, and role are required'
      });
    }

    // Validate role
    const validRoles = ['admin', 'kitchen', 'inventory', 'prison'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        error: 'Invalid role. Must be one of: admin, kitchen, inventory, prison'
      });
    }

    // Check if username already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, hashedPassword, role]
    );

    const newUser = result.rows[0];

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users - only admin can do it
app.get('/users', authenticateToken(['admin']), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, role FROM users ORDER BY id'
    );

    res.json({
      users: result.rows
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change user role - only admin can do it
app.patch('/users/:id/role', authenticateToken(['admin']), async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { role } = req.body;

    const validRoles = ['admin', 'kitchen', 'inventory', 'prison'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, role',
      [role, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Change role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user - only admin can do it
app.delete('/users/:id', authenticateToken(['admin']), async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Prevent admin from deleting themselves
    if (userId === req.user.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Check if user exists
    const userCheck = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Auth service is running' });
});

// Initialize database and start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Auth service running on port ${PORT}`);
  await initializeDatabase();
});
