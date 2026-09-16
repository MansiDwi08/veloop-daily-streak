# VELoop Daily Streak & Rewards

A secure, backend-driven Daily Streak and Rewards system built for the VELoop Rewards platform.

The application allows authenticated users to claim daily streak rewards in sequence while the backend controls eligibility, streak progression, reward allocation, wallet updates, transaction records, and the 24-hour claim timer.

## 🚀 Features

* User Registration & Login
* JWT-based Authentication
* Backend-controlled Daily Streak
* Sequential Day-wise Reward Claims
* 24-Hour Server-side Claim Timer
* CPA Advertisement Demo Flow
* Wallet Balance Management
* Reward Transaction History
* VE Rewards & Gift Card Rewards
* Missed-Day Streak Reset
* Protected REST APIs
* Responsive React UI
* MongoDB Database Integration

## 🎁 Daily Rewards

| Day   | Reward              |
| ----- | ------------------- |
| Day 1 | +5 VEs              |
| Day 2 | +10 VEs             |
| Day 3 | +15 VEs             |
| Day 4 | ₹1 Amazon Gift Card |
| Day 5 | ₹2 Amazon Gift Card |
| Day 6 | +30 VEs             |
| Day 7 | ₹5 Amazon Gift Card |

## 🔄 Reward Flow

```text
User Login
    ↓
Streak Dashboard
    ↓
Backend Status Check
    ↓
Claim Reward
    ↓
CPA Demo Advertisement
    ↓
Backend Validation
    ↓
Reward Granted
    ↓
Wallet / Transaction Updated
    ↓
Next Day Locked for 24 Hours
```

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Bootstrap
* CSS Modules
* JavaScript

### Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication
* bcrypt.js

### Database

* MongoDB
* Mongoose

### Development Tools

* IntelliJ IDEA
* Visual Studio Code
* Postman
* Git & GitHub

## 🔐 Security & Backend Controls

The backend acts as the source of truth for the daily streak system.

* User identity is obtained from authenticated JWT data.
* Reward eligibility is validated by the backend.
* Client-side day values are not trusted.
* Rewards cannot be claimed before the server-controlled timer expires.
* Wallet transactions maintain balance-before and balance-after records.
* Protected APIs require authentication.
* Passwords are stored using bcrypt hashing.

## 📡 API Endpoints

| Method | Endpoint                    | Purpose                        |
| ------ | --------------------------- | ------------------------------ |
| GET    | `/api/daily-streak/status`  | Get current streak status      |
| GET    | `/api/daily-streak/rewards` | Get available rewards          |
| POST   | `/api/daily-streak/claim`   | Claim eligible reward          |
| GET    | `/api/daily-streak/history` | Get reward transaction history |

## 📂 Project Structure

```text
veloop-daily-streak/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── ...
│   └── package.json
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/MansiDwi08/veloop-daily-streak.git
cd veloop-daily-streak
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd veloop-daily-streak/backend
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `backend` folder:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

### 5. Start the backend

```bash
node --watch server.js
```

### 6. Start the frontend

Inside the frontend folder:

```bash
npm run dev
```

## 📌 Project Purpose

This project demonstrates how a reward and streak system can be designed with a backend-first architecture where authentication, reward eligibility, streak progression, wallet updates, transaction records, and timing rules are controlled by the server.

## 👩‍💻 Author

**Mansi Dwivedi**

B.Tech Computer Science & Engineering Graduate

GitHub: [MansiDwi08](https://github.com/MansiDwi08)
