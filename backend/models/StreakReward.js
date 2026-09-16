const mongoose = require('mongoose');

const streakRewardSchema = new mongoose.Schema(
    {
        day: {
            type: Number,
            required: true,
            unique: true,
            min: 1,
            max: 7,
        },

        rewardType: {
            type: String,
            enum: ['VE', 'GIFT_CARD'],
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        currency: {
            type: String,
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('StreakReward', streakRewardSchema);