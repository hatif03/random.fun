import { ethers } from "ethers";
import { useEthersProvider, useEthersSigner } from "@/hooks/useEthers";

// Contract addresses for Base Sepolia (update these with your deployed addresses)
export const CONTRACT_ADDRESSES = {
  DCIPHER_SWAP: "0x0000000000000000000000000000000000000000", // Update with actual address
  BATCHER_CONTRACT: "0x0000000000000000000000000000000000000000", // Update with actual address
  EXECUTOR_CONTRACT: "0x0000000000000000000000000000000000000000", // Update with actual address
  CONFIG_CONTRACT: "0x0000000000000000000000000000000000000000", // Update with actual address
};

// DCipherSwap contract ABI
export const DCIPHER_SWAP_ABI = [
  // Core swap functions
  "function createTimelockSwapRequest(uint32 callbackGasLimit, uint32 encryptedAt, uint32 decryptedAt, bytes calldata condition, tuple(tuple(uint256[2] x, uint256[2] y) u, bytes v, bytes w) calldata encryptedData) external payable returns (uint256 requestId, uint256 requestPrice)",
  "function createTimelockSwapRequestWithSubscription(uint32 callbackGasLimit, uint32 encryptedAt, uint32 decryptedAt, bytes calldata condition, tuple(tuple(uint256[2] x, uint256[2] y) u, bytes v, bytes w) calldata encryptedData) external returns (uint256 requestId)",
  
  // Query functions
  "function getSwapRequest(uint256 requestId) external view returns (tuple(address requester, uint64 batchIndex, uint32 encryptedAt, uint32 decryptedAt, tuple(tuple(uint256[2] x, uint256[2] y) u, bytes v, bytes w) encryptedData, tuple(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOutMin, address recipient, uint256 deadline, bytes swapCalldata) swapData, bool isProcessed, bool isExecuted) request)",
  "function isRequestReadyForExecution(uint256 requestId) external view returns (bool ready)",
  "function getUserSwapRequests(address user) external view returns (uint256[] memory requestIds)",
  
  // Execution functions
  "function executeSwap(uint256 requestId) external returns (bool success)",
  
  // Events
  "event SwapRequestCreated(uint256 indexed requestId, uint64 indexed batchIndex, address indexed requester, uint32 encryptedAt, uint32 decryptedAt)",
  "event SwapRequestProcessed(uint256 indexed requestId, tuple(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOutMin, address recipient, uint256 deadline, bytes swapCalldata) swapData)",
  "event SwapExecuted(uint256 indexed requestId, bool success)",
];

// BatcherContract ABI
export const BATCHER_CONTRACT_ABI = [
  "function submitTransaction(bytes calldata _encryptedTx) external returns (uint64 batchIndex, uint256 requestId)",
  "function getCurrentBatchIndex() external view returns (uint64)",
  "function getBatch(uint64 batchIndex) external view returns (tuple(uint64 batchIndex, uint64 startBlock, uint64 endBlock, bytes[] encryptedTransactions, uint256 totalSize, bool isFinalized, bool isExecuted) batch)",
  "function finalizeBatch(uint64 batchIndex) external",
  
  // Events
  "event TransactionAdded(uint64 indexed batchIndex, uint256 indexed requestId, address indexed sender, bytes encryptedTransaction, uint256 size)",
  "event BatchFinalized(uint64 indexed batchIndex, uint64 startBlock, uint64 endBlock)",
  "event BatchExecuted(uint64 indexed batchIndex)",
];

// ExecutorContract ABI
export const EXECUTOR_CONTRACT_ABI = [
  "function executeBatch(uint64 batchIndex, bytes[] calldata transactions) external returns (bool success)",
  "function getBatchStatus(uint64 batchIndex) external view returns (bool isExecuted, uint256 executionTime)",
  
  // Events
  "event BatchExecuted(uint64 indexed batchIndex, bool success, uint256 executionTime)",
];

// ConfigContract ABI
export const CONFIG_CONTRACT_ABI = [
  "function getActiveConfig(uint64 batchIndex) external view returns (tuple(uint64 startBatchIndex, uint64 startBlockNumber, uint32 batchSpan, address[] keypers, uint32 threshold, uint64 transactionSizeLimit, uint64 batchSizeLimit, address feeReceiver, address targetAddress, bytes4 targetFunctionSelector, bool isActive) config)",
  "function getCurrentConfig() external view returns (tuple(uint64 startBatchIndex, uint64 startBlockNumber, uint32 batchSpan, address[] keypers, uint32 threshold, uint64 transactionSizeLimit, uint64 batchSizeLimit, address feeReceiver, address targetAddress, bytes4 targetFunctionSelector, bool isActive) config)",
];

/**
 * Create contract instances for the DCipherSwap system
 */
export const createContractInstances = (signer: ethers.Signer) => {
  const dCipherSwap = new ethers.Contract(
    CONTRACT_ADDRESSES.DCIPHER_SWAP,
    DCIPHER_SWAP_ABI,
    signer
  );
  
  const batcherContract = new ethers.Contract(
    CONTRACT_ADDRESSES.BATCHER_CONTRACT,
    BATCHER_CONTRACT_ABI,
    signer
  );
  
  const executorContract = new ethers.Contract(
    CONTRACT_ADDRESSES.EXECUTOR_CONTRACT,
    EXECUTOR_CONTRACT_ABI,
    signer
  );
  
  const configContract = new ethers.Contract(
    CONTRACT_ADDRESSES.CONFIG_CONTRACT,
    CONFIG_CONTRACT_ABI,
    signer
  );
  
  return {
    dCipherSwap,
    batcherContract,
    executorContract,
    configContract,
  };
};

/**
 * Get contract instances using the current signer
 */
export const useContractInstances = () => {
  const signer = useEthersSigner();
  
  if (!signer) {
    return null;
  }
  
  return createContractInstances(signer);
};

/**
 * Estimate gas for creating a timelock swap request
 */
export const estimateSwapRequestGas = async (
  contract: ethers.Contract,
  callbackGasLimit: number,
  encryptedAt: number,
  decryptedAt: number,
  condition: string,
  encryptedData: any,
  value: bigint
): Promise<bigint> => {
  try {
    const gasEstimate = await contract.createTimelockSwapRequest.estimateGas(
      callbackGasLimit,
      encryptedAt,
      decryptedAt,
      condition,
      encryptedData,
      { value }
    );
    
    // Add buffer for gas estimation
    return (gasEstimate * BigInt(120)) / BigInt(100); // 20% buffer
  } catch (error) {
    console.error("Gas estimation failed:", error);
    throw new Error("Failed to estimate gas for swap request");
  }
};

/**
 * Get current batch information
 */
export const getCurrentBatchInfo = async (
  batcherContract: ethers.Contract
): Promise<{
  batchIndex: bigint;
  startBlock: bigint;
  endBlock: bigint;
  isFinalized: boolean;
  isExecuted: boolean;
}> => {
  try {
    const currentBatchIndex = await batcherContract.getCurrentBatchIndex();
    const batch = await batcherContract.getBatch(currentBatchIndex);
    
    return {
      batchIndex: batch.batchIndex,
      startBlock: batch.startBlock,
      endBlock: batch.endBlock,
      isFinalized: batch.isFinalized,
      isExecuted: batch.isExecuted,
    };
  } catch (error) {
    console.error("Failed to get current batch info:", error);
    throw new Error("Failed to get batch information");
  }
};

/**
 * Get active configuration for the current batch
 */
export const getActiveConfig = async (
  configContract: ethers.Contract,
  batchIndex: bigint
): Promise<{
  batchSpan: number;
  threshold: number;
  transactionSizeLimit: bigint;
  batchSizeLimit: bigint;
  keypers: string[];
}> => {
  try {
    const config = await configContract.getActiveConfig(batchIndex);
    
    return {
      batchSpan: Number(config.batchSpan),
      threshold: Number(config.threshold),
      transactionSizeLimit: config.transactionSizeLimit,
      batchSizeLimit: config.batchSizeLimit,
      keypers: config.keypers,
    };
  } catch (error) {
    console.error("Failed to get active config:", error);
    throw new Error("Failed to get configuration");
  }
};

/**
 * Submit an encrypted transaction to the batcher
 */
export const submitEncryptedTransaction = async (
  batcherContract: ethers.Contract,
  encryptedTx: string
): Promise<{
  batchIndex: bigint;
  requestId: bigint;
}> => {
  try {
    const result = await batcherContract.submitTransaction(encryptedTx);
    
    return {
      batchIndex: result.batchIndex,
      requestId: result.requestId,
    };
  } catch (error) {
    console.error("Failed to submit encrypted transaction:", error);
    throw new Error("Failed to submit transaction to batcher");
  }
};

/**
 * Check if a swap request is ready for execution
 */
export const checkSwapRequestStatus = async (
  dCipherSwap: ethers.Contract,
  requestId: bigint
): Promise<{
  isProcessed: boolean;
  isExecuted: boolean;
  isReady: boolean;
}> => {
  try {
    const request = await dCipherSwap.getSwapRequest(requestId);
    const isReady = await dCipherSwap.isRequestReadyForExecution(requestId);
    
    return {
      isProcessed: request.isProcessed,
      isExecuted: request.isExecuted,
      isReady,
    };
  } catch (error) {
    console.error("Failed to check swap request status:", error);
    throw new Error("Failed to check request status");
  }
};

/**
 * Execute a swap request
 */
export const executeSwapRequest = async (
  dCipherSwap: ethers.Contract,
  requestId: bigint
): Promise<boolean> => {
  try {
    const tx = await dCipherSwap.executeSwap(requestId);
    const receipt = await tx.wait(2);
    
    // Check if the transaction was successful
    return receipt.status === 1;
  } catch (error) {
    console.error("Failed to execute swap request:", error);
    throw new Error("Failed to execute swap");
  }
};
