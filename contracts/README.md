# VRF-Powered Campaign Selection & Reward Escrow System

This project implements a two-contract system for fair participant selection using Randamu's VRF (Verifiable Random Function) and conditional reward distribution through dcipher's conditional signing service.

## Overview

The system consists of two main contracts:

1. **CampaignManager.sol** - Handles VRF-powered selection of whitelist participants
2. **RewardEscrow.sol** - Manages conditional reward release based on dcipher's conditional signing

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Campaign      │    │   Randamu VRF    │    │   dcipher       │
│   Manager       │◄──►│   Network        │    │   Conditional   │
│                 │    │                  │    │   Signing      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                                              │
         │                                              │
         ▼                                              ▼
┌─────────────────┐                            ┌─────────────────┐
│   Reward        │                            │   Reward        │
│   Escrow        │                            │   Unlock        │
│                 │                            │                 │
└─────────────────┘                            └─────────────────┘
```

## Contracts

### CampaignManager.sol

**Purpose**: Manages fair selection of whitelist participants using Randamu's VRF.

**Key Features**:
- Inherits from `RandomnessReceiverBase` for VRF integration
- Configurable participant pool and winner count
- Deterministic winner selection using Fisher-Yates shuffle
- Owner-only campaign setup and VRF request functions

**State Variables**:
- `eligibleParticipants[]` - Array of eligible participant addresses
- `winners[]` - Array of selected winner addresses
- `isWinnerMapping` - Mapping for efficient winner status checks
- `isSelectionComplete` - Flag indicating VRF process completion

**Core Functions**:
- `setupCampaign(address[] participants, uint256 winnerCount)` - Setup campaign parameters
- `requestWinnerSelection(uint32 callbackGasLimit)` - Trigger VRF selection
- `onRandomnessReceived(uint256 requestID, bytes32 randomness)` - VRF callback handler

### RewardEscrow.sol

**Purpose**: Holds rewards and releases them only when triggered by dcipher's conditional signing service.

**Key Features**:
- ERC20 token reward management
- Conditional unlock mechanism (dcipher signer only)
- Equal distribution among winners
- Anti-double-claim protection
- Emergency withdrawal capabilities

**State Variables**:
- `campaignManager` - Reference to CampaignManager contract
- `rewardToken` - ERC20 token address for rewards
- `dcipherSigner` - Hardcoded dcipher network signing address
- `areRewardsUnlocked` - Flag for reward unlock status

**Core Functions**:
- `deposit(uint256 amount)` - Deposit reward tokens (owner only)
- `unlockRewards()` - Unlock rewards (dcipher signer only)
- `claimReward()` - Claim rewards (winners only)

## Deployment

### Prerequisites

1. Install dependencies:
```bash
pnpm install
```

2. Required addresses:
   - **RandomnessSender**: Official Randamu contract address on Base Sepolia
   - **RewardToken**: ERC20 token contract address for rewards
   - **DcipherSigner**: dcipher network's conditional signing agent address

### Deployment Script

Use the provided deployment script:

```bash
npx hardhat run scripts/deploy-campaign.ts --network base-sepolia
```

**Note**: Update the placeholder addresses in the script before deployment.

## Usage Flow

### 1. Campaign Setup

```solidity
// Setup campaign with participants
address[] memory participants = [addr1, addr2, addr3, addr4, addr5];
uint256 winnerCount = 2;
campaignManager.setupCampaign(participants, winnerCount);
```

### 2. VRF Selection

```solidity
// Request winner selection (requires ETH for gas)
uint32 callbackGasLimit = 100000;
campaignManager.requestWinnerSelection{value: requestPrice}(callbackGasLimit);
```

### 3. Reward Deposit

```solidity
// Approve and deposit rewards
rewardToken.approve(rewardEscrowAddress, rewardAmount);
rewardEscrow.deposit(rewardAmount);
```

### 4. Conditional Unlock

```solidity
// Only dcipher network can call this
rewardEscrow.unlockRewards();
```

### 5. Reward Claims

```solidity
// Winners can claim their rewards
rewardEscrow.claimReward();
```

## Testing

Run the test suite:

```bash
npx hardhat test
```

The tests include:
- Campaign setup and validation
- VRF selection process
- Reward deposit and unlock
- Winner claim functionality
- Access control validation

## Security Features

- **Access Control**: Owner-only functions for critical operations
- **VRF Security**: Uses Randamu's verifiable randomness
- **Conditional Release**: Rewards only unlock via dcipher network
- **Anti-Double-Claim**: Mapping prevents multiple claims
- **Emergency Withdrawal**: Owner can withdraw before unlock
- **Input Validation**: Comprehensive parameter validation

## Network Configuration

### Base Sepolia

- **RandomnessSender**: [Get from Randamu documentation]
- **Chain ID**: 84532
- **Currency**: ETH

## Dependencies

- `randomness-solidity`: Randamu's VRF implementation
- `@openzeppelin/contracts`: OpenZeppelin's secure contract library
- `hardhat`: Development and testing framework

## License

MIT License - see LICENSE file for details.

## Support

For questions or issues:
- Randamu VRF: [Documentation link]
- dcipher Network: [Documentation link]
- Contract Issues: [Repository issues]
