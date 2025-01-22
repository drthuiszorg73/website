const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Log = require('../models/Log');

router.get('/', protect, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            // Regular user: get their own logs
            const logs = await Log.find({ user: req.user._id });
            res.json(logs);
        } else {
            // Admin: get all logs
            const logs = await Log.find().populate('user', 'name');
            res.json(logs);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', protect, async (req, res) => {
    try {
        req.body.user = req.user._id;
        const log = new Log(req.body);
        await log.save();
        res.status(201).json(log);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;