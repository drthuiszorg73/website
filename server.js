const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const logRoutes = require('./routes/log');

const app = express();

// Middleware
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/logs', logRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('MongoDB connection error:', error));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));