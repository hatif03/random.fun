// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AbstractBlocklockReceiver} from "blocklock-solidity/AbstractBlocklockReceiver.sol";
import {TypesLib} from "blocklock-solidity/libraries/TypesLib.sol";
import "./ConfigContract.sol";
import "./BatcherContract.sol";
import "./ExecutorContract.sol";

/// @title DCipherSwap
/// @notice Main contract for DCipher DEX with Blocklock integration
/// @author DCipher Team
contract DCipherSwap is AbstractBlocklockReceiver {
    
    /// @notice Reference to the configuration contract
    ConfigContract public immutable configContract;
    
    /// @notice Reference to the batcher contract
    BatcherContract public immutable batcherContract;
    
    /// @notice Reference to the executor contract
    ExecutorContract public immutable executorContract;
    
    /// @notice Mapping from request ID to swap request details
    mapping(uint256 => SwapRequest) public swapRequests;
    
    /// @notice Current request ID counter
    uint256 public currentRequestId;
    
    /// @notice Struct to store swap request details
    struct SwapRequest {
        address requester;
        uint64 batchIndex;
        uint32 encryptedAt;
        uint32 decryptedAt;
        TypesLib.Ciphertext encryptedData;
        SwapData swapData;
        bool isProcessed;
        bool isExecuted;
    }
    
    /// @notice Struct to store decrypted swap data
    struct SwapData {
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 amountOutMin;
        address recipient;
        uint256 deadline;
        bytes swapCalldata;
    }
    
    /// @notice Events
    event SwapRequestCreated(
        uint256 indexed requestId,
        uint64 indexed batchIndex,
        address indexed requester,
        uint32 encryptedAt,
        uint32 decryptedAt
    );
    
    event SwapRequestProcessed(uint256 indexed requestId, SwapData swapData);
    event SwapExecuted(uint256 indexed requestId, bool success);
    
    /// @notice Modifier to ensure request exists
    modifier onlyExistingRequest(uint256 requestId) {
        require(swapRequests[requestId].requester != address(0), "Request does not exist");
        _;
    }
    
    /// @notice Constructor
    /// @param _blocklockSender Address of the BlocklockSender contract
    /// @param _configContract Address of the ConfigContract
    /// @param _batcherContract Address of the BatcherContract
    /// @param _executorContract Address of the ExecutorContract
    constructor(
        address _blocklockSender,
        address _configContract,
        address _batcherContract,
        address _executorContract
    ) AbstractBlocklockReceiver(_blocklockSender) {
        require(_configContract != address(0), "Config contract cannot be zero");
        require(_batcherContract != address(0), "Batcher contract cannot be zero");
        require(_executorContract != address(0), "Executor contract cannot be zero");
        
        configContract = ConfigContract(_configContract);
        batcherContract = BatcherContract(_batcherContract);
        executorContract = ExecutorContract(_executorContract);
    }
    
    /// @notice Create a timelock swap request with direct funding
    /// @param callbackGasLimit Gas limit for the callback function
    /// @param encryptedAt Block number when the data was encrypted
    /// @param decryptedAt Block number when the data should be decrypted
    /// @param condition Condition for decryption (e.g., block height)
    /// @param encryptedData The encrypted swap data
    /// @return requestId The unique request ID
    /// @return requestPrice The price for the request
    function createTimelockSwapRequest(
        uint32 callbackGasLimit,
        uint32 encryptedAt,
        uint32 decryptedAt,
        bytes calldata condition,
        TypesLib.Ciphertext calldata encryptedData
    ) external payable returns (uint256 requestId, uint256 requestPrice) {
        require(encryptedAt <= block.number, "Encrypted at must be in past");
        require(decryptedAt > block.number, "Decrypted at must be in future");
        require(decryptedAt > encryptedAt, "Decrypted at must be after encrypted at");
        
        // Create blocklock request
        (requestId, requestPrice) = _requestBlocklockPayInNative(
            callbackGasLimit,
            condition,
            encryptedData
        );
        
        // Get current batch index
        uint64 batchIndex = batcherContract.getCurrentBatchIndex();
        
        // Store swap request details
        swapRequests[requestId] = SwapRequest({
            requester: msg.sender,
            batchIndex: batchIndex,
            encryptedAt: encryptedAt,
            decryptedAt: decryptedAt,
            encryptedData: encryptedData,
            swapData: SwapData({
                tokenIn: address(0),
                tokenOut: address(0),
                amountIn: 0,
                amountOutMin: 0,
                recipient: address(0),
                deadline: 0,
                swapCalldata: ""
            }),
            isProcessed: false,
            isExecuted: false
        });
        
        // Submit encrypted transaction to batcher
        batcherContract.submitTransaction(abi.encode(requestId, encryptedData));
        
        emit SwapRequestCreated(requestId, batchIndex, msg.sender, encryptedAt, decryptedAt);
    }
    
    /// @notice Create a timelock swap request with subscription
    /// @param callbackGasLimit Gas limit for the callback function
    /// @param encryptedAt Block number when the data was encrypted
    /// @param decryptedAt Block number when the data should be decrypted
    /// @param condition Condition for decryption (e.g., block height)
    /// @param encryptedData The encrypted swap data
    /// @return requestId The unique request ID
    function createTimelockSwapRequestWithSubscription(
        uint32 callbackGasLimit,
        uint32 encryptedAt,
        uint32 decryptedAt,
        bytes calldata condition,
        TypesLib.Ciphertext calldata encryptedData
    ) external returns (uint256 requestId) {
        require(encryptedAt <= block.number, "Encrypted at must be in past");
        require(decryptedAt > block.number, "Decrypted at must be in future");
        require(decryptedAt > encryptedAt, "Decrypted at must be after encrypted at");
        require(subscriptionId != 0, "Subscription not set");
        
        // Create blocklock request with subscription
        requestId = _requestBlocklockWithSubscription(
            callbackGasLimit,
            condition,
            encryptedData
        );
        
        // Get current batch index
        uint64 batchIndex = batcherContract.getCurrentBatchIndex();
        
        // Store swap request details
        swapRequests[requestId] = SwapRequest({
            requester: msg.sender,
            batchIndex: batchIndex,
            encryptedAt: encryptedAt,
            decryptedAt: decryptedAt,
            encryptedData: encryptedData,
            swapData: SwapData({
                tokenIn: address(0),
                tokenOut: address(0),
                amountIn: 0,
                amountOutMin: 0,
                recipient: address(0),
                deadline: 0,
                swapCalldata: ""
            }),
            isProcessed: false,
            isExecuted: false
        });
        
        // Submit encrypted transaction to batcher
        batcherContract.submitTransaction(abi.encode(requestId, encryptedData));
        
        emit SwapRequestCreated(requestId, batchIndex, msg.sender, encryptedAt, decryptedAt);
    }
    
    /// @notice Internal function called when blocklock decryption key is received
    /// @param _requestId The request ID
    /// @param decryptionKey The decryption key
    function _onBlocklockReceived(uint256 _requestId, bytes calldata decryptionKey) internal override {
        require(swapRequests[_requestId].requester != address(0), "Request does not exist");
        require(!swapRequests[_requestId].isProcessed, "Request already processed");
        
        SwapRequest storage request = swapRequests[_requestId];
        
        // Decrypt the swap data
        bytes memory decryptedData = _decrypt(request.encryptedData, decryptionKey);
        
        // Decode the swap data
        SwapData memory swapData = abi.decode(decryptedData, (SwapData));
        
        // Validate swap data
        require(swapData.tokenIn != address(0), "Invalid token in");
        require(swapData.tokenOut != address(0), "Invalid token out");
        require(swapData.amountIn > 0, "Invalid amount in");
        require(swapData.recipient != address(0), "Invalid recipient");
        require(swapData.deadline > block.timestamp, "Deadline passed");
        
        // Update request with decrypted data
        request.swapData = swapData;
        request.isProcessed = true;
        
        emit SwapRequestProcessed(_requestId, swapData);
    }
    
    /// @notice Execute a processed swap request
    /// @param requestId The request ID to execute
    /// @return success True if swap executed successfully
    function executeSwap(uint256 requestId) external returns (bool success) {
        require(swapRequests[requestId].isProcessed, "Request not processed");
        require(!swapRequests[requestId].isExecuted, "Request already executed");
        require(swapRequests[requestId].requester == msg.sender, "Only requester can execute");
        
        SwapRequest storage request = swapRequests[requestId];
        
        // Check if decryption time has passed
        require(block.number >= request.decryptedAt, "Decryption time not reached");
        
        // Execute the swap through the executor contract
        try executorContract.executeBatch(
            request.batchIndex,
            new bytes[](1) // Single transaction batch
        ) {
            request.isExecuted = true;
            success = true;
        } catch {
            success = false;
        }
        
        emit SwapExecuted(requestId, success);
    }
    
    /// @notice Get swap request details
    /// @param requestId The request ID
    /// @return request The swap request details
    function getSwapRequest(uint256 requestId) external view returns (SwapRequest memory request) {
        return swapRequests[requestId];
    }
    
    /// @notice Check if a request is ready for execution
    /// @param requestId The request ID to check
    /// @return ready True if request is ready for execution
    function isRequestReadyForExecution(uint256 requestId) external view returns (bool ready) {
        SwapRequest memory request = swapRequests[requestId];
        return request.isProcessed && 
               !request.isExecuted && 
               block.number >= request.decryptedAt;
    }
    
    /// @notice Get all swap requests for a user
    /// @param user The user address
    /// @return requestIds Array of request IDs
    function getUserSwapRequests(address user) external view returns (uint256[] memory requestIds) {
        // This is a simplified implementation - in production you'd want to maintain a mapping
        // from user to request IDs for efficient querying
        uint256 count = 0;
        for (uint256 i = 1; i <= currentRequestId; i++) {
            if (swapRequests[i].requester == user) {
                count++;
            }
        }
        
        requestIds = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= currentRequestId; i++) {
            if (swapRequests[i].requester == user) {
                requestIds[index] = i;
                index++;
            }
        }
    }
    
    /// @notice Emergency function to pause a request (only owner)
    /// @param requestId The request ID to pause
    function emergencyPauseRequest(uint256 requestId) external onlyOwner {
        require(swapRequests[requestId].requester != address(0), "Request does not exist");
        swapRequests[requestId].isProcessed = false;
        swapRequests[requestId].isExecuted = false;
    }
}
