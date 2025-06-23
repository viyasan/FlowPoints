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
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">FlowPoints</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user.username}</span>
            <button
              onClick={onLogout}
              className="text-blue-600 hover:text-blue-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Balance and Conversion */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Account Balance</h2>
            
            <div className="mb-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {loyaltyPoints.toLocaleString()} points
              </div>
              <button
                onClick={fetchBalance}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Refresh Balance
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Flow Wallet</h3>
              {flowUser.loggedIn ? (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-md">
                  <div>
                    <div className="text-sm font-medium text-green-800">Connected</div>
                    <div className="text-xs text-green-600">{flowUser.addr}</div>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Connect Flow Wallet
                </button>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Convert Points to FLOW</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Points to Convert
                  </label>
                  <input
                    type="number"
                    value={pointsToConvert}
                    onChange={(e) => setPointsToConvert(e.target.value)}
                    placeholder="Minimum 100 points"
                    min="100"
                    max={loyaltyPoints}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="text-sm text-gray-600">You will receive:</div>
                  <div className="text-lg font-semibold text-blue-600">{flowTokens} FLOW</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Exchange Rate: 100 points = 1 FLOW
                  </div>
                </div>

                <button
                  onClick={handleConvert}
                  disabled={loading || !flowUser.loggedIn || !pointsToConvert || parseInt(pointsToConvert) < 100}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Converting...' : 'Convert Points'}
                </button>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
            
            {conversions.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                No conversions yet
              </div>
            ) : (
              <div className="space-y-3">
                {conversions.slice().reverse().map((conversion) => (
                  <div key={conversion.id} className="border border-gray-200 rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">
                          {conversion.points} points → {conversion.flowTokens} FLOW
                        </div>
                        <div className="text-sm text-gray-600">
                          To: {conversion.flowAddress}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(conversion.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-green-600 text-sm font-medium">
                        Completed
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionDashboard;
