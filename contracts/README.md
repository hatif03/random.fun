# DCipher Smart Contracts

This repository contains the smart contracts for DCipher, a decentralized exchange (DEX) that uses Blocklock for encrypted transaction processing and MEV protection.

## Architecture Overview

The system follows a modular architecture with three main contracts:

### 1. ConfigContract
- **Purpose**: Central source of truth for system parameters
- **Management**: Controlled by DAO or multisig wallet
- **Key Features**:
  - Configurable batch parameters (size, span, limits)
  - Keyper committee management
  - Fee receiver configuration
  - Target contract addresses

### 2. BatcherContract
- **Purpose**: Primary entry point for encrypted transactions
- **Key Features**:
  - Accepts encrypted user transactions
  - Organizes transactions into batches
  - Enforces size limits and batch rules
  - Emits events for off-chain sequencers

### 3. ExecutorContract
- **Purpose**: Executes decrypted transactions
- **Key Features**:
  - Processes batches in committed order
  - Calls DEX router with decrypted data
  - Maintains execution state
  - Emergency pause functionality

### 4. DCipherSwap
- **Purpose**: Main user interface contract
- **Key Features**:
  - Integrates with Blocklock for encryption/decryption
  - Manages swap request lifecycle
  - Handles both direct funding and subscription modes
  - Coordinates with other contracts

## How It Works

### 1. Transaction Submission
1. User encrypts their swap data off-chain
2. User calls `createTimelockSwapRequest()` on `DCipherSwap`
3. Contract creates Blocklock request for decryption
4. Encrypted transaction is submitted to `BatcherContract`

### 2. Batching
1. `BatcherContract` collects encrypted transactions
2. Transactions are organized into time-based batches
3. When batch span is reached, batch is finalized
4. Off-chain sequencers observe finalized batches

### 3. Decryption
1. Blocklock committee releases decryption key
2. `DCipherSwap` receives key via `_onBlocklockReceived()`
3. Swap data is decrypted and validated
4. Request is marked as processed

### 4. Execution
1. User calls `executeSwap()` when ready
2. `ExecutorContract` processes the batch
3. Decrypted swap data is sent to DEX router
4. Swap is executed in the committed order

## Key Features

### MEV Protection
- **Encrypted Transactions**: All swap details are encrypted until execution
- **Batch Processing**: Transactions are executed in committed order
- **Time Delays**: Configurable delays between encryption and decryption

### Scalability
- **Configurable Batching**: Adjustable batch sizes and time spans
- **Size Limits**: Configurable transaction and batch size limits
- **Gas Optimization**: Efficient batch processing

### Security
- **Access Control**: Owner-only configuration updates
- **Sequencer Authorization**: Only authorized sequencers can execute
- **Emergency Functions**: Owner can pause problematic batches

### Governance
- **Configurable Parameters**: All key parameters can be updated
- **Committee Management**: Keyper addresses and thresholds configurable
- **Upgrade Path**: New configurations can be scheduled in advance

## Contract Addresses

The system supports multiple networks with different Blocklock addresses:

- **Filecoin Mainnet**: `0x34092470CC59A097d770523931E3bC179370B44b`
- **Filecoin Calibration**: `0xF00aB3B64c81b6Ce51f8220EB2bFaa2D469cf702`
- **Arbitrum Sepolia**: `0xd22302849a87d5B00f13e504581BC086300DA080`
- **Optimism Sepolia**: `0xd22302849a87d5B00f13e504581BC086300DA080`
- **Base Sepolia**: `0x82Fed730CbdeC5A2D8724F2e3b316a70A565e27e`

## Development

### Prerequisites
- Foundry (latest version)
- Solidity ^0.8.20

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd dcipher-swap/contracts

# Install dependencies
forge install

# Build contracts
forge build

# Run tests
forge test

# Run tests with coverage
forge coverage
```

### Deployment

#### Quick Deployment

The easiest way to deploy is using our deployment scripts:

**Linux/macOS:**
```bash
# Make script executable (first time only)
chmod +x deploy.sh

# Deploy to Base Sepolia testnet
./deploy.sh -n base_sepolia -k your_private_key_here

# Deploy to Filecoin Calibration testnet
./deploy.sh -n filecoin_calibration -k your_private_key_here

# Deploy with custom addresses
./deploy.sh -n base_sepolia -k your_private_key -s 0x1234... -d 0x5678...
```

**Windows:**
```cmd
# Deploy to Base Sepolia testnet
deploy.bat -n base_sepolia -k your_private_key_here

# Deploy to Filecoin Calibration testnet
deploy.bat -n filecoin_calibration -k your_private_key_here
```

#### Manual Deployment

For manual deployment:
```bash
# Set environment variables
export PRIVATE_KEY=your_private_key
export RPC_URL=your_rpc_url

# Deploy contracts
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast
```

#### Environment Configuration

You can also use environment variables for configuration:
1. Copy `env.template` to `.env`
2. Fill in your configuration values
3. The deployment scripts will automatically use these values

#### Supported Networks

- **Filecoin Mainnet** (Chain ID: 314)
- **Filecoin Calibration Testnet** (Chain ID: 314159)
- **Arbitrum Sepolia Testnet** (Chain ID: 421614)
- **Optimism Sepolia Testnet** (Chain ID: 11155420)
- **Base Sepolia Testnet** (Chain ID: 84532)

#### Deployment Options

- `-n, --network`: Target network
- `-k, --key`: Private key for deployment
- `-r, --rpc`: Custom RPC URL
- `-s, --sequencer`: Sequencer address
- `-d, --dex-router`: DEX router address
- `-o, --owner`: Owner address
- `-h, --help`: Show help message

### Testing
```bash
# Run all tests
forge test

# Run specific test
forge test --match-test test_ContractDeployment

# Run tests with verbose output
forge test -vvv
```

## Configuration

### Default Parameters
- **Batch Span**: 100 blocks
- **Transaction Size Limit**: 1KB
- **Batch Size Limit**: 10KB
- **Keyper Threshold**: 2 out of 3 (configurable)

### Customization
All parameters can be customized through the `ConfigContract`:
- Batch timing and size limits
- Keyper committee composition
- Fee receiver addresses
- Target contract addresses

## Security Considerations

### Access Control
- Configuration updates require owner privileges
- Batch execution limited to authorized sequencers
- Emergency functions restricted to contract owner

### Encryption
- Uses Blocklock's proven encryption scheme
- Decryption keys managed by trusted committee
- Time-based decryption prevents front-running

### Validation
- Comprehensive input validation
- Size limits enforced at multiple levels
- State consistency checks throughout

## Integration

### Frontend Integration
The contracts emit events that frontends can listen to:
- `SwapRequestCreated`: New swap request submitted
- `TransactionAdded`: Transaction added to batch
- `BatchFinalized`: Batch ready for processing
- `SwapExecuted`: Swap completed

### DEX Integration
The `ExecutorContract` can integrate with any DEX by:
- Calling the appropriate function selector
- Passing decrypted swap parameters
- Handling execution results

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## Support

For questions and support:
- Create an issue on GitHub
- Join our Discord community
- Check the documentation

## Roadmap

- [ ] Multi-token support
- [ ] Advanced order types
- [ ] Cross-chain functionality
- [ ] Enhanced governance features
- [ ] Performance optimizations
