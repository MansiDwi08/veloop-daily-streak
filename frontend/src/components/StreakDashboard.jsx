import { useEffect, useState } from 'react';
import { getRewards } from '../services/streakApi';
import '../App.css';
console.log("🔥 MANSI STREAK FILE LOADED");

function StreakDashboard() {
    const [countdown, setCountdown] = useState('');
    const [status, setStatus] = useState(null);
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [showAd, setShowAd] = useState(false);
    const token = localStorage.getItem('token');

    const loadStatus = async () => {
        try {
            const response = await fetch(
                'http://localhost:5001/api/daily-streak/status',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to load streak');
            }

            setStatus(data);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClaim = async () => {
        setShowAd(true);
    };

    useEffect(() => {
        loadStatus();
    }, []);

    useEffect(() => {
        const loadRewards = async () => {
            try {
                const data = await getRewards();

                setRewards(Array.isArray(data) ? data : data.rewards || []);
            } catch (error) {
                console.error('Failed to load rewards:', error);
            }
        };

        loadRewards();
    }, []);

    useEffect(() => {
        if (!status?.streak?.nextClaimAt) {
            setCountdown('');
            return;
        }

        const updateCountdown = () => {
            const target = new Date(
                status.streak.nextClaimAt
            ).getTime();

            const difference = target - Date.now();

            if (difference <= 0) {
                setCountdown('Reward available');
                return;
            }

            const totalSeconds = Math.floor(difference / 1000);

            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor(
                (totalSeconds % 3600) / 60
            );
            const seconds = totalSeconds % 60;

            setCountdown(
                `${hours}h ${minutes}m ${seconds}s`
            );
        };

        updateCountdown();

        const timer = setInterval(updateCountdown, 1000);

        return () => clearInterval(timer);
    }, [status]);

    if (loading) {
        return (
            <p className="text-center mt-5">
                Loading streak...
            </p>
        );
    }

    if (message) {
        return (
            <p className="text-center mt-5">
                {message}
            </p>
        );
    }

    return (
        <div className="container mt-5">

            <div className="text-center">
                <h1>🔥 DAILY STREAK TEST</h1>
                <p>Keep your streak alive and earn rewards!</p>
            </div>

            <div className="row justify-content-center mt-4">

                <div className="col-md-4">
                    <div className="card p-4 text-center shadow">
                        <h5>Current Streak</h5>
                        <h2>
                            {status.streak.currentStreak} Days
                        </h2>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card p-4 text-center shadow">
                        <h5>Current Day</h5>
                        <h2>
                            Day {status.streak.currentDay}
                        </h2>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card p-4 text-center shadow">
                        <h5>Wallet Balance</h5>
                        <h2>
                            {status.wallet.balance}{' '}
                            {status.wallet.currency}
                        </h2>
                    </div>
                </div>

            </div>

            <div className="card p-4 mt-4 text-center shadow">

                <h3>Today's Reward</h3>

                <h2>{status.today.reward.title}</h2>

                <p>
                    Reward: {status.today.reward.amount}{' '}
                    {status.today.reward.currency}
                </p>

                {countdown && (
                    <p className="mt-3">
                        ⏳ Next reward available in:{' '}
                        <strong>{countdown}</strong>
                    </p>
                )}

                <button
                    className="btn btn-primary"
                    disabled={!status.today.eligible}
                    onClick={handleClaim}
                >
                    {status.today.eligible
                        ? "Claim Today's Reward"
                        : 'Reward Locked'}
                </button>

            </div>

            {showAd && (
                <div className="card p-4 mt-4 text-center shadow">
                    <h3>📺 CPA Ad Demo</h3>

                    <p className="mt-3">
                        Watch this demo advertisement to continue
                        with your reward claim.
                    </p>

                    <div className="p-4 my-3 bg-secondary rounded">
                        <h4>ADVERTISEMENT</h4>
                        <p className="mb-0">
                            Demo CPA Ad Placeholder
                        </p>
                    </div>

                    <button
                        className="btn btn-success"
                        onClick={async () => {
                            setShowAd(false);

                            try {
                                const response = await fetch(
                                    'http://localhost:5001/api/daily-streak/claim',
                                    {
                                        method: 'POST',
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    }
                                );

                                const data = await response.json();

                                if (!response.ok) {
                                    throw new Error(data.message || 'Claim failed');
                                }

                                alert(data.message);
                                loadStatus();
                            } catch (error) {
                                alert(error.message);
                            }
                        }}
                    >
                        ✓ Complete Demo Ad
                    </button>
                </div>
            )}

            <div className="mt-5">

                <h3 className="text-center mb-4">
                    7-Day Rewards
                </h3>


                <div className="row g-3">

                    {rewards.map((reward) => {
                        const isClaimed =
                            reward.day < status.streak.currentDay;

                        const isCurrent =
                            reward.day === status.streak.currentDay;

                        const isLocked =
                            reward.day > status.streak.currentDay;

                        return (
                            <div
                                className="col-md-6 col-lg-3"
                                key={reward.day}
                            >
                                <div
                                    className={`reward-card ${
                                        isClaimed
                                            ? 'claimed'
                                            : isCurrent
                                                ? 'current'
                                                : 'locked'
                                    }`}
                                >
                                    {isClaimed && (
                                        <p className="reward-status-claimed">
                                            ✓ Claimed
                                        </p>
                                    )}

                                    {isCurrent && (
                                        <p className="reward-status-current">
                                            ● CURRENT DAY
                                        </p>
                                    )}

                                    {isLocked && (
                                        <p className="reward-status-locked">
                                            🔒 Locked
                                        </p>
                                    )}

                                    <span>Day {reward.day}</span>

                                    <h3>{reward.title}</h3>

                                    <p>
                                        {reward.amount} {reward.currency}
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                </div>

            </div>

        </div>
    );
}

export default StreakDashboard;

