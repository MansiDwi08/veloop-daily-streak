const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Wallet = require('./models/Wallet');
const Streak = require('./models/Streak');

const seedUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('MongoDB connected!');

        const hashedPassword = await bcrypt.hash('Test@12345', 10);

        let user = await User.findOne({
            email: 'test@veloop.com',
        });

        if (!user) {
            user = await User.create({
                name: 'Test User',
                email: 'test@veloop.com',
                password: hashedPassword,
            });

            console.log('Test user created!');
        } else {
            console.log('Test user already exists.');
        }

        let wallet = await Wallet.findOne({
            userId: user._id,
        });

        if (!wallet) {
            wallet = await Wallet.create({
                userId: user._id,
                balance: 0,
                currency: 'VE',
            });

            console.log('Test wallet created!');
        } else {
            console.log('Test wallet already exists.');
        }

        let streak = await Streak.findOne({
            userId: user._id,
        });

        if (!streak) {
            streak = await Streak.create({
                userId: user._id,
                currentStreak: 1,
                currentDay: 1,
                lastClaimAt: null,
                nextClaimAt: null,
                status: 'ACTIVE',
            });

            console.log('Test streak created!');
        } else {
            console.log('Test streak already exists.');
        }

        console.log('Test user setup completed!');

        await mongoose.connection.close();

        console.log('MongoDB connection closed.');
    } catch (error) {
        console.error('Error creating test user:', error.message);
        process.exit(1);
    }
};

seedUser();