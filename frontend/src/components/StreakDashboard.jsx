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
    const [transactions, setTransactions] = useState([]);
    const [showTransactions, setShowTransactions] = useState(false);
    const [showWallet, setShowWallet] = useState(false);
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

    const loadTransactions = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/daily-streak/history`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Unable to load transactions'
                );
            }

            setTransactions(data.transactions || []);
        } catch (error) {
            console.error('Error loading transactions:', error);
        }
    };

    const handleClaim = () => {
        setShowAd(true);
    };

    useEffect(() => {
        loadStatus();
        loadTransactions();
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

                <button
                    className="streak-back-btn"
                    onClick={() => window.history.back()}
                    aria-label="Go back"
                >
                    ‹
                </button>

                <div className="streak-page-title">
                    <span>Daily Streak</span>
                    <span>🔥</span>
                </div>

                <div className="header-wallet">
                    <img
                        src="/images/VEs_Coin.png"
                        alt="VE"
                    />
                    <strong>{walletBalance}</strong>
                </div>

            </header>


            <main className="dashboard-container">


                {/* Hero */}
                <section className="streak-hero">

                    <img
                        className="hero-banner-image"
                        src="/images/Mobile_Hero.png"
                        alt="Login daily and earn bigger rewards"
                    />

                </section>

                {/* Streak Summary */}
                <section className="streak-main-card">
                <section className="streak-summary">

                    <div className="streak-summary-top">

                        <div className="streak-days-badge">
                            🔥 {currentStreak} Day Streak
                        </div>

                        <button className="streak-calendar-btn">
                            📅 Streak Calendar
                            <span>›</span>
                        </button>

                    </div>

                    <div className="summary-cards">

                        <div className="summary-card">
                            <div className="summary-icon purple">
                                📅
                            </div>

                            <div>
                                <span>Total Rewards</span>
                                <strong>7</strong>
                            </div>
                        </div>

                        <div className="summary-card">
                            <div className="summary-icon green">
                                ✓
                            </div>

                            <div>
                                <span>Checked In</span>
                                <strong>{currentStreak}</strong>
                            </div>
                        </div>

                        <div className="summary-card">
                            <div className="summary-icon gold">
                                ★
                            </div>

                            <div>
                                <span>Next Reward</span>
                                <strong>
                                    {currentDay < 7
                                        ? `+${rewards.find(
                                            r => r.day === currentDay + 1
                                        )?.amount || 0} VEs`
                                        : '₹5'}
                                </strong>
                            </div>
                        </div>

                    </div>

                </section>


                {/* Ultimate Reward */}
                <section className="ultimate-reward-section">

                    <div className="ultimate-reward-card">

                        <div className="ultimate-reward-image">
                            <img
                                src="/images/Day-7.png"
                                alt="Ultimate Reward"
                            />
                        </div>

                        <div className="ultimate-reward-info">

                            <h3>Ultimate Reward</h3>

                            <strong>₹5</strong>

                            <div className="amazon-label">
                                <span>𝒂</span>
                                Amazon Gift Card
                            </div>

                        </div>

                        <div className="ultimate-unlock">

                            <div className="lock-circle">
                                🔒
                            </div>

                            <span>Unlock on</span>
                            <strong>Day 7</strong>

                        </div>

                    </div>

                </section>


                {/* Come Back Message */}
                <div className="come-back-message">
                    <span>✦</span>

                    <div>
                        <strong>Come back tomorrow for more rewards!</strong>
                    </div>

                    <span>✦</span>
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
                                        setShowTransactions(true);
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

                {/* Transaction History */}
                {showTransactions && (
                    <>
                        <div
                            className="profile-overlay"
                            onClick={() => setShowTransactions(false)}
                        ></div>

                        <aside className="profile-drawer transaction-drawer">

                            <div className="profile-drawer-header">
                                <div>
                                    <p className="section-label">WALLET ACTIVITY</p>
                                    <h2>Transaction History</h2>
                                </div>

                                <button
                                    className="profile-close"
                                    onClick={() => setShowTransactions(false)}
                                >
                                    ×
                                </button>
                            </div>

                            {transactions.length === 0 ? (
                                <div className="transaction-empty">
                                    <div>📜</div>
                                    <h3>No transactions yet</h3>
                                    <p>
                                        Your daily streak reward transactions
                                        will appear here.
                                    </p>
                                </div>
                            ) : (
                                <div className="transaction-list">
                                    {transactions.map((transaction) => (
                                        <div
                                            className="transaction-item"
                                            key={transaction._id || transaction.transactionId}
                                        >
                                            <div className="transaction-icon">
                                                {transaction.rewardType === 'VE'
                                                    ? '🪙'
                                                    : '🎁'}
                                            </div>

                                            <div className="transaction-info">
                                                <strong>
                                                    {transaction.rewardType === 'VE'
                                                        ? `+${transaction.amount} VE`
                                                        : transaction.rewardType}
                                                </strong>

                                                <small>
                                                    Day {transaction.streakDay} •{' '}
                                                    {new Date(
                                                        transaction.createdAt
                                                    ).toLocaleString()}
                                                </small>

                                                <small>
                                                    ID: {transaction.transactionId}
                                                </small>
                                            </div>

                                            <span className="transaction-status">
                                ✓
                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </aside>
                    </>
                )}

                {/* Wallet Drawer */}
                {showWallet && (
                    <>
                        <div
                            className="profile-overlay"
                            onClick={() => setShowWallet(false)}
                        ></div>

                        <aside className="profile-drawer wallet-drawer">

                            <div className="profile-drawer-header">
                                <div>
                                    <p className="section-label">MY WALLET</p>
                                    <h2>Wallet</h2>
                                </div>

                                <button
                                    className="profile-close"
                                    onClick={() => setShowWallet(false)}
                                >
                                    ×
                                </button>
                            </div>

                            <div className="wallet-balance-card">
                                <span>Available Balance</span>

                                <strong>
                                    {walletBalance} {walletCurrency}
                                </strong>

                                <small>Daily streak rewards</small>
                            </div>

                            <div className="wallet-summary">
                                <div>
                                    <span>Total Transactions</span>
                                    <strong>{transactions.length}</strong>
                                </div>

                                <div>
                                    <span>Current Streak</span>
                                    <strong>{currentStreak} Days</strong>
                                </div>
                            </div>

                            <div className="wallet-history-header">
                                <h3>Recent Activity</h3>

                                <button
                                    onClick={() => {
                                        setShowWallet(false);
                                        setShowTransactions(true);
                                    }}
                                >
                                    View All
                                </button>
                            </div>

                            {transactions.length === 0 ? (
                                <div className="transaction-empty">
                                    <div>💰</div>
                                    <h3>No wallet activity</h3>
                                    <p>
                                        Your earned rewards will appear here.
                                    </p>
                                </div>
                            ) : (
                                <div className="transaction-list">
                                    {transactions.slice(0, 5).map((transaction) => (
                                        <div
                                            className="transaction-item"
                                            key={
                                                transaction._id ||
                                                transaction.transactionId
                                            }
                                        >
                                            <div className="transaction-icon">
                                                🪙
                                            </div>

                                            <div className="transaction-info">
                                                <strong>
                                                    +{transaction.amount}{' '}
                                                    {transaction.currency}
                                                </strong>

                                                <small>
                                                    Day {transaction.streakDay}
                                                </small>

                                                <small>
                                                    {new Date(
                                                        transaction.createdAt
                                                    ).toLocaleDateString()}
                                                </small>
                                            </div>

                                            <span className="transaction-status">
                                ✓
                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

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
                                                Today
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
                                        {reward.day === 7
                                            ? 'Ultimate Reward'
                                            : 'Daily Reward'}
                                    </h3>

                                    <div className="reward-value">
                                        {reward.rewardType === 'GIFT_CARD'
                                            ? `₹${reward.amount}`
                                            : `+${reward.amount}`}
                                    </div>

                                    <p className="reward-description">
                                        {reward.rewardType === 'GIFT_CARD'
                                            ? 'Amazon Gift Card'
                                            : `${reward.amount} VEs`}
                                    </p>

                                    {isClaimed && (
                                        <button className="reward-action claimed-action" disabled>
                                            ✓ Claimed
                                        </button>
                                    )}

                                    {isCurrent && status.today.eligible && (
                                        <button
                                            className="reward-action claim-action"
                                            onClick={handleClaim}
                                        >
                                            Claim Now
                                        </button>
                                    )}

                                    {isCurrent && !status.today.eligible && (
                                        <button
                                            className="reward-action locked-action"
                                            disabled
                                        >
                                            🔒 Locked
                                        </button>
                                    )}

                                    {reward.day === currentDay && !status.today.eligible && countdown && (
                                        <div className="reward-countdown">
                                            ⏳ Next reward in {countdown}
                                        </div>
                                    )}

                                    {isLocked && (
                                        <button className="reward-action locked-action" disabled>
                                            🔒 Locked
                                        </button>
                                    )}
                                </div>
                            );
                        })}

                    </div>

                </section>

                {/* Bottom feature cards */}
                <section className="feature-section">

                    <div className="feature-section-heading">
                        <h2>✦ Why Maintain Your Streak? ✦</h2>
                    </div>

                    <div className="feature-grid">

                        <div className="feature-card">
                            <img
                                src="/images/Stay_Active.png"
                                alt="Stay Active"
                            />

                            <div>
                                <h3>Stay Active</h3>
                                <p>
                                    Keep your streak alive & earn more!
                                </p>
                            </div>
                        </div>

                        <div className="feature-card">
                            <img
                                src="/images/Bigger_Streak.png"
                                alt="Bigger Streak"
                            />

                            <div>
                                <h3>Bigger Streak</h3>
                                <p>
                                    More consecutive logins, bigger rewards!
                                </p>
                            </div>
                        </div>

                        <div className="feature-card">
                            <img
                                src="/images/Exclusive-reward.png"
                                alt="Exclusive Rewards"
                            />

                            <div>
                                <h3>Exclusive Rewards</h3>
                                <p>
                                    Get coins, gift cards & special bonuses!
                                </p>
                            </div>
                        </div>

                        <div className="feature-card">
                            <img
                                src="/images/Trust.png"
                                alt="Don't Miss Out"
                            />

                            <div>
                                <h3>Don't Miss Out</h3>
                                <p>
                                    Come back every day & unlock all rewards!
                                </p>
                            </div>
                        </div>

                    </div>

                </section>

                {/* Official VeloopRewards Banner */}
                <section className="official-banner">

                    <div>
                        <p className="section-label">
                            OFFICIAL WEBSITE
                        </p>

                        <h2>
                            VeloopRewards.in
                        </h2>

                        <p>
                            Stay active, stay rewarded!
                        </p>
                    </div>

                    <span>›</span>

                </section>

                <footer className="dashboard-footer">
                    <span>© 2026 VELoop Rewards</span>
                    <span>Secure • Simple • Rewarding</span>
                </footer>

                {!showProfile && !showTransactions && !showWallet && (
                    <nav className="mobile-bottom-nav">
                    <button
                        className="active"
                        onClick={() =>
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            })
                        }
                    >
                        <span>⌂</span>
                        <small>Home</small>
                    </button>

                    <button
                        onClick={() =>
                            document
                                .querySelector('.rewards-section')
                                ?.scrollIntoView({ behavior: 'smooth' })
                        }
                    >
                        <span>🎁</span>
                        <small>Rewards</small>
                    </button>

                    <button
                        onClick={() => setShowWallet(true)}
                    >
                        <span>💰</span>
                        <small>Wallet</small>
                    </button>
                </nav>

                    )}

            </main>

        </div>
    );
}

export default StreakDashboard;