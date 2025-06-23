import React, { useState } from 'react';

const TestBankLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('testuser');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/testbank/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        onLogin(data.user);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Connection error. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App fade-in">
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg mx-auto">
          {/* Logo and Header - Centered */}
          <div className="text-center mb-12">
            <div className="text-7xl mb-6">🏦</div>
            <h1 className="text-gradient text-large mb-4">Sample Bank Portal</h1>
            <p className="text-medium">Access your loyalty points account</p>
          </div>

          {/* Login Card - Centered with more padding */}
          <div className="fintech-card-large p-10 mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-large mb-3">Welcome Back</h2>
              <p className="text-small">Sign in to manage your loyalty points</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-8">
              <div>
                <label className="block text-medium mb-3 text-center">
                  👤 Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="fintech-input text-center"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label className="block text-medium mb-3 text-center">
                  🔒 Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="fintech-input text-center"
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                  <div className="flex items-center justify-center">
                    <span className="text-lg mr-3">⚠️</span>
                    <span className="text-sm text-center">{error}</span>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`btn-primary w-full ${loading ? 'pulse-green' : ''}`}
                >
                  {loading ? '⏳ Signing In...' : '🚀 Sign In'}
                </button>
              </div>
            </form>

            {/* Demo Credentials - Centered */}
            <div className="mt-10 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="text-center">
                <div className="text-sm font-medium text-green-800 mb-3">
                  💡 Demo Credentials
                </div>
                <div className="text-xs text-green-700 space-y-2">
                  <div><strong>Username:</strong> testuser</div>
                  <div><strong>Password:</strong> password123</div>
                </div>
              </div>
            </div>
          </div>

          {/* Features - Centered with more spacing */}
          <div className="mt-12 grid grid-cols-1 gap-6 max-w-sm mx-auto">
            <div className="fintech-card p-6 text-center">
              <div className="text-3xl mb-3">💎</div>
              <div className="text-medium mb-2">Loyalty Points</div>
              <div className="text-small">Earn and manage your rewards</div>
            </div>
            <div className="fintech-card p-6 text-center">
              <div className="text-3xl mb-3">🌊</div>
              <div className="text-medium mb-2">Flow Integration</div>
              <div className="text-small">Convert points to FLOW tokens</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestBankLogin;
