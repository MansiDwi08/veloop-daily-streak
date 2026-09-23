const mongoose = require('mongoose');

const streakSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },

        cycleId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            default: () => new mongoose.Types.ObjectId(),
        },

        currentStreak: {
            type: Number,
            default: 1,
        },

        currentDay: {
            type: Number,
            default: 1,
        },

        lastClaimAt: {
            type: Date,
            default: null,
        },

        nextClaimAt: {
            type: Date,
            default: null,
        },

        status: {
            type: String,
            enum: ['ACTIVE', 'COMPLETED', 'MISSED'],
            default: 'ACTIVE',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Streak', streakSchema);