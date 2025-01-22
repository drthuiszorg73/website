const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            console.log('Decoded JWT in middleware:', decoded);

            const user = await User.findById(decoded.userId).select('-password');

            if (!user) {
                console.error('User not found with ID:', decoded.userId);
                return res.status(401).json({ message: 'User not found' });
            }

            req.user = user;
            next();
        } catch (err) {
            console.error('Token verification failed:', err);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
};