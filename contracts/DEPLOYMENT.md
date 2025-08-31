# 🚀 Base Sepolia Deployment Guide

## Prerequisites

1. **Base Sepolia ETH**: You need testnet ETH for gas fees
   - Get it from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)

2. **Wallet Setup**: Ensure you have a wallet with a private key

## Configuration

1. **Copy .env file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit .env file** with your credentials:
   ```env
   BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
   PRIVATE_KEY=your_actual_private_key_here
   ```

   **⚠️ Important**: 
   - Never commit your private key to version control
   - Remove the 0x prefix from your private key if present
   - Keep your private key secure

## Deployment

### Option 1: Deploy with Mock Contracts (Testing)
```bash
npx hardhat run scripts/deploy-base-sepolia.cjs --network baseSepolia
```

### Option 2: Deploy Production Contracts
1. Update the script with real addresses:
   - `RANDOMNESS_SENDER_ADDRESS`: Randamu VRF contract address
   - `REWARD_TOKEN_ADDRESS`: Your reward token contract address
   - `DCIPHER_SIGNER_ADDRESS`: Dcipher network signer address

2. Run deployment:
   ```bash
   npx hardhat run scripts/deploy-base-sepolia.cjs --network baseSepolia
   ```

## Post-Deployment

1. **Verify Contracts** on [Base Sepolia Explorer](https://sepolia.basescan.org/)
2. **Setup Campaign** with participant addresses
3. **Test VRF Functionality** with small amounts first
4. **Monitor Gas Usage** and optimize if needed

## Network Information

- **Chain ID**: 84532
- **RPC URL**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org/
- **Currency**: ETH (testnet)

## Troubleshooting

- **Insufficient Balance**: Get testnet ETH from faucet
- **Gas Issues**: Check network congestion and adjust gas price
- **Contract Verification**: Use Base Sepolia block explorer verification tools

