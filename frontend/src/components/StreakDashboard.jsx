import { useEffect, useState } from 'react';
import { getRewards } from '../services/streakApi';
import '../App.css';

function StreakDashboard() {
    const [countdown, setCountdown] = useState('');
    const [status, setStatus] = useState(null);
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [showAd, setShowAd] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const loadStatus = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/daily-streak/status`,
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

    const handleClaim = () => {
        setShowAd(true);
    };

    useEffect(() => {
        loadStatus();
    }, []);

    useEffect(() => {
        const loadRewards = async () => {
            try {
                const data = await getRewards();
                setRewards(
                    Array.isArray(data)
                        ? data
                        : data.rewards || []
                );
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
            <div className="dashboard-page loading-screen">
                <div className="loading-content">
                    <div className="loading-spinner"></div>
                    <p>Loading your rewards...</p>
                </div>
            </div>
        );
    }

    if (message) {
        return (
            <div className="dashboard-page loading-screen">
                <p>{message}</p>
            </div>
        );
    }

    const currentDay = status.streak.currentDay;
    const currentStreak = status.streak.currentStreak;
    const walletBalance = status.wallet.balance;
    const walletCurrency = status.wallet.currency;

    return (
        <div className="dashboard-page">

            {/* Header */}
            <header className="veloop-header">
                <div className="brand">
                    <span className="brand-dot"></span>
                    <span>VELoop</span>
                </div>

                <div className="header-actions">

                    <div className="header-status">
                        <span>Daily Rewards</span>
                    </div>

                    <button
                        className="profile-btn"
                        onClick={() => setShowProfile(true)}
                        aria-label="Open profile"
                    >
                        <img
                            className="profile-avatar"
                            src="/images/profile-placeholder.png"
                            alt="Profile"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling.style.display = 'flex';
                            }}
                        />

                        <span
                            className="profile-avatar-fallback"
                            style={{ display: 'none' }}
                        >
                              M
                        </span>
                    </button>

                </div>
            </header>


            <main className="dashboard-container">

                {/* Mobile Greeting */}
                <div className="mobile-greeting">
                    <div>
                        <h2>Hi, {user.name || 'Mansi'} 👋</h2>
                        <p>Keep your streak alive!</p>
                    </div>

                    <div className="mobile-coin-pill">
                        <img src="/images/VEs_Coin.png" alt="VE Coin" />
                        <span>{walletBalance} VE</span>
                    </div>
                </div>

                {/* Hero */}
                <section className="streak-hero">

                    <div className="hero-content">

                        <p className="hero-label">
                            DAILY STREAK
                        </p>

                        <h1>
                            Login Daily
                            <br />
                            <span>Earn Bigger Rewards!</span>
                        </h1>

                        <p className="hero-description">
                            Keep your streak alive, check in every day,
                            and unlock bigger rewards with VELoop.
                        </p>

                        <div className="hero-stats">

                            <div className="hero-stat">
                                <span className="hero-stat-icon">🎁</span>

                                <div>
                                    <span>Total Rewards</span>
                                    <strong>7 Days</strong>
                                </div>
                            </div>

                            <div className="hero-stat">
                                <span className="hero-stat-icon">🔥</span>

                                <div>
                                    <span>Checked In</span>
                                    <strong>
                                        {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
                                    </strong>
                                </div>
                            </div>

                            <div className="hero-stat">
                                <span className="hero-stat-icon">💰</span>

                                <div>
                                    <span>Wallet Balance</span>
                                    <strong>
                                        {walletBalance} {walletCurrency}
                                    </strong>
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className="hero-visual">
                        <img
                            src="/images/Bigger_Streak.png"
                            alt="Daily streak rewards"
                        />
                    </div>

                </section>

                {/* Today's reward */}
                <section className="today-section">

                    <div className="section-heading">
                        <div>
                            <p className="section-label">
                                TODAY'S REWARD
                            </p>

                            <h2>
                                Day {currentDay}
                            </h2>
                        </div>

                        <span className="current-badge">
            ● CURRENT
        </span>
                    </div>

                    <div className="today-card">

                        <div className="today-reward-left">

                            <div className="today-reward-icon">
                                {currentDay === 4 ||
                                currentDay === 5 ||
                                currentDay === 7 ? (
                                    <img
                                        src={`/images/Day-${currentDay}.png`}
                                        alt={`Day ${currentDay} reward`}
                                    />
                                ) : (
                                    <img
                                        src="/images/VEs_Coin.png"
                                        alt="VE Coin"
                                    />
                                )}
                            </div>

                            <div className="today-reward-info">

                                <h3>
                                    {status.today.reward.title}
                                </h3>

                                <p>
                                    {status.today.reward.amount}{' '}
                                    {status.today.reward.currency}
                                </p>

                                {countdown && !status.today.eligible && (
                                    <div className="countdown">
                                        ⏳ Next reward in{' '}
                                        <strong>{countdown}</strong>
                                    </div>
                                )}

                            </div>

                        </div>

                        <button
                            className="claim-btn"
                            disabled={!status.today.eligible}
                            onClick={handleClaim}
                        >
                            {status.today.eligible
                                ? "Claim Reward"
                                : "Reward Locked"}
                        </button>

                    </div>

                </section>
                {/* Profile Drawer */}
                {showProfile && (
                    <>
                        <div
                            className="profile-overlay"
                            onClick={() => setShowProfile(false)}
                        ></div>

                        <aside className="profile-drawer">

                            <div className="profile-drawer-header">
                                <div>
                                    <p className="section-label">MY ACCOUNT</p>
                                    <h2>Profile</h2>
                                </div>

                                <button
                                    className="profile-close"
                                    onClick={() => setShowProfile(false)}
                                >
                                    ×
                                </button>
                            </div>

                                    <div className="profile-user">
                                        <div className="profile-large-avatar">
                                            {user.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>

                                        <div>
                                            <h3>{user.name || 'VELoop User'}</h3>
                                            <p>{user.email || 'Account Dashboard'}</p>
                                        </div>
                                    </div>

                            <div className="profile-balance">
                                <span>Wallet Balance</span>
                                <strong>
                                    {walletBalance} {walletCurrency}
                                </strong>
                            </div>

                            <div className="profile-stats">

                                <div>
                                    <span>Current Streak</span>
                                    <strong>
                                        {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
                                    </strong>
                                </div>

                                <div>
                                    <span>Reward Day</span>
                                    <strong>Day {currentDay}</strong>
                                </div>

                            </div>

                            <div className="profile-menu">

                                <button
                                    onClick={() => {
                                        setShowProfile(false);
                                        alert('Transaction history will be available here.');
                                    }}
                                >
                                    <span>📜</span>
                                    <div>
                                        <strong>Transaction History</strong>
                                        <small>View your reward transactions</small>
                                    </div>
                                    <span>›</span>
                                </button>

                                <button>
                                    <span>⚙️</span>
                                    <div>
                                        <strong>Account Settings</strong>
                                        <small>Manage your account</small>
                                    </div>
                                    <span>›</span>
                                </button>

                            </div>

                            <button
                                className="logout-btn"
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('user');
                                    window.location.reload();
                                }}
                            >
                                🚪 Logout
                            </button>

                        </aside>
                    </>
                )}

                {/* CPA Demo */}
                {showAd && (
                    <section className="ad-section">

                        <div className="ad-card">

                            <div className="ad-icon">
                                📺
                            </div>

                            <div>
                                <span className="section-label">
                                    DEMO VERIFICATION
                                </span>

                                <h3>
                                    Complete the demo ad
                                </h3>

                                <p>
                                    This is a placeholder CPA
                                    advertisement for testing.
                                </p>
                            </div>

                            <button
                                className="complete-ad-btn"
                                onClick={async () => {
                                    setShowAd(false);

                                    try {
                                        const response =
                                            await fetch(
                                                `${import.meta.env.VITE_API_BASE_URL}/api/daily-streak/claim`,
                                                {
                                                    method: 'POST',
                                                    headers: {
                                                        Authorization:
                                                            `Bearer ${token}`,
                                                    },
                                                }
                                            );

                                        if (response.status === 401) {
                                            localStorage.removeItem('token');
                                            localStorage.removeItem('user');
                                            window.location.reload();
                                            return;
                                        }

                                        const data =
                                            await response.json();

                                        if (!response.ok) {
                                            throw new Error(
                                                data.message ||
                                                'Claim failed'
                                            );
                                        }

                                        alert(data.message);
                                        await loadStatus();
                                        await loadRewards();

                                    } catch (error) {
                                        alert(error.message);
                                    }
                                }}
                            >
                                ✓ Complete Demo Ad
                            </button>

                        </div>

                    </section>
                )}

                {/* 7 Day Rewards */}
                <section className="rewards-section">

                    <div className="section-heading centered">

                        <div>
                            <p className="section-label">
                                REWARD JOURNEY
                            </p>

                            <h2>
                                7 Days. 7 Rewards.
                            </h2>

                            <p className="section-description">
                                Complete each day to keep moving
                                forward.
                            </p>
                        </div>

                    </div>

                    <div className="reward-grid">

                        {rewards.map((reward) => {

                            const isClaimed =
                                reward.day < currentDay;

                            const isCurrent =
                                reward.day === currentDay;

                            const isLocked =
                                reward.day > currentDay;

                            const specialReward =
                                reward.day === 4 ||
                                reward.day === 5 ||
                                reward.day === 7;

                            let rewardImage =
                                '/images/VEs_Coin.png';

                            if (specialReward) {
                                rewardImage =
                                    `/images/Day-${reward.day}.png`;
                            }

                            return (
                                <div
                                    className={`reward-card ${
                                        isClaimed
                                            ? 'claimed'
                                            : isCurrent
                                                ? 'current'
                                                : 'locked'
                                    }`}
                                    key={reward.day}
                                >

                                    <div className="reward-top">

                                        <span className="day-number">
                                            DAY {reward.day}
                                        </span>

                                        {isClaimed && (
                                            <span className="status-badge claimed-badge">
                                                ✓
                                            </span>
                                        )}

                                        {isCurrent && (
                                            <span className="status-badge current-badge-small">
                                                NOW
                                            </span>
                                        )}

                                        {isLocked && (
                                            <span className="status-badge locked-badge">
                                                🔒
                                            </span>
                                        )}

                                    </div>

                                    <div className="reward-image">
                                        <img
                                            src={rewardImage}
                                            alt={reward.title}
                                        />
                                    </div>

                                    <h3>
                                        {reward.title}
                                    </h3>

                                    <p className="reward-value">
                                        {reward.amount}{' '}
                                        {reward.currency}
                                    </p>

                                </div>
                            );
                        })}

                    </div>

                </section>

                {/* Bottom feature cards */}
                <section className="feature-section">

                    <div className="feature-card">

                        <img
                            src="/images/Stay_Active.png"
                            alt="Stay active"
                        />

                        <div>
                            <h3>
                                Stay Active
                            </h3>

                            <p>
                                Check in every day and keep
                                building your streak.
                            </p>
                        </div>

                    </div>

                    <div className="feature-card">

                        <img
                            src="/images/Trust.png"
                            alt="Secure rewards"
                        />

                        <div>
                            <h3>
                                Secure Rewards
                            </h3>

                            <p>
                                Your rewards and transactions
                                are controlled by the backend.
                            </p>
                        </div>

                    </div>

                </section>

                {/* Exclusive reward */}
                <section className="exclusive-section">

                    <img
                        src="/images/Exclusive-reward.png"
                        alt="Exclusive rewards"
                    />

                    <div>
                        <p className="section-label">
                            KEEP GOING
                        </p>

                        <h2>
                            Unlock exclusive rewards
                        </h2>

                        <p>
                            Don't break your streak. Every
                            consecutive day brings you closer
                            to the next reward.
                        </p>
                    </div>

                </section>

                <footer className="dashboard-footer">
                    <span>© 2026 VELoop Rewards</span>
                    <span>Secure • Simple • Rewarding</span>
                </footer>

                {/* Mobile Bottom Navigation */}
                <nav className="mobile-bottom-nav">
                    <button className="active">
                        <span>⌂</span>
                        <small>Home</small>
                    </button>

                    <button>
                        <span>🎁</span>
                        <small>Rewards</small>
                    </button>

                    <button>
                        <span>💰</span>
                        <small>Wallet</small>
                    </button>

                </nav>

            </main>

        </div>
    );
}

export default StreakDashboard;