import React, { useState, useEffect } from 'react';
import * as fcl from '@onflow/fcl';

// Configure FCL for Flow Testnet
fcl.config({
  'accessNode.api': 'https://rest-testnet.onflow.org',
  'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
  'app.detail.title': 'FlowPoints',
  'app.detail.icon': 'https://placekitten.com/g/200/200',
});

const ConversionDashboard = ({ user, onLogout }) => {
  const [flowUser, setFlowUser] = useState({ loggedIn: null });
  const [loyaltyPoints, setLoyaltyPoints] = useState(user.loyaltyPoints);
  const [pointsToConvert, setPointsToConvert] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversions, setConversions] = useState([]);

  useEffect(() => {
    fcl.currentUser.subscribe(setFlowUser);
    fetchConversions();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/testbank/balance/${user.username}`);
      const data = await response.json();
      if (data.success) {
        setLoyaltyPoints(data.loyaltyPoints);
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  };

  const fetchConversions = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/conversions/${user.username}`);
      const data = await response.json();
      if (data.success) {
        setConversions(data.conversions);
      }
    } catch (err) {
      console.error('Error fetching conversions:', err);
    }
  };

  const connectWallet = () => {
    fcl.authenticate();
  };

  const disconnectWallet = () => {
    fcl.unauthenticate();
  };

  const handleConvert = async () => {
    if (!flowUser.loggedIn) {
      alert('Please connect your Flow wallet first');
      return;
    }

    const points = parseInt(pointsToConvert);
    if (points < 100) {
      alert('Minimum conversion is 100 points');
      return;
    }

    if (points > loyaltyPoints) {
      alert('Insufficient loyalty points');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.username,
          points: points,
          flowAddress: flowUser.addr,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setLoyaltyPoints(data.remainingPoints);
        setPointsToConvert('');
        fetchConversions();
        alert(`Successfully converted ${points} points to ${data.conversion.flowTokens} FLOW tokens!`);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Conversion failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const flowTokens = pointsToConvert ? (parseInt(pointsToConvert) / 100).toFixed(2) : '0.00';

  return (
    <div className="App fade-in">
      {/* Modern Header */}
      <div className="fintech-header">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-gradient text-large">💎 FlowPoints</h1>
          <div className="flex items-center space-x-6">
            <span className="text-medium">Welcome, <strong>{user.username}</strong></span>
            <button
              onClick={onLogout}
              className="btn-danger"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Balance and Conversion Card */}
          <div className="fintech-card-large p-8">
            <h2 className="text-large mb-6">💰 Account Overview</h2>
            
            {/* Balance Display */}
            <div className="balance-display mb-8">
              <div className="balance-amount">
                {loyaltyPoints.toLocaleString()}
              </div>
              <div className="text-white/80 text-lg font-medium mb-4">Loyalty Points</div>
              <button
                onClick={fetchBalance}
                className="btn-secondary bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                🔄 Refresh Balance
              </button>
            </div>

            {/* Flow Wallet Status */}
            <div className="mb-8">
              <h3 className="text-medium mb-4">🌊 Flow Wallet Connection</h3>
              {flowUser.loggedIn ? (
                <div className="status-connected flex items-center justify-between">
                  <div>
                    <div className="font-semibold">✅ Connected</div>
                    <div className="text-white/80 text-sm font-mono">{flowUser.addr}</div>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="btn-danger"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="status-disconnected text-center">
                  <div className="mb-3">
                    <div className="text-2xl mb-2">🔗</div>
                    <div className="font-medium">Wallet Not Connected</div>
                    <div className="text-small">Connect your Flow wallet to convert points</div>
                  </div>
                  <button
                    onClick={connectWallet}
                    className="btn-primary w-full"
                  >
                    Connect Flow Wallet
                  </button>
                </div>
              )}
            </div>

            {/* Conversion Section */}
            <div>
              <h3 className="text-medium mb-6">🔄 Convert your Citi Points to FLOW</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-medium mb-2">
                    Points to Convert
                  </label>
                  <input
                    type="number"
                    value={pointsToConvert}
                    onChange={(e) => setPointsToConvert(e.target.value)}
                    placeholder="Minimum 100 points"
                    min="100"
                    max={loyaltyPoints}
                    className="fintech-input"
                  />
                </div>

                <div className="conversion-rate">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">You will receive:</span>
                    <span className="text-2xl font-bold">{flowTokens} FLOW</span>
                  </div>
                  <div className="text-small">
                    💡 Exchange Rate: 100 points = 1 FLOW token
                  </div>
                </div>

                <button
                  onClick={handleConvert}
                  disabled={loading || !flowUser.loggedIn || !pointsToConvert || parseInt(pointsToConvert) < 100}
                  className={`btn-primary w-full ${loading ? 'pulse-green' : ''}`}
                >
                  {loading ? '⏳ Converting...' : '✨ Convert Points'}
                </button>
              </div>
            </div>
          </div>

          {/* Conversion History Card */}
          <div className="fintech-card-large p-8">
            <h2 className="text-large mb-6">📊 Conversion History</h2>
            
            {conversions.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {conversions.map((conversion, index) => (
                  <div key={index} className="fintech-card p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-primary-green">
                          +{conversion.flowAmount} FLOW
                        </div>
                        <div className="text-small">
                          -{conversion.pointsAmount} points
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          conversion.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : conversion.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {conversion.status === 'completed' ? '✅' : conversion.status === 'pending' ? '⏳' : '❌'} 
                          {conversion.status}
                        </div>
                      </div>
                    </div>
                    <div className="text-small">
                      📅 {new Date(conversion.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    {conversion.transactionId && (
                      <div className="text-small font-mono mt-2 p-2 bg-gray-50 rounded">
                        🔗 TX: {conversion.transactionId.substring(0, 20)}...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📈</div>
                <div className="text-medium mb-2">No conversions yet</div>
                <div className="text-small">
                  Your conversion history will appear here once you start converting points to FLOW tokens.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="fintech-card p-6 text-center">
            <div className="text-3xl mb-2">💎</div>
            <div className="text-2xl font-bold text-gradient">{loyaltyPoints.toLocaleString()}</div>
            <div className="text-small">Total Points</div>
          </div>
          <div className="fintech-card p-6 text-center">
            <div className="text-3xl mb-2">🌊</div>
            <div className="text-2xl font-bold text-gradient">
              {conversions.reduce((sum, c) => sum + parseFloat(c.flowAmount || 0), 0).toFixed(2)}
            </div>
            <div className="text-small">FLOW Earned</div>
          </div>
          <div className="fintech-card p-6 text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-gradient">{conversions.length}</div>
            <div className="text-small">Total Conversions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionDashboard;
