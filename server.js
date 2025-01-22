const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const logRoutes = require('./routes/logs');
const { protect } = require('./middleware/auth');
const path = require('path');
require('dotenv').config();

const app = express();

connectDB();

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://website-h8qt.vercel.app/' : '*',
  credentials: true,
}));
app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api/auth', authRoutes);

app.use('/api/logs', logRoutes);

app.get('/api/user/logs', protect, (req, res) => {
    if (req.user && req.user.isAdmin) {
        res.send('Admin view logs here');
    } else {
        res.send('User view their own logs here');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});