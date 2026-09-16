const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();
const dailyStreakRoutes = require('./routes/dailyStreak');
const authRoutes = require('./routes/auth');
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/daily-streak', dailyStreakRoutes);
app.use('/api/auth', authRoutes);
// Test route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'VELoop Rewards backend is running!'
    });
});
//MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected successfully!');
    })
    .catch((error) => {
        console.error('MongoDB connection failed:', error.message);
    });
// Start server
app.listen(PORT, () => {
    console.log(`VELoop backend running on http://localhost:${PORT}`);
});
