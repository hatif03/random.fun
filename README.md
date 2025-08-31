# 🎯 VRF Campaign System

A decentralized campaign system powered by verifiable randomness for fair winner selection and transparent reward distribution.

## 🌟 Overview

The VRF Campaign System enables protocols to run transparent, fair reward campaigns using Randamu VRF (Verifiable Random Function) for unbiased winner selection. Built with Solidity smart contracts and a modern Next.js frontend, this system ensures complete fairness and transparency in reward distribution.

## ✨ Key Features

- **🔐 Verifiable Randomness**: Randamu VRF ensures tamper-proof winner selection
- **🎯 Goal-Based Campaigns**: Campaigns trigger when on-chain goals are met
- **👥 Whitelist Management**: Controlled access to campaign participation
- **💰 Flexible Rewards**: Configurable reward tiers and distribution
- **📱 Modern Frontend**: Interactive dashboard for campaign management and participation
- **🔗 Multi-Chain Ready**: Built for EVM-compatible blockchains

## 🏗️ Architecture

```
├── contracts/          # Smart contracts (Solidity)
├── frontend/          # Next.js frontend application
├── scripts/           # Deployment and utility scripts
├── test/              # Smart contract tests
└── docs/              # Documentation and guides
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Hardhat or Foundry for smart contract development
- MetaMask or similar wallet

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vrf-campaign-system
   ```

2. **Install dependencies**
   ```bash
   # Install smart contract dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   ```

3. **Environment setup**
   ```bash
   # Copy environment files
   cp .env.example .env
   cp frontend/.env.example frontend/.env
   
   # Configure your environment variables
   ```

### Smart Contracts

1. **Compile contracts**
   ```bash
   npx hardhat compile
   ```

2. **Run tests**
   ```bash
   npx hardhat test
   ```

3. **Deploy to testnet**
   ```bash
   npx hardhat run scripts/deploy.js --network baseSepolia
   ```

### Frontend

1. **Start development server**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Demo & Testing

### Live Demo Features

- **Admin Dashboard**: Create and manage campaigns
- **Campaign Participation**: Check eligibility and claim rewards
- **Real-time Monitoring**: Live TVL progress and transaction history
- **Interactive Testing**: Test different user scenarios

### Test Addresses

#### Winners (Can claim rewards)
```
0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6 → 1000 USDC
0x1234567890123456789012345678901234567890 → 500 USDC
0xabcdefabcdefabcdefabcdefabcdefabcdefabcd → 250 USDC
0x9876543210987654321098765432109876543210 → 100 USDC
0x5555555555555555555555555555555555555555 → 50 USDC
```

#### Eligible Non-Winners
```
0x6666666666666666666666666666666666666666
0x7777777777777777777777777777777777777777
0x8888888888888888888888888888888888888888
```

### Demo Workflow

1. **Campaign Creation**: Admin sets up campaign parameters
2. **VRF Selection**: Winners are randomly selected using Randamu VRF
3. **Goal Monitoring**: System tracks progress toward campaign goals
4. **Reward Distribution**: Winners claim rewards once goals are met

## 🔧 Smart Contracts

### Core Contracts

- **`CampaignManager.sol`**: Main campaign logic and management
- **`RandomNumberGenerator.sol`**: VRF integration for randomness
- **`RewardEscrow.sol`**: Secure reward management and distribution
- **`MockERC20.sol`**: Test token for development and testing

### VRF Integration

The system integrates with Randamu VRF for verifiable randomness:

```solidity
import "@randamu/contracts/VRFConsumer.sol";
import "@randamu/contracts/interfaces/VRFCoordinatorInterface.sol";

contract RandomNumberGenerator is VRFConsumer {
    // VRF configuration and randomness request logic
}
```

### Key Functions

- **`createCampaign()`**: Initialize new campaign with parameters
- **`requestRandomness()`**: Trigger VRF winner selection
- **`fulfillRandomWords()`**: Process VRF response and select winners
- **`claimRewards()`**: Allow winners to claim their rewards

## 🎨 Frontend

### Technology Stack

- **Next.js 14**: React framework with app router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Ethers.js**: Ethereum interaction library

### Key Components

- **Admin Dashboard**: Campaign creation and management
- **Campaign Participation**: User eligibility and reward claiming
- **Live Dashboard**: Real-time campaign monitoring
- **Transaction History**: Complete operation tracking

### Design System

The frontend uses a **brutalist design system** with:
- Bold, high-contrast colors
- Thick borders and shadows
- Typography-focused layouts
- Responsive grid systems

## 🌐 Supported Networks

- **Ethereum Mainnet**: Production deployment
- **Base Sepolia**: Testnet for development
- **Polygon Mumbai**: Testnet for testing
- **Any EVM-compatible chain**: Configurable deployment

## 📚 Documentation

- **[Smart Contract Docs](./docs/contracts.md)**: Detailed contract documentation
- **[Frontend Guide](./docs/frontend.md)**: Frontend development guide
- **[Deployment Guide](./docs/deployment.md)**: Network deployment instructions
- **[API Reference](./docs/api.md)**: Smart contract function reference

## 🧪 Testing

### Smart Contract Tests

```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/CampaignManager.test.js

# Run with coverage
npx hardhat coverage
```

### Frontend Tests

```bash
cd frontend

# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run with coverage
npm run test:coverage
```

## 🚀 Deployment

### Testnet Deployment

1. **Configure network in hardhat.config.js**
2. **Set environment variables**
3. **Deploy contracts**
4. **Verify on block explorer**
5. **Update frontend configuration**

### Mainnet Deployment

1. **Audit smart contracts**
2. **Test on testnet thoroughly**
3. **Deploy with proper security measures**
4. **Monitor and maintain**

## 🔒 Security

### Security Features

- **Access Control**: Role-based permissions for admin functions
- **Reentrancy Protection**: Secure against reentrancy attacks
- **Input Validation**: Comprehensive parameter validation
- **Emergency Functions**: Pause and emergency stop capabilities

### Audit Status

- Smart contracts undergo security audits
- Open source for community review
- Bug bounty program for security researchers

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Standards

- Follow Solidity style guide
- Use TypeScript for frontend
- Write comprehensive tests
- Document all public functions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- **Randamu**: VRF technology and oracle services
- **OpenZeppelin**: Secure smart contract libraries
- **Hardhat**: Development framework
- **Next.js**: Frontend framework

## 📞 Support

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: support@yourproject.com

## 🔗 Links

- **Website**: [https://yourproject.com](https://yourproject.com)
- **Documentation**: [https://docs.yourproject.com](https://docs.yourproject.com)
- **GitHub**: [https://github.com/your-repo](https://github.com/your-repo)
- **Twitter**: [@yourproject](https://twitter.com/yourproject)

---

**Built with ❤️ for the decentralized future**
