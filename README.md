# FlowPoints - Loyalty Points to Flow Token Conversion

A hackathon MVP that converts TestBank loyalty points into Flow tokens on the Flow blockchain.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- npm

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm install
   node server.js
   ```
   Server runs on `http://localhost:3001`

2. **Start the Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   App runs on `http://localhost:3000`

3. **Demo Login Credentials**
   - Username: `testuser`
   - Password: `password123`
   - Starting Balance: 2,500 loyalty points

## 📱 Features

### ✅ Implemented (MVP)
- **TestBank Login**: Simulated banking interface with demo credentials
- **Balance Display**: Real-time loyalty points balance
- **Flow Wallet Integration**: Connect multiple Flow wallets via FCL
- **Point Conversion**: Convert loyalty points to FLOW tokens (100 points = 1 FLOW)
- **Transaction History**: View past conversions
- **Mock Token Minting**: Simulated Flow blockchain integration

### 🔄 Demo Flow
1. Login to TestBank with demo credentials
2. Connect your Flow wallet (Testnet)
3. Enter points to convert (minimum 100)
4. Confirm conversion
5. View transaction in history

## 🏗 Architecture

```
FlowPoints/
├── frontend/          # React app with FCL integration
│   ├── src/
│   │   ├── components/
│   │   │   ├── TestBankLogin.js
│   │   │   └── ConversionDashboard.js
│   │   └── App.js
├── backend/           # Express API server
│   ├── server.js      # Main API endpoints
│   └── flow-service.js # Flow blockchain integration
└── contracts/         # Cadence smart contracts
    └── FlowPointsToken.cdc
```

## 🔧 Technical Stack

- **Frontend**: React, Tailwind CSS, Flow Client Library (FCL)
- **Backend**: Node.js, Express, Flow SDK
- **Blockchain**: Flow Testnet, Cadence smart contracts
- **Mock Services**: TestBank API simulation

## 🎯 Conversion Logic

- **Exchange Rate**: 100 TestBank points = 1 FLOW token
- **Minimum Conversion**: 100 points
- **Maximum Daily Limit**: 10,000 points (100 FLOW)
- **Transaction Flow**: Points deducted → Tokens minted → History updated

## 🔗 Flow Integration

### Smart Contract
- Custom fungible token following Flow standards
- Minting capability for authorized backend
- Metadata views for wallet display

### Wallet Connection
- Multi-wallet support via FCL Discovery
- Testnet configuration
- Sponsored transactions (simulated)

## 🧪 Demo Notes

This is a hackathon MVP with simulated components:
- TestBank API is mocked (no real bank integration)
- Token minting is simulated (logs transaction IDs)
- Flow contract deployment is prepared but not live

For production deployment:
1. Deploy FlowPointsToken contract to Flow
2. Implement real Flow SDK signing
3. Add proper authentication and KYC
4. Integrate with real banking APIs

## 📊 Success Metrics

- ✅ End-to-end conversion flow working
- ✅ Flow wallet integration functional
- ✅ Clean, intuitive UI for non-crypto users
- ✅ Transaction history and balance tracking
- ✅ Responsive design with Tailwind CSS

## 🚀 Next Steps (Post-Hackathon)

1. Deploy smart contract to Flow Testnet
2. Implement real token minting with private keys
3. Add sponsored transaction support
4. Integrate with real banking APIs
5. Add KYC/compliance features
6. Mobile app development

---

**Built for Flow Blockchain Hackathon** 🌊
