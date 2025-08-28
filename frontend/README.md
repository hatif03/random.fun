# DCipher Swap Frontend

A Next.js frontend for the DCipher Swap MEV-resistant decentralized exchange, built on Base Sepolia.

## Features

### 🚀 MEV Protection
- **Client-side encryption** of swap details before submission
- **Encrypted mempool** prevents front-running and sandwich attacks
- **Timelock-based execution** ensures fair transaction ordering

### 💱 Swap Interface
- **Token selection** with popular tokens (ETH, WETH, USDC)
- **Real-time price calculation** and slippage protection
- **Transaction deadline** settings for user control
- **Slippage tolerance** configuration (0.1% - 50%)

### 🔒 Security Features
- **Wallet integration** with RainbowKit
- **Transaction status tracking** with real-time updates
- **Encrypted transaction flow** from submission to execution

## Architecture

### Core Components

1. **SwapCard** - Main swap interface with token inputs and swap button
2. **TokenSelector** - Dropdown for selecting input/output tokens
3. **SettingsModal** - Configuration for slippage and deadline
4. **TransactionStatus** - Real-time transaction monitoring
5. **useSwap Hook** - Business logic for MEV-resistant swaps

### Smart Contract Integration

- **DCipherSwap** - Main contract for creating timelock swap requests
- **BatcherContract** - Handles encrypted transaction batching
- **ExecutorContract** - Executes decrypted swap transactions
- **ConfigContract** - Manages system parameters and keyper committee

### Encryption Flow

1. **Client-side encryption** of swap data using public key
2. **Submission** to encrypted mempool via BatcherContract
3. **Batching** of encrypted transactions by sequencer
4. **Decryption** at target block height by keyper committee
5. **Execution** of decrypted swaps in committed order

## Getting Started

### Prerequisites

- Node.js 22.0.0 or higher
- Wallet with Base Sepolia testnet ETH
- Access to deployed DCipherSwap contracts

### Installation

```bash
cd frontend
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_DCIPHER_SWAP_ADDRESS=deployed_contract_address
NEXT_PUBLIC_BATCHER_CONTRACT_ADDRESS=deployed_contract_address
NEXT_PUBLIC_EXECUTOR_CONTRACT_ADDRESS=deployed_contract_address
NEXT_PUBLIC_CONFIG_CONTRACT_ADDRESS=deployed_contract_address
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

```bash
npm run build
npm start
```

## Usage

### 1. Connect Wallet
- Click "Connect Wallet" to connect your Web3 wallet
- Ensure you're connected to Base Sepolia testnet

### 2. Configure Swap
- Select input and output tokens
- Enter swap amount
- Adjust slippage tolerance and deadline in settings

### 3. Execute Swap
- Click "Swap" to initiate the MEV-protected transaction
- Monitor transaction status in real-time
- Wait for decryption and execution

### 4. Monitor Transactions
- View recent transactions in the sidebar
- Track encryption, batching, and execution status
- Access transaction details on Base Sepolia explorer

## Technical Details

### Encryption Implementation

The frontend uses a mock encryption system for demonstration. In production:

1. **Fetch public key** from Keyper committee API
2. **Encrypt swap data** using elliptic curve cryptography
3. **Submit ciphertext** to smart contracts
4. **Monitor decryption** at target block height

### Contract Addresses

Update the contract addresses in `lib/blockchain.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  DCIPHER_SWAP: "0x...", // Your deployed DCipherSwap address
  BATCHER_CONTRACT: "0x...", // Your deployed BatcherContract address
  EXECUTOR_CONTRACT: "0x...", // Your deployed ExecutorContract address
  CONFIG_CONTRACT: "0x...", // Your deployed ConfigContract address
};
```

### Network Configuration

The frontend is configured for Base Sepolia testnet. To support other networks:

1. Update `useNetworkConfig` hook
2. Add network-specific contract addresses
3. Configure gas parameters and block times

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions and support:
- Check the documentation
- Open an issue on GitHub
- Contact the DCipher team

---

**Note**: This is an MVP implementation. Production deployment requires:
- Real encryption implementation
- Proper key management
- Security audits
- Performance optimization
- Error handling improvements
