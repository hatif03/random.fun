// Configuration for DCipher Swap Frontend
export const CONFIG = {
  // Network Configuration
  NETWORK: {
    name: "Base Sepolia",
    chainId: 84532,
    rpcUrl: "https://sepolia.base.org",
    explorer: "https://sepolia.basescan.org",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    blockTime: 1, // seconds per block
  },

  // Contract Addresses (Update these with your deployed addresses)
  CONTRACTS: {
    DCIPHER_SWAP: process.env.NEXT_PUBLIC_DCIPHER_SWAP_ADDRESS || "0x0000000000000000000000000000000000000000",
    BATCHER_CONTRACT: process.env.NEXT_PUBLIC_BATCHER_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
    EXECUTOR_CONTRACT: process.env.NEXT_PUBLIC_EXECUTOR_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
    CONFIG_CONTRACT: process.env.NEXT_PUBLIC_CONFIG_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
  },

  // Swap Configuration
  SWAP: {
    defaultSlippage: 0.5, // 0.5%
    maxSlippage: 50, // 50%
    minSlippage: 0.1, // 0.1%
    defaultDeadline: 20, // 20 minutes
    maxDeadline: 1440, // 24 hours
    minDeadline: 1, // 1 minute
    blocksAhead: 10, // Default blocks ahead for decryption
  },

  // Gas Configuration
  GAS: {
    defaultCallbackGasLimit: 100000,
    gasBufferPercent: 20, // 20% buffer for gas estimation
    maxGasLimit: 500000,
  },

  // UI Configuration
  UI: {
    maxRecentTransactions: 10,
    transactionPollingInterval: 5000, // 5 seconds
    maxPollingTime: 600000, // 10 minutes
    priceUpdateInterval: 30000, // 30 seconds
  },

  // API Endpoints (for production)
  API: {
    keyperCommittee: process.env.NEXT_PUBLIC_KEYPER_API_URL || "https://api.keyper.example.com",
    priceFeeds: process.env.NEXT_PUBLIC_PRICE_API_URL || "https://api.prices.example.com",
    gasEstimates: process.env.NEXT_PUBLIC_GAS_API_URL || "https://api.gas.example.com",
  },

  // Feature Flags
  FEATURES: {
    enableRealEncryption: false, // Set to true in production
    enablePriceFeeds: false, // Set to true when price API is available
    enableGasOptimization: true,
    enableTransactionHistory: true,
    enableAdvancedSettings: true,
  },
};

// Token configuration
export const SUPPORTED_TOKENS = [
  {
    address: "0x0000000000000000000000000000000000000000",
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    logoURI: "/assets/logos/eth.svg",
    isNative: true,
    coingeckoId: "ethereum",
  },
  {
    address: "0x4200000000000000000000000000000000000006",
    symbol: "WETH",
    name: "Wrapped Ethereum",
    decimals: 18,
    logoURI: "/assets/logos/weth.svg",
    isNative: false,
    coingeckoId: "weth",
  },
  {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logoURI: "/assets/logos/usdc.svg",
    isNative: false,
    coingeckoId: "usd-coin",
  },
];

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: "Please connect your wallet to continue",
  INSUFFICIENT_BALANCE: "Insufficient balance for this transaction",
  INVALID_AMOUNT: "Please enter a valid amount",
  SLIPPAGE_TOO_HIGH: "Slippage tolerance is too high",
  DEADLINE_EXPIRED: "Transaction deadline has expired",
  ENCRYPTION_FAILED: "Failed to encrypt transaction data",
  SUBMISSION_FAILED: "Failed to submit transaction to mempool",
  EXECUTION_FAILED: "Failed to execute swap transaction",
  NETWORK_ERROR: "Network error. Please try again",
  CONTRACT_ERROR: "Smart contract error. Please check your inputs",
};

// Success messages
export const SUCCESS_MESSAGES = {
  TRANSACTION_SUBMITTED: "Transaction submitted successfully",
  TRANSACTION_CONFIRMED: "Transaction confirmed on blockchain",
  SWAP_EXECUTED: "Swap executed successfully",
  SETTINGS_SAVED: "Settings saved successfully",
};

// Validation rules
export const VALIDATION_RULES = {
  MIN_AMOUNT: 0.000001, // Minimum swap amount
  MAX_AMOUNT: 1000000, // Maximum swap amount
  MIN_SLIPPAGE: 0.1, // Minimum slippage tolerance
  MAX_SLIPPAGE: 50, // Maximum slippage tolerance
  MIN_DEADLINE: 1, // Minimum deadline in minutes
  MAX_DEADLINE: 1440, // Maximum deadline in minutes
};
