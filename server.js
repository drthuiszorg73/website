const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const logRoutes = require('./routes/logs');
const { protect } = require('./middleware/auth');
const path = require('path');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware configuration
app.use(cors({
    origin: 'https://website-h8qt.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files serving
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/logs', logRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
    res.send("Backend is working");
});

// Protected admin route
app.get('/api/admin/logs', protect, (req, res) => {
    if (req.user?.isAdmin) {
        res.json({ message: 'Admin logs view' });
    } else {
        res.status(403).json({ message: 'Unauthorized' });
    }
});

// Client-side routing handler (MUST BE LAST ROUTE)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});