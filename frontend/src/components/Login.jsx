import { useEffect, useState } from 'react';
function Login({ onRegisterClick }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);

    const slides = [
        {
            icon: '🔥',
            title: '7-Day Streak',
            text: 'Stay consistent and unlock bigger rewards.',
        },
        {
            icon: '💎',
            title: 'Premium Rewards',
            text: 'Keep your streak alive to unlock more.',
        },
        {
            icon: '🎁',
            title: 'Exclusive Benefits',
            text: 'Reach higher days and earn more benefits.',
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((current) => (current + 1) % slides.length);
        }, 3500);

        return () => clearInterval(interval);
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();

        console.log('LOGIN SUBMITTED');

        try {
            const response = await fetch(
                'http://localhost:5001/api/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            alert('Login successful!');
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
                        Login Daily
                        <br />
                        <span>Earn Bigger Rewards!</span>
                    </h1>

                    <p className="auth-description">
                        Keep your streak alive, collect rewards,
                        and unlock bigger benefits every day.
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

                    {/* SLIDER */}
                    <div className="auth-slider">

                        <div className="auth-slider-card">
                            <div className="auth-slider-icon">
                                {slides[activeSlide].icon}
                            </div>

                            <div className="auth-slider-content">
                                <span>{slides[activeSlide].title}</span>
                                <strong>{slides[activeSlide].text}</strong>
                            </div>

                            <div className="slider-arrow">→</div>
                        </div>

                        <div className="auth-dots">
                            {slides.map((slide, index) => (
                                <button
                                    key={slide.title}
                                    type="button"
                                    className={index === activeSlide ? 'active' : ''}
                                    onClick={() => setActiveSlide(index)}
                                    aria-label={`Show ${slide.title}`}
                                />
                            ))}
                        </div>

                    </div>
                </div>

                {/* LOGIN CARD */}
                <div className="login-card">

                    <div className="login-header">
                        <div className="login-icon">👋</div>

                        <h2>Welcome Back!</h2>

                        <p>
                            Login to continue your VELoop journey
                        </p>
                    </div>

                    <form onSubmit={handleLogin}>

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
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="Enter your password"
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

                        {/* FORGOT PASSWORD */}
                        <div className="forgot-password-row">
                            <button
                                type="button"
                                className="forgot-password"
                                onClick={() =>
                                    alert(
                                        'Password reset will be available soon.'
                                    )
                                }
                            >
                                Forgot Password?
                            </button>
                        </div>

                        {/* LOGIN */}
                        <button
                            type="submit"
                            className="login-submit-btn"
                        >
                            Login to VELoop
                            <span>→</span>
                        </button>

                    </form>

                    {/* REGISTER */}
                    <div className="login-divider">
                        <span>New to VELoop?</span>
                    </div>

                    <button
                        type="button"
                        className="register-btn"
                        onClick={onRegisterClick}
                    >
                        Create an Account
                    </button>

                    <p className="auth-footer">
                        🔐 Your account and rewards are securely protected.
                    </p>

                </div>

            </div>
        </div>
    );
}

export default Login;