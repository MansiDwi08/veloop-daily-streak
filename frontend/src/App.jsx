import { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import StreakDashboard from './components/StreakDashboard';

function App() {
  const [showRegister, setShowRegister] = useState(false);

  const token = localStorage.getItem('token');

  if (!token) {
    if (showRegister) {
      return (
          <Register
              onLoginClick={() => setShowRegister(false)}
          />
      );
    }

    return (
        <Login
            onRegisterClick={() => setShowRegister(true)}
        />
    );
  }

  return <StreakDashboard />;
}

export default App;