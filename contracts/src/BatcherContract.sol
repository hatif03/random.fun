// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ConfirmedOwner} from "blocklock-solidity/access/ConfirmedOwner.sol";
import {TypesLib} from "blocklock-solidity/libraries/TypesLib.sol";
import "./ConfigContract.sol";

/// @title BatcherContract
/// @notice Primary on-chain entry point for users to submit encrypted transactions
/// @author DCipher Team
contract BatcherContract is ConfirmedOwner {
    
    /// @notice Reference to the configuration contract
    ConfigContract public immutable configContract;
    
    /// @notice Next batch index to be created
    uint64 public nextBatchIndex;
    
    /// @notice Mapping from batch index to batch data
    mapping(uint64 => Batch) public batches;
    
    /// @notice Mapping from request ID to batch index
    mapping(uint256 => uint64) public requestIdToBatchIndex;
    
    /// @notice Current active batch index
    uint64 public currentBatchIndex;
    
    /// @notice Struct to store batch information
    struct Batch {
        uint64 batchIndex;
        uint64 startBlock;
        uint64 endBlock;
        bytes[] encryptedTransactions;
        uint256 totalSize;
        bool isFinalized;
        bool isExecuted;
    }
    
    /// @notice Struct to store transaction metadata
    struct TransactionMetadata {
        uint64 batchIndex;
        uint256 requestId;
        address sender;
        uint256 timestamp;
        uint256 size;
    }
    
    /// @notice Events
    event TransactionAdded(
        uint64 indexed batchIndex,
        uint256 indexed requestId,
        address indexed sender,
        bytes encryptedTransaction,
        uint256 size
    );
    
    event BatchFinalized(uint64 indexed batchIndex, uint64 startBlock, uint64 endBlock);
    event BatchExecuted(uint64 indexed batchIndex);
    
    /// @notice Modifier to ensure batch is active
    modifier onlyActiveBatch(uint64 batchIndex) {
        require(batches[batchIndex].batchIndex == batchIndex, "Batch does not exist");
        require(!batches[batchIndex].isFinalized, "Batch already finalized");
        _;
    }
    
    /// @notice Modifier to ensure batch is finalized
    modifier onlyFinalizedBatch(uint64 batchIndex) {
        require(batches[batchIndex].isFinalized, "Batch not finalized");
        require(!batches[batchIndex].isExecuted, "Batch already executed");
        _;
    }
    
    /// @notice Constructor
    /// @param _configContractAddress Address of the ConfigContract
    constructor(address _configContractAddress) ConfirmedOwner(msg.sender) {
        require(_configContractAddress != address(0), "Config contract cannot be zero");
        configContract = ConfigContract(_configContractAddress);
        
        // Initialize first batch
        _createNewBatch();
    }
    
    /// @notice Submit an encrypted transaction to the current batch
    /// @param _encryptedTx The encrypted transaction data
    /// @return batchIndex The batch index where the transaction was added
    /// @return requestId The unique request ID for this transaction
    function submitTransaction(bytes calldata _encryptedTx) external returns (uint64 batchIndex, uint256 requestId) {
        require(_encryptedTx.length > 0, "Transaction cannot be empty");
        
        // Get current batch index
        batchIndex = _getCurrentBatchIndex();
        
        // Ensure batch exists and is active
        if (batches[batchIndex].batchIndex != batchIndex || batches[batchIndex].isFinalized) {
            _createNewBatch();
            batchIndex = _getCurrentBatchIndex();
        }
        
        // Get configuration for this batch
        ConfigContract.BatchConfig memory config = configContract.getConfigForBatch(batchIndex);
        
        // Validate transaction size
        require(_encryptedTx.length <= config.transactionSizeLimit, "Transaction too large");
        
        // Check if adding this transaction would exceed batch size limit
        require(
            batches[batchIndex].totalSize + _encryptedTx.length <= config.batchSizeLimit,
            "Batch size limit exceeded"
        );
        
        // Generate unique request ID
        requestId = _generateRequestId(batchIndex, msg.sender, _encryptedTx);
        
        // Add transaction to batch
        batches[batchIndex].encryptedTransactions.push(_encryptedTx);
        batches[batchIndex].totalSize += _encryptedTx.length;
        
        // Store metadata
        requestIdToBatchIndex[requestId] = batchIndex;
        
        emit TransactionAdded(batchIndex, requestId, msg.sender, _encryptedTx, _encryptedTx.length);
        
        // Check if batch should be finalized
        _checkAndFinalizeBatch(batchIndex);
    }
    
    /// @notice Finalize a batch (can be called by anyone when conditions are met)
    /// @param batchIndex The batch index to finalize
    function finalizeBatch(uint64 batchIndex) external {
        require(batches[batchIndex].batchIndex == batchIndex, "Batch does not exist");
        require(!batches[batchIndex].isFinalized, "Batch already finalized");
        
        // Get configuration for this batch
        ConfigContract.BatchConfig memory config = configContract.getConfigForBatch(batchIndex);
        
        // Check if batch span has been reached
        require(
            block.number >= batches[batchIndex].startBlock + config.batchSpan,
            "Batch span not reached"
        );
        
        _finalizeBatch(batchIndex);
    }
    
    /// @notice Mark a batch as executed (only callable by executor contract)
    /// @param batchIndex The batch index to mark as executed
    function markBatchExecuted(uint64 batchIndex) external {
        require(msg.sender == _getExecutorAddress(), "Only executor can mark batch executed");
        require(batches[batchIndex].isFinalized, "Batch not finalized");
        require(!batches[batchIndex].isExecuted, "Batch already executed");
        
        batches[batchIndex].isExecuted = true;
        emit BatchExecuted(batchIndex);
    }
    
    /// @notice Get batch information
    /// @param batchIndex The batch index
    /// @return batch The batch information
    function getBatch(uint64 batchIndex) external view returns (Batch memory batch) {
        return batches[batchIndex];
    }
    
    /// @notice Get encrypted transactions for a batch
    /// @param batchIndex The batch index
    /// @return transactions Array of encrypted transactions
    function getBatchTransactions(uint64 batchIndex) external view returns (bytes[] memory transactions) {
        return batches[batchIndex].encryptedTransactions;
    }
    
    /// @notice Get current batch index
    /// @return batchIndex The current batch index
    function getCurrentBatchIndex() external view returns (uint64) {
        return _getCurrentBatchIndex();
    }
    
    /// @notice Check if a batch is ready for finalization
    /// @param batchIndex The batch index to check
    /// @return ready True if batch is ready for finalization
    function isBatchReadyForFinalization(uint64 batchIndex) external view returns (bool ready) {
        if (batches[batchIndex].batchIndex != batchIndex || batches[batchIndex].isFinalized) {
            return false;
        }
        
        ConfigContract.BatchConfig memory config = configContract.getConfigForBatch(batchIndex);
        return block.number >= batches[batchIndex].startBlock + config.batchSpan;
    }
    
    /// @notice Internal function to create a new batch
    function _createNewBatch() internal {
        uint64 newBatchIndex = nextBatchIndex;
        nextBatchIndex++;
        
        batches[newBatchIndex] = Batch({
            batchIndex: newBatchIndex,
            startBlock: uint64(block.number),
            endBlock: 0,
            encryptedTransactions: new bytes[](0),
            totalSize: 0,
            isFinalized: false,
            isExecuted: false
        });
        
        currentBatchIndex = newBatchIndex;
    }
    
    /// @notice Internal function to get current batch index
    function _getCurrentBatchIndex() internal view returns (uint64) {
        return currentBatchIndex;
    }
    
    /// @notice Internal function to check and finalize batch if conditions are met
    function _checkAndFinalizeBatch(uint64 batchIndex) internal {
        ConfigContract.BatchConfig memory config = configContract.getConfigForBatch(batchIndex);
        
        if (block.number >= batches[batchIndex].startBlock + config.batchSpan) {
            _finalizeBatch(batchIndex);
        }
    }
    
    /// @notice Internal function to finalize a batch
    function _finalizeBatch(uint64 batchIndex) internal {
        batches[batchIndex].endBlock = uint64(block.number);
        batches[batchIndex].isFinalized = true;
        
        emit BatchFinalized(batchIndex, batches[batchIndex].startBlock, batches[batchIndex].endBlock);
        
        // Create new batch for next transactions
        _createNewBatch();
    }
    
    /// @notice Internal function to generate a unique request ID
    function _generateRequestId(uint64 batchIndex, address sender, bytes calldata data) internal view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(
            batchIndex,
            sender,
            data,
            block.timestamp,
            block.prevrandao
        )));
    }
    
    /// @notice Internal function to get executor address from config
    function _getExecutorAddress() internal view returns (address) {
        ConfigContract.BatchConfig memory config = configContract.getCurrentConfig();
        return config.targetAddress;
    }
} 
