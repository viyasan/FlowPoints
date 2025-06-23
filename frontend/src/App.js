import React, { useState } from 'react';
import TestBankLogin from './components/TestBankLogin';
import ConversionDashboard from './components/ConversionDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="App">
      {user ? (
        <ConversionDashboard user={user} onLogout={handleLogout} />
      ) : (
        <TestBankLogin onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
