const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

require('dotenv').config();

router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            email: req.body.email, // Added email field
            password: hashedPassword
        });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] }); // Modified to allow login with username or email
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.cookie('token', token, { httpOnly: true }).json({ message: 'Login successful' });
    } else {
        res.status(400).json({ message: 'Failed to login' });
    }
});

// Delete user account
router.delete('/delete', authenticateToken, async (req, res) => {
    try {
        // Here's how to get it from the body:
        const { username } = req.body;

        // Find the user by username and delete
        const user = await User.findOneAndDelete({ username: username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}
// Get user details after logging in with token
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Error fetching user');
    }
});

module.exports = router;