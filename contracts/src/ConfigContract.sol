// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ConfirmedOwner} from "blocklock-solidity/access/ConfirmedOwner.sol";

/// @title ConfigContract
/// @notice Central source of truth for system parameters, managed by DAO or multisig
/// @author DCipher Team
contract ConfigContract is ConfirmedOwner {
    
    /// @notice Configuration for a batch of transactions
    struct BatchConfig {
        uint64 startBatchIndex;
        uint64 startBlockNumber;
        uint32 batchSpan; // Duration of each batch in blocks
        address[] keypers; // List of committee member addresses
        uint32 threshold; // Decryption threshold
        uint64 transactionSizeLimit; // Max size of one encrypted transaction
        uint64 batchSizeLimit; // Max total size of all txs in a batch
        address feeReceiver;
        address targetAddress; // The ExecutorContract address
        bytes4 targetFunctionSelector; // The function to call on the executor
        bool isActive;
    }

    /// @notice Array to store all scheduled configurations
    BatchConfig[] public configs;
    
    /// @notice Mapping to quickly find the active config for a given batch index
    mapping(uint64 => uint256) public batchIndexToConfigIndex;
    
    /// @notice Current active configuration index
    uint256 public currentConfigIndex;
    
    /// @notice Draft configuration for the next update
    BatchConfig public nextConfig;
    
    /// @notice Flag indicating if next config is ready to be scheduled
    bool public nextConfigReady;
    
    /// @notice Minimum delay before a config can be activated (in blocks)
    uint32 public constant MIN_CONFIG_DELAY = 100;
    
    /// @notice Events
    event ConfigScheduled(uint256 indexed configIndex, uint64 startBatchIndex, uint64 startBlockNumber);
    event ConfigActivated(uint256 indexed configIndex, uint64 startBatchIndex);
    event NextConfigDrafted(uint64 startBatchIndex, uint64 startBlockNumber);
    
    /// @notice Modifier to ensure config is active
    modifier onlyActiveConfig(uint64 batchIndex) {
        require(_getActiveConfigIndex(batchIndex) != type(uint256).max, "No active config for batch");
        _;
    }
    
    constructor() ConfirmedOwner(msg.sender) {
        // Initialize with default config
        _initializeDefaultConfig();
    }
    
    /// @notice Initialize default configuration
    function _initializeDefaultConfig() internal {
        BatchConfig memory defaultConfig = BatchConfig({
            startBatchIndex: 0,
            startBlockNumber: uint64(block.number),
            batchSpan: 100, // 100 blocks per batch
            keypers: new address[](0),
            threshold: 0,
            transactionSizeLimit: 1024, // 1KB
            batchSizeLimit: 10240, // 10KB
            feeReceiver: address(0),
            targetAddress: address(0),
            targetFunctionSelector: bytes4(0),
            isActive: true
        });
        
        configs.push(defaultConfig);
        currentConfigIndex = 0;
        batchIndexToConfigIndex[0] = 0;
    }
    
    /// @notice Schedule the next configuration for future batches
    /// @param _startBatchIndex The batch index where this config becomes active
    /// @param _startBlockNumber The block number where this config becomes active
    function scheduleNextConfig(uint64 _startBatchIndex, uint64 _startBlockNumber) external onlyOwner {
        require(nextConfigReady, "Next config not ready");
        require(_startBatchIndex > _getCurrentBatchIndex(), "Start batch must be in future");
        require(_startBlockNumber > block.number + MIN_CONFIG_DELAY, "Start block too soon");
        require(_startBlockNumber >= _startBatchIndex * nextConfig.batchSpan, "Invalid start block");
        
        // Set the start parameters
        nextConfig.startBatchIndex = _startBatchIndex;
        nextConfig.startBlockNumber = _startBlockNumber;
        nextConfig.isActive = false;
        
        // Add to configs array
        configs.push(nextConfig);
        uint256 newConfigIndex = configs.length - 1;
        
        // Update mappings
        batchIndexToConfigIndex[_startBatchIndex] = newConfigIndex;
        
        emit ConfigScheduled(newConfigIndex, _startBatchIndex, _startBlockNumber);
        
        // Reset next config
        nextConfigReady = false;
    }
    
    /// @notice Activate a scheduled configuration
    /// @param configIndex The index of the config to activate
    function activateConfig(uint256 configIndex) external onlyOwner {
        require(configIndex < configs.length, "Invalid config index");
        require(!configs[configIndex].isActive, "Config already active");
        require(block.number >= configs[configIndex].startBlockNumber, "Too early to activate");
        
        // Deactivate current config
        if (configs[currentConfigIndex].isActive) {
            configs[currentConfigIndex].isActive = false;
        }
        
        // Activate new config
        configs[configIndex].isActive = true;
        currentConfigIndex = configIndex;
        
        emit ConfigActivated(configIndex, configs[configIndex].startBatchIndex);
    }
    
    /// @notice Get the active configuration for a specific batch
    /// @param batchIndex The batch index to get config for
    /// @return config The active configuration
    function getConfigForBatch(uint64 batchIndex) external view returns (BatchConfig memory config) {
        uint256 configIndex = _getActiveConfigIndex(batchIndex);
        require(configIndex != type(uint256).max, "No active config for batch");
        return configs[configIndex];
    }
    
    /// @notice Get current active configuration
    /// @return config The current active configuration
    function getCurrentConfig() external view returns (BatchConfig memory config) {
        return configs[currentConfigIndex];
    }
    
    /// @notice Get current batch index based on current block
    /// @return batchIndex The current batch index
    function getCurrentBatchIndex() external view returns (uint64) {
        return _getCurrentBatchIndex();
    }
    
    /// @notice Set the next keypers committee
    /// @param _keypers Array of keyper addresses
    /// @param _threshold Decryption threshold
    function setNextKeypers(address[] calldata _keypers, uint32 _threshold) external onlyOwner {
        require(_keypers.length > 0, "Keypers array cannot be empty");
        require(_threshold > 0 && _threshold <= _keypers.length, "Invalid threshold");
        
        nextConfig.keypers = _keypers;
        nextConfig.threshold = _threshold;
        nextConfigReady = true;
        
        emit NextConfigDrafted(0, 0); // Placeholder values
    }
    
    /// @notice Set the next batch span
    /// @param _batchSpan Duration of each batch in blocks
    function setNextBatchSpan(uint32 _batchSpan) external onlyOwner {
        require(_batchSpan > 0, "Batch span must be positive");
        nextConfig.batchSpan = _batchSpan;
        nextConfigReady = true;
    }
    
    /// @notice Set the next transaction size limits
    /// @param _transactionSizeLimit Max size of one encrypted transaction
    /// @param _batchSizeLimit Max total size of all txs in a batch
    function setNextSizeLimits(uint64 _transactionSizeLimit, uint64 _batchSizeLimit) external onlyOwner {
        require(_transactionSizeLimit > 0, "Transaction size limit must be positive");
        require(_batchSizeLimit >= _transactionSizeLimit, "Batch size limit must be >= transaction size limit");
        
        nextConfig.transactionSizeLimit = _transactionSizeLimit;
        nextConfig.batchSizeLimit = _batchSizeLimit;
        nextConfigReady = true;
    }
    
    /// @notice Set the next fee receiver and target contract
    /// @param _feeReceiver Address to receive fees (can be zero for no fees)
    /// @param _targetAddress The ExecutorContract address
    /// @param _targetFunctionSelector The function selector to call on executor
    function setNextTargets(address _feeReceiver, address _targetAddress, bytes4 _targetFunctionSelector) external onlyOwner {
        // Fee receiver can be zero (for no fees)
        require(_targetAddress != address(0), "Target address cannot be zero");
        require(_targetFunctionSelector != bytes4(0), "Function selector cannot be zero");
        
        nextConfig.feeReceiver = _feeReceiver;
        nextConfig.targetAddress = _targetAddress;
        nextConfig.targetFunctionSelector = _targetFunctionSelector;
        nextConfigReady = true;
    }
    
    /// @notice Internal function to get current batch index
    function _getCurrentBatchIndex() internal view returns (uint64) {
        if (configs.length == 0) return 0;
        
        BatchConfig memory currentConfig = configs[currentConfigIndex];
        if (!currentConfig.isActive) return 0;
        
        return uint64((block.number - currentConfig.startBlockNumber) / currentConfig.batchSpan) + currentConfig.startBatchIndex;
    }
    
    /// @notice Internal function to get active config index for a batch
    function _getActiveConfigIndex(uint64 batchIndex) internal view returns (uint256) {
        // Check if there's a direct mapping
        if (batchIndexToConfigIndex[batchIndex] != 0) {
            uint256 configIndex = batchIndexToConfigIndex[batchIndex];
            if (configIndex < configs.length && configs[configIndex].isActive) {
                return configIndex;
            }
        }
        
        // Find the most recent active config for this batch
        for (uint256 i = configs.length - 1; i >= 0; i--) {
            if (configs[i].isActive && 
                batchIndex >= configs[i].startBatchIndex &&
                (i == configs.length - 1 || batchIndex < configs[i + 1].startBatchIndex)) {
                return i;
            }
        }
        
        return type(uint256).max; // No active config found
    }
} 
