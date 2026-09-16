const mongoose = require('mongoose');
require('dotenv').config();

const StreakReward = require('./models/StreakReward');

const rewards = [
    {
        day: 1,
        rewardType: 'VE',
        amount: 5,
        currency: 'VE',
        title: '+5 VEs',
    },
    {
        day: 2,
        rewardType: 'VE',
        amount: 10,
        currency: 'VE',
        title: '+10 VEs',
    },
    {
        day: 3,
        rewardType: 'VE',
        amount: 15,
        currency: 'VE',
        title: '+15 VEs',
    },
    {
        day: 4,
        rewardType: 'GIFT_CARD',
        amount: 1,
        currency: 'INR',
        title: '₹1 Amazon Gift Card',
    },
    {
        day: 5,
        rewardType: 'GIFT_CARD',
        amount: 2,
        currency: 'INR',
        title: '₹2 Amazon Gift Card',
    },
    {
        day: 6,
        rewardType: 'VE',
        amount: 30,
        currency: 'VE',
        title: '+30 VEs',
    },
    {
        day: 7,
        rewardType: 'GIFT_CARD',
        amount: 5,
        currency: 'INR',
        title: '₹5 Amazon Gift Card',
    },
];

const seedRewards = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('MongoDB connected!');

        await StreakReward.deleteMany({});

        await StreakReward.insertMany(rewards);

        console.log('7 daily streak rewards inserted successfully!');

        await mongoose.connection.close();

        console.log('MongoDB connection closed.');
    } catch (error) {
        console.error('Error seeding rewards:', error.message);
        process.exit(1);
    }
};

seedRewards();