const express = require('express');
const cors = require('cors');
const flowService = require('./flow-service');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Mock user database
const users = {
  'testuser': {
    password: 'password123',
    loyaltyPoints: 2500,
    conversions: []
  }
};

// Mock TestBank API endpoints
app.post('/api/testbank/login', (req, res) => {
  const { username, password } = req.body;
  
  if (users[username] && users[username].password === password) {
    res.json({
      success: true,
      user: {
        username,
        loyaltyPoints: users[username].loyaltyPoints
      }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.get('/api/testbank/balance/:username', (req, res) => {
  const { username } = req.params;
  
  if (users[username]) {
    res.json({
      success: true,
      loyaltyPoints: users[username].loyaltyPoints
    });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
});

app.post('/api/convert', async (req, res) => {
  const { username, points, flowAddress } = req.body;
  
  if (!users[username]) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  if (users[username].loyaltyPoints < points) {
    return res.status(400).json({ success: false, message: 'Insufficient points' });
  }
  
  if (points < 100) {
    return res.status(400).json({ success: false, message: 'Minimum conversion is 100 points' });
  }
  
  // Calculate FLOW tokens (100 points = 1 FLOW)
  const flowTokens = points / 100;
  
  try {
    // Mint tokens on Flow blockchain
    const mintResult = await flowService.mintTokens(flowAddress, flowTokens);
    
    if (!mintResult.success) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to mint tokens: ' + mintResult.error 
      });
    }
    
    // Deduct points only after successful minting
    users[username].loyaltyPoints -= points;
    
    // Record conversion
    const conversion = {
      id: Date.now().toString(),
      points,
      flowTokens,
      flowAddress,
      transactionId: mintResult.transactionId,
      timestamp: new Date().toISOString()
    };
    
    users[username].conversions.push(conversion);
    
    console.log(`Successfully converted ${points} points to ${flowTokens} FLOW for ${flowAddress}`);
    console.log(`Transaction ID: ${mintResult.transactionId}`);
    
    res.json({
      success: true,
      conversion,
      remainingPoints: users[username].loyaltyPoints,
      transactionId: mintResult.transactionId
    });
    
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error during conversion' 
    });
  }
});

app.get('/api/conversions/:username', (req, res) => {
  const { username } = req.params;
  
  if (users[username]) {
    res.json({
      success: true,
      conversions: users[username].conversions
    });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
});

app.listen(PORT, () => {
  console.log(`TestBank API server running on http://localhost:${PORT}`);
  console.log('FlowPoints conversion service ready!');
});
