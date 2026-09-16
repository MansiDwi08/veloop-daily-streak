const mongoose = require('mongoose');

const walletTransactionSchema = new mongoose.Schema(
    {
        transactionId: {
            type: String,
            required: true,
            unique: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },

        rewardType: {
            type: String,
            required: true,
        },

        rewardStatus: {
            type: String,
            enum: ['CREDITED', 'PENDING', 'FULFILLED'],
            default: 'CREDITED',
        },

        amount: {
            type: Number,
            required: true,
        },

        currency: {
            type: String,
            required: true,
        },

        source: {
            type: String,
            default: 'DAILY_STREAK',
        },

        streakDay: {
            type: Number,
            required: true,
        },

        referenceId: {
            type: String,
            required: true,
        },

        balanceBefore: {
            type: Number,
            required: true,
        },

        balanceAfter: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    'WalletTransaction',
    walletTransactionSchema
);