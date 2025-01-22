const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const logRoutes = require('./routes/logs');
const { protect } = require('./middleware/auth');
const path = require('path');
require('dotenv').config();

// Initialize Express
const app = express();

// Database Connection with error handling
connectDB().catch(err => {
  console.error('Database connection failed:', err);
  process.exit(1);
});

// Enhanced CORS Configuration
app.use(cors({
  origin: 'https://website-h8qt.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static File Serving
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/logs', logRoutes);

// Add this ABOVE other routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Modify your catch-all route to THIS:
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'Endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Enhanced Test Endpoint
app.get('/api/test', (req, res) => {
  res.json({
    status: 'active',
    timestamp: new Date().toISOString(),
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Protected Admin Route with error handling
app.get('/api/admin/logs', protect, (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    res.json({ message: 'Admin logs view' });
  } catch (error) {
    console.error('Admin route error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Client-side Routing (Must be last)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Server Configuration
const PORT = process.env.PORT || 5000;

// Start Server only in non-Vercel environments
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

// Export for Vercel serverless functions
module.exports = app;