const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            unique: true,
            ref: 'User',
        },

        balance: {
            type: Number,
            default: 0,
            min: 0,
        },

        currency: {
            type: String,
            default: 'VE',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Wallet', walletSchema);