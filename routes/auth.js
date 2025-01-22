const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    console.log('Register route hit with username:', username);

    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists!' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log('Registration - Original password:', password);
        console.log('Registration - Hashed password:', hashedPassword);
        const user = new User({
            username,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({
            message: 'User registered successfully!',
            debug: {
                username,
                hashedPassword
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    console.log('Login route hit - Request body:', req.body);

    try {
        const { username, password } = req.body;

        if (!username || !password) {
            console.log('Missing credentials');
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign(
                { userId: user._id, isAdmin: username === 'admin' },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            return res.json({ token });
        }

        return res.status(400).json({ message: 'Invalid credentials' });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;