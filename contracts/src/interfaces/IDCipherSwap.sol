// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {TypesLib} from "blocklock-solidity/libraries/TypesLib.sol";

/// @title IDCipherSwap Interface
/// @notice Interface for the DCipherSwap contract
/// @author DCipher Team
interface IDCipherSwap {
    
    /// @notice Struct for swap request details
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
    
    /// @notice Struct for decrypted swap data
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
    ) external payable returns (uint256 requestId, uint256 requestPrice);
    
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
    ) external returns (uint256 requestId);
    
    /// @notice Execute a processed swap request
    /// @param requestId The request ID to execute
    /// @return success True if swap executed successfully
    function executeSwap(uint256 requestId) external returns (bool success);
    
    /// @notice Get swap request details
    /// @param requestId The request ID
    /// @return request The swap request details
    function getSwapRequest(uint256 requestId) external view returns (SwapRequest memory request);
    
    /// @notice Check if a request is ready for execution
    /// @param requestId The request ID to check
    /// @return ready True if request is ready for execution
    function isRequestReadyForExecution(uint256 requestId) external view returns (bool ready);
    
    /// @notice Get all swap requests for a user
    /// @param user The user address
    /// @return requestIds Array of request IDs
    function getUserSwapRequests(address user) external view returns (uint256[] memory requestIds);
    
    /// @notice Emergency function to pause a request (only owner)
    /// @param requestId The request ID to pause
    function emergencyPauseRequest(uint256 requestId) external;
}
