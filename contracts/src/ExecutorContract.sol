// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ConfirmedOwner} from "blocklock-solidity/access/ConfirmedOwner.sol";
import "./ConfigContract.sol";
import "./BatcherContract.sol";

/// @title ExecutorContract
/// @notice Executes decrypted transactions in the order they were committed
/// @author DCipher Team
contract ExecutorContract is ConfirmedOwner {
    
    /// @notice Reference to the configuration contract
    ConfigContract public immutable configContract;
    
    /// @notice Reference to the batcher contract
    BatcherContract public immutable batcherContract;
    
    /// @notice The authorized sequencer address that can execute batches
    address public sequencer;
    
    /// @notice The DEX router address for executing swaps
    address public dexRouter;
    
    /// @notice Mapping to track executed batches
    mapping(uint64 => bool) public executedBatches;
    
    /// @notice Events
    event BatchExecuted(uint64 indexed batchIndex, uint256 transactionCount, bool success);
    event TransactionExecuted(uint64 indexed batchIndex, uint256 transactionIndex, bool success, bytes result);
    event SequencerUpdated(address indexed oldSequencer, address indexed newSequencer);
    event DexRouterUpdated(address indexed oldRouter, address indexed newRouter);
    
    /// @notice Modifier to ensure only sequencer can call
    modifier onlySequencer() {
        require(msg.sender == sequencer, "Caller is not the sequencer");
        _;
    }
    
    /// @notice Constructor
    /// @param _configContractAddress Address of the ConfigContract
    /// @param _batcherContractAddress Address of the BatcherContract
    /// @param _sequencerAddress Address of the authorized sequencer
    /// @param _dexRouterAddress Address of the DEX router
    constructor(
        address _configContractAddress,
        address _batcherContractAddress,
        address _sequencerAddress,
        address _dexRouterAddress
    ) ConfirmedOwner(msg.sender) {
        require(_configContractAddress != address(0), "Config contract cannot be zero");
        require(_batcherContractAddress != address(0), "Batcher contract cannot be zero");
        require(_sequencerAddress != address(0), "Sequencer cannot be zero");
        require(_dexRouterAddress != address(0), "DEX router cannot be zero");
        
        configContract = ConfigContract(_configContractAddress);
        batcherContract = BatcherContract(_batcherContractAddress);
        sequencer = _sequencerAddress;
        dexRouter = _dexRouterAddress;
    }
    
    /// @notice Execute a batch of decrypted transactions
    /// @param batchIndex The batch index to execute
    /// @param decryptedTransactions Array of decrypted transaction payloads
    /// @return success True if all transactions executed successfully
    function executeBatch(uint64 batchIndex, bytes[] calldata decryptedTransactions) 
        external 
        onlySequencer 
        returns (bool success) 
    {
        require(batchIndex < type(uint64).max, "Invalid batch index");
        require(!executedBatches[batchIndex], "Batch already executed");
        
        // Verify batch exists and is finalized
        BatcherContract.Batch memory batch = batcherContract.getBatch(batchIndex);
        require(batch.batchIndex == batchIndex, "Batch does not exist");
        require(batch.isFinalized, "Batch not finalized");
        require(!batch.isExecuted, "Batch already executed");
        
        // Verify transaction count matches
        require(
            decryptedTransactions.length == batch.encryptedTransactions.length,
            "Transaction count mismatch"
        );
        
        // Get configuration for this batch
        ConfigContract.BatchConfig memory config = configContract.getConfigForBatch(batchIndex);
        
        // Execute each transaction in order
        bool allSuccessful = true;
        for (uint256 i = 0; i < decryptedTransactions.length; i++) {
            bool txSuccess = _executeTransaction(
                decryptedTransactions[i], 
                config.targetFunctionSelector
            );
            
            if (!txSuccess) {
                allSuccessful = false;
            }
            
            emit TransactionExecuted(batchIndex, i, txSuccess, "");
        }
        
        // Mark batch as executed
        executedBatches[batchIndex] = true;
        
        // Notify batcher contract
        batcherContract.markBatchExecuted(batchIndex);
        
        emit BatchExecuted(batchIndex, decryptedTransactions.length, allSuccessful);
        
        return allSuccessful;
    }
    
    /// @notice Execute a single decrypted transaction
    /// @param decryptedPayload The decrypted transaction payload
    /// @param functionSelector The function selector to call on the DEX router
    /// @return success True if transaction executed successfully
    function _executeTransaction(
        bytes calldata decryptedPayload,
        bytes4 functionSelector
    ) internal returns (bool success) {
        try this._callDexRouter(functionSelector, decryptedPayload) {
            return true;
        } catch {
            return false;
        }
    }
    
    /// @notice Make a call to the DEX router (external function for try-catch)
    /// @param functionSelector The function selector to call
    /// @param payload The transaction payload
    function _callDexRouter(bytes4 functionSelector, bytes calldata payload) external {
        require(msg.sender == address(this), "Only self-call allowed");
        
        // Create the full calldata
        bytes memory fullCalldata = abi.encodePacked(functionSelector, payload);
        
        // Make the call to the DEX router
        (bool success, bytes memory result) = dexRouter.call(fullCalldata);
        
        if (!success) {
            // If the call fails, revert with the error data
            assembly {
                let returndata_size := mload(result)
                revert(add(32, result), returndata_size)
                }
        }
    }
    
    /// @notice Update the sequencer address
    /// @param newSequencer The new sequencer address
    function updateSequencer(address newSequencer) external onlyOwner {
        require(newSequencer != address(0), "Sequencer cannot be zero");
        require(newSequencer != sequencer, "New sequencer same as current");
        
        address oldSequencer = sequencer;
        sequencer = newSequencer;
        
        emit SequencerUpdated(oldSequencer, newSequencer);
    }
    
    /// @notice Update the DEX router address
    /// @param newRouter The new DEX router address
    function updateDexRouter(address newRouter) external onlyOwner {
        require(newRouter != address(0), "DEX router cannot be zero");
        require(newRouter != dexRouter, "New router same as current");
        
        address oldRouter = dexRouter;
        dexRouter = newRouter;
        
        emit DexRouterUpdated(oldRouter, newRouter);
    }
    
    /// @notice Check if a batch has been executed
    /// @param batchIndex The batch index to check
    /// @return executed True if batch has been executed
    function isBatchExecuted(uint64 batchIndex) external view returns (bool executed) {
        return executedBatches[batchIndex];
    }
    
    /// @notice Get the current sequencer address
    /// @return sequencerAddress The current sequencer address
    function getSequencer() external view returns (address sequencerAddress) {
        return sequencer;
    }
    
    /// @notice Get the current DEX router address
    /// @return routerAddress The current DEX router address
    function getDexRouter() external view returns (address routerAddress) {
        return dexRouter;
    }
    
    /// @notice Emergency function to pause execution (only owner)
    /// @param batchIndex The batch index to pause
    function emergencyPauseBatch(uint64 batchIndex) external onlyOwner {
        executedBatches[batchIndex] = true;
        emit BatchExecuted(batchIndex, 0, false);
    }
}
