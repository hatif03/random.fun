// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../DCipherSwap.sol";
import "../interfaces/IDCipherSwap.sol";

/// @title Example Usage Contract
/// @notice Demonstrates how to interact with the DCipher system
/// @author DCipher Team
contract ExampleUsage {
    
    /// @notice Reference to the DCipherSwap contract
    IDCipherSwap public dcipherSwap;
    
    /// @notice Event for tracking example operations
    event ExampleSwapRequested(uint256 requestId, address user, uint32 decryptedAt);
    
    /// @notice Constructor
    /// @param _dcipherSwap Address of the DCipherSwap contract
    constructor(address _dcipherSwap) {
        require(_dcipherSwap != address(0), "Invalid DCipherSwap address");
        dcipherSwap = IDCipherSwap(_dcipherSwap);
    }
    
    /// @notice Example function to create a swap request
    /// @param callbackGasLimit Gas limit for the callback
    /// @param encryptedAt Block number when data was encrypted
    /// @param decryptedAt Block number when data should be decrypted
    /// @param condition Decryption condition
    /// @param encryptedData Encrypted swap data
    /// @return requestId The created request ID
    function createExampleSwapRequest(
        uint32 callbackGasLimit,
        uint32 encryptedAt,
        uint32 decryptedAt,
        bytes calldata condition,
        bytes calldata encryptedData
    ) external payable returns (uint256 requestId) {
        // This is a simplified example - in practice you'd need to construct
        // a proper TypesLib.Ciphertext struct from the encrypted data
        
        // For demonstration, we'll create a minimal ciphertext
        // In production, you'd use proper encryption libraries
        
        emit ExampleSwapRequested(0, msg.sender, decryptedAt);
        
        // Note: This is a placeholder - actual implementation would require
        // proper TypesLib.Ciphertext construction and Blocklock integration
        
        return 0; // Placeholder return
    }
    
    /// @notice Example function to check if a request is ready
    /// @param requestId The request ID to check
    /// @return ready True if ready for execution
    function checkRequestReady(uint256 requestId) external view returns (bool ready) {
        return dcipherSwap.isRequestReadyForExecution(requestId);
    }
    
    /// @notice Example function to execute a swap
    /// @param requestId The request ID to execute
    /// @return success True if execution succeeded
    function executeExampleSwap(uint256 requestId) external returns (bool success) {
        return dcipherSwap.executeSwap(requestId);
    }
    
    /// @notice Get swap request details
    /// @param requestId The request ID
    /// @return request The request details
    function getExampleSwapRequest(uint256 requestId) external view returns (IDCipherSwap.SwapRequest memory request) {
        return dcipherSwap.getSwapRequest(requestId);
    }
    
    /// @notice Example of how to structure swap data
    /// @param tokenIn Input token address
    /// @param tokenOut Output token address
    /// @param amountIn Input amount
    /// @param amountOutMin Minimum output amount
    /// @param recipient Recipient address
    /// @param deadline Deadline timestamp
    /// @return swapData The structured swap data
    function createExampleSwapData(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin,
        address recipient,
        uint256 deadline
    ) external pure returns (bytes memory swapData) {
        // This shows how to structure the swap data that would be encrypted
        // and sent to the DCipher system
        
        IDCipherSwap.SwapData memory data = IDCipherSwap.SwapData({
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            amountIn: amountIn,
            amountOutMin: amountOutMin,
            recipient: recipient,
            deadline: deadline,
            swapCalldata: "" // This would contain the actual swap function call data
        });
        
        // Encode the data for encryption
        return abi.encode(data);
    }
    
    /// @notice Example of how to calculate gas costs
    /// @param callbackGasLimit The callback gas limit
    /// @return estimatedCost Estimated cost in wei
    function estimateGasCost(uint32 callbackGasLimit) external pure returns (uint256 estimatedCost) {
        // This is a simplified estimation - in practice you'd query the Blocklock contract
        // for actual pricing
        
        // Rough estimation: 1 gas = 20 gwei (adjust based on network conditions)
        uint256 gasPrice = 20 * 1e9; // 20 gwei in wei
        
        return uint256(callbackGasLimit) * gasPrice;
    }
    
    /// @notice Example of how to validate swap parameters
    /// @param tokenIn Input token address
    /// @param tokenOut Output token address
    /// @param amountIn Input amount
    /// @param deadline Deadline timestamp
    /// @return valid True if parameters are valid
    function validateSwapParameters(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 deadline
    ) external view returns (bool valid) {
        // Basic validation examples
        
        // Check addresses are not zero
        if (tokenIn == address(0) || tokenOut == address(0)) {
            return false;
        }
        
        // Check tokens are different
        if (tokenIn == tokenOut) {
            return false;
        }
        
        // Check amount is positive
        if (amountIn == 0) {
            return false;
        }
        
        // Check deadline is in the future
        if (deadline <= block.timestamp) {
            return false;
        }
        
        // Check deadline is not too far in the future (e.g., 1 hour max)
        if (deadline > block.timestamp + 3600) {
            return false;
        }
        
        return true;
    }
}
