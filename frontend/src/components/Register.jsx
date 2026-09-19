import { useState } from 'react';

function Register({ onLoginClick }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            window.location.reload();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-glow auth-glow-one"></div>
            <div className="auth-glow auth-glow-two"></div>

            <div className="auth-container">

                {/* LEFT SIDE */}
                <div className="auth-hero">

                    <div className="auth-brand">
                        <span className="brand-dot"></span>
                        <span>VELoop</span>
                    </div>

                    <p className="auth-label">DAILY REWARDS</p>

                    <h1>
                        Start Your
                        <br />
                        <span>Reward Journey!</span>
                    </h1>

                    <p className="auth-description">
                        Create your account, build your daily streak,
                        and unlock bigger rewards every day.
                    </p>

                    {/* STATIC BENEFITS */}
                    <div className="auth-benefits">

                        <div className="auth-benefit">
                            <div className="benefit-icon">🔥</div>
                            <div>
                                <strong>Daily Rewards</strong>
                                <span>Get rewarded every day you check in</span>
                            </div>
                        </div>

                        <div className="auth-benefit">
                            <div className="benefit-icon">⚡</div>
                            <div>
                                <strong>Build Your Streak</strong>
                                <span>Keep your streak alive and earn more</span>
                            </div>
                        </div>

                        <div className="auth-benefit">
                            <div className="benefit-icon">🎁</div>
                            <div>
                                <strong>Unlock Bigger Benefits</strong>
                                <span>Reach higher days for bigger rewards</span>
                            </div>
                        </div>

                    </div>

                    {/* REWARD PREVIEW */}
                    <div className="auth-reward-preview">
                        <div className="auth-reward-icon">🎁</div>

                        <div>
                            <span>Welcome to VELoop</span>
                            <strong>Start your journey • Earn daily</strong>
                        </div>

                        <div className="reward-arrow">→</div>
                    </div>

                </div>

                {/* REGISTER CARD */}
                <div className="login-card">
                    <div className="login-header">
                        <div className="login-icon">🚀</div>

                        <h2>Create Your Account</h2>

                        <p>
                            Join VELoop and start earning rewards every day
                        </p>
                    </div>

                    <form onSubmit={handleRegister}>

                        {/* NAME */}
                        <div className="auth-input-group">
                            <label>Full Name</label>

                            <div className="auth-input-wrapper">
                                <span>👤</span>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div className="auth-input-group">
                            <label>Email Address</label>

                            <div className="auth-input-wrapper">
                                <span>✉</span>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div className="auth-input-group">
                            <label>Password</label>

                            <div className="auth-input-wrapper">
                                <span>🔒</span>

                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="Create a password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? '🙈' : '👁'}
                                </button>
                            </div>
                        </div>
                        <p className="password-hint">
                            Use at least 6 characters for your password.
                        </p>

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            className="login-submit-btn"
                        >
                            Create My Account
                            <span>→</span>
                        </button>
                    </form>

                    {/* LOGIN */}
                    <div className="login-divider">
                        <span>Already have an account?</span>
                    </div>

                    <button
                        type="button"
                        className="register-btn"
                        onClick={onLoginClick}
                    >
                        Login to VELoop
                    </button>

                    <p className="auth-footer">
                        🔐 Your account and rewards are securely protected.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;