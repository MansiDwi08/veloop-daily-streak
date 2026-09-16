const express = require('express');
const StreakReward = require('../models/StreakReward');
const User = require('../models/User');
const Streak = require('../models/Streak');
const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/WalletTransaction');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);
// Get all daily streak rewards
router.get('/rewards', async (req, res) => {
  try {
    const rewards = await StreakReward.find({ isActive: true })
      .sort({ day: 1 });

    res.json({
      success: true,
      rewards,
    });
  } catch (error) {
    console.error('Error fetching streak rewards:', error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch streak rewards',
    });
  }
});

// Get daily streak status
router.get('/status', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Test user not found',
      });
    }

    const streak = await Streak.findOne({
      userId: user._id,
    });

    const wallet = await Wallet.findOne({
      userId: user._id,
    });

    if (!streak) {
      return res.status(404).json({
        success: false,
        message: 'Streak not found',
      });
    }
    const now = new Date();

// Check if the claim window has expired
    if (
        streak.nextClaimAt !== null &&
        now > streak.nextClaimAt
    ) {
      streak.currentStreak = 1;
      streak.currentDay = 1;
      streak.lastClaimAt = null;
      streak.nextClaimAt = null;
      streak.status = 'ACTIVE';

      await streak.save();
    }

    const currentReward = await StreakReward.findOne({
      day: streak.currentDay,
      isActive: true,
    });

    res.json({
      success: true,
      serverTime: new Date(),
      streak: {
        currentStreak: streak.currentStreak,
        currentDay: streak.currentDay,
        status: streak.status,
        lastClaimAt: streak.lastClaimAt,
        nextClaimAt: streak.nextClaimAt,
      },
      today: {
        eligible: streak.nextClaimAt === null,
        claimed: streak.lastClaimAt !== null,
        reward: currentReward,
      },
      wallet: {
        balance: wallet ? wallet.balance : 0,
        currency: wallet ? wallet.currency : 'VE',
      },
    });
  } catch (error) {
    console.error('Error fetching streak status:', error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch streak status',
    });
  }
});

// Claim today's streak reward
router.post('/claim', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Test user not found',
      });
    }

    const streak = await Streak.findOne({
      userId: user._id,
    });

    const wallet = await Wallet.findOne({
      userId: user._id,
    });

    if (!streak || !wallet) {
      return res.status(404).json({
        success: false,
        message: 'Streak or wallet not found',
      });
    }

    // Backend controls eligibility
    // Backend controls eligibility
    if (streak.nextClaimAt !== null) {
      const now = new Date();

      // Claim window expired - reset streak
      if (now > streak.nextClaimAt) {
        streak.currentStreak = 1;
        streak.currentDay = 1;
        streak.lastClaimAt = null;
        streak.nextClaimAt = null;
        streak.status = 'ACTIVE';

        await streak.save();
      } else {
        return res.status(400).json({
          success: false,
          message: 'Reward is currently locked',
          nextClaimAt: streak.nextClaimAt,
        });
      }
    }

    const reward = await StreakReward.findOne({
      day: streak.currentDay,
      isActive: true,
    });

    if (!reward) {
      return res.status(404).json({
        success: false,
        message: 'Reward not found',
      });
    }

    const balanceBefore = wallet.balance;

    // Add VE reward to wallet
    if (reward.rewardType === 'VE') {
      wallet.balance += reward.amount;
      await wallet.save();
    }

    const balanceAfter = wallet.balance;

    const transactionId = `STREAK-${Date.now()}`;
    const referenceId = `DAY-${streak.currentDay}-${Date.now()}`;

    await WalletTransaction.create({
      transactionId,
      userId: user._id,
      rewardType: reward.rewardType,
      rewardStatus: reward.rewardType === 'VE'
          ? 'CREDITED'
          : 'PENDING',
      amount: reward.amount,
      currency: reward.currency,
      source: 'DAILY_STREAK',
      streakDay: streak.currentDay,
      referenceId,
      balanceBefore,
      balanceAfter,
    });

    const claimedDay = streak.currentDay;

    streak.lastClaimAt = new Date();

    // Move to next day
    if (streak.currentDay < 7) {
      streak.currentDay += 1;
      streak.currentStreak += 1;

      // 24-hour backend-controlled lock
      streak.nextClaimAt = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      );
    } else {
      streak.status = 'COMPLETED';
      streak.nextClaimAt = null;
    }

    await streak.save();

    res.json({
      success: true,
      message: `Day ${claimedDay} reward claimed successfully`,
      reward,
      wallet: {
        balance: wallet.balance,
        currency: wallet.currency,
      },
      streak: {
        currentStreak: streak.currentStreak,
        currentDay: streak.currentDay,
        status: streak.status,
        nextClaimAt: streak.nextClaimAt,
      },
      transactionId,
    });
  } catch (error) {
    console.error('Error claiming streak reward:', error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to claim streak reward',
    });
  }
});

// Get daily streak transaction history
router.get('/history', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Test user not found',
      });
    }

    const transactions = await WalletTransaction.find({
      userId: user._id,
      source: 'DAILY_STREAK',
    })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      transactions,
    });
  } catch (error) {
    console.error('Error fetching transaction history:', error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction history',
    });
  }
}); module.exports = router;
