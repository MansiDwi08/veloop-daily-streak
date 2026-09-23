const express = require('express');
const StreakReward = require('../models/StreakReward');
const User = require('../models/User');
const Streak = require('../models/Streak');
const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/WalletTransaction');
const authMiddleware = require('../middleware/auth');
const mongoose = require('mongoose');
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
  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      const user = await User.findById(req.user.userId).session(session);

      if (!user) {
        throw new Error('USER_NOT_FOUND');
      }

      const streak = await Streak.findOne({
        userId: user._id,
      }).session(session);

      const wallet = await Wallet.findOne({
        userId: user._id,
      }).session(session);

      if (!streak || !wallet) {
        throw new Error('STREAK_OR_WALLET_NOT_FOUND');
      }

      const now = new Date();

      // Backend controls eligibility
      if (streak.nextClaimAt !== null) {
        // Claim window expired - reset streak
        if (now > streak.nextClaimAt) {
          streak.currentStreak = 1;
          streak.currentDay = 1;
          streak.lastClaimAt = null;
          streak.nextClaimAt = null;
          streak.status = 'ACTIVE';

          await streak.save({ session });
        } else {
          throw new Error('REWARD_LOCKED');
        }
      }

      const claimedDay = streak.currentDay;

      // Prevent duplicate claim for the same streak day
      const existingTransaction = await WalletTransaction.findOne({
        userId: user._id,
        source: 'DAILY_STREAK',
        cycleId: streak.cycleId,
        streakDay: claimedDay,
      }).session(session);

      if (existingTransaction) {
        throw new Error('ALREADY_CLAIMED');
      }

      const reward = await StreakReward.findOne({
        day: claimedDay,
        isActive: true,
      }).session(session);

      if (!reward) {
        throw new Error('REWARD_NOT_FOUND');
      }

      const balanceBefore = wallet.balance;

      // Add VE reward to wallet
      if (reward.rewardType === 'VE') {
        wallet.balance += reward.amount;

        await wallet.save({ session });
      }

      const balanceAfter = wallet.balance;

      const timestamp = Date.now();

      const transactionId = `STREAK-${user._id}-${claimedDay}-${timestamp}`;
      const referenceId = `DAY-${claimedDay}-${timestamp}`;

      await WalletTransaction.create(
          [
            {
              transactionId,
              userId: user._id,
              rewardType: reward.rewardType,
              rewardStatus:
                  reward.rewardType === 'VE'
                      ? 'CREDITED'
                      : 'PENDING',
              amount: reward.amount,
              currency: reward.currency,
              source: 'DAILY_STREAK',
              streakDay: claimedDay,
              cycleId: streak.cycleId,
              referenceId,
              balanceBefore,
              balanceAfter,
            },
          ],
          { session }
      );

      streak.lastClaimAt = now;

      // Move to next day
      if (claimedDay < 7) {
        streak.currentDay = claimedDay + 1;
        streak.currentStreak += 1;

        // 24-hour backend-controlled lock
        streak.nextClaimAt = new Date(
            now.getTime() + 24 * 60 * 60 * 1000
        );
      } else {
        streak.status = 'COMPLETED';
        streak.nextClaimAt = null;
      }

      await streak.save({ session });

      result = {
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
        claimedDay,
      };
    });

    return res.json({
      success: true,
      message: `Day ${result.claimedDay} reward claimed successfully`,
      reward: result.reward,
      wallet: result.wallet,
      streak: result.streak,
      transactionId: result.transactionId,
    });
  } catch (error) {
    console.error(
        'Error claiming streak reward:',
        error.message
    );

    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: 'Test user not found',
      });
    }

    if (error.message === 'STREAK_OR_WALLET_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: 'Streak or wallet not found',
      });
    }

    if (error.message === 'REWARD_LOCKED') {
      const streak = await Streak.findOne({
        userId: req.user.userId,
      });

      return res.status(400).json({
        success: false,
        message: 'Reward is currently locked',
        nextClaimAt: streak?.nextClaimAt || null,
      });
    }

    if (error.message === 'ALREADY_CLAIMED') {
      return res.status(400).json({
        success: false,
        message: 'Today’s reward has already been claimed',
      });
    }

    if (error.message === 'REWARD_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: 'Reward not found',
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Today’s reward has already been claimed',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to claim streak reward',
    });
  } finally {
    await session.endSession();
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
