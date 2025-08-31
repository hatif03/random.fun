// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Mock RandomnessSender contract
/// @author Randamu
/// @notice A mock contract for testing randomness functionality
contract MockRandomnessSender {
    /// @notice Mock function to simulate randomness callback
    /// @param receiver The address of the randomness receiver
    /// @param requestId The request ID
    /// @param randomness The random value
    function mockRandomnessCallback(address receiver, uint256 requestId, bytes32 randomness) external {
        // Call the receiveRandomness function on the receiver contract
        (bool success, ) = receiver.call(
            abi.encodeWithSignature("receiveRandomness(uint256,bytes32)", requestId, randomness)
        );
        require(success, "Randomness callback failed");
    }
    
    /// @notice Mock function to simulate request price calculation
    /// @param callbackGasLimit The callback gas limit
    /// @return The mock request price
    function calculateRequestPriceNative(uint32 callbackGasLimit) external pure returns (uint256) {
        return uint256(callbackGasLimit) * 1e15; // Mock price: 0.001 ETH per 1000 gas
    }
    
    /// @notice Mock function to simulate randomness request
    /// @param callbackGasLimit The callback gas limit
    /// @return The mock request ID
    function requestRandomness(uint32 callbackGasLimit) external payable returns (uint256) {
        // Return a mock request ID
        return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, callbackGasLimit)));
    }
    
    /// @notice Mock function to simulate subscription-based randomness request
    /// @param callbackGasLimit The callback gas limit
    /// @param subscriptionId The subscription ID
    /// @return The mock request ID
    function requestRandomnessWithSubscription(uint32 callbackGasLimit, uint256 subscriptionId) external returns (uint256) {
        // Return a mock request ID
        return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, callbackGasLimit, subscriptionId)));
    }
    
    /// @notice Mock function to simulate subscription creation
    /// @return The mock subscription ID
    function createSubscription() external returns (uint256) {
        // Return a mock subscription ID
        return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender)));
    }
    
    /// @notice Mock function to simulate adding a consumer to a subscription
    /// @param subscriptionId The subscription ID
    /// @param consumer The consumer address
    function addConsumer(uint256 subscriptionId, address consumer) external {
        // Mock implementation - no actual logic needed for testing
    }
    
    /// @notice Mock function to simulate funding a subscription with native tokens
    /// @param subscriptionId The subscription ID
    function fundSubscriptionWithNative(uint256 subscriptionId) external payable {
        // Mock implementation - no actual logic needed for testing
    }
    
    /// @notice Mock function to simulate canceling a subscription
    /// @param subscriptionId The subscription ID
    /// @param to The recipient address
    function cancelSubscription(uint256 subscriptionId, address to) external {
        // Mock implementation - no actual logic needed for testing
    }
    
    /// @notice Mock function to simulate removing a consumer from a subscription
    /// @param subscriptionId The subscription ID
    /// @param consumer The consumer address
    function removeConsumer(uint256 subscriptionId, address consumer) external {
        // Mock implementation - no actual logic needed for testing
    }
    
    /// @notice Mock function to simulate checking if a request is in flight
    /// @param requestId The request ID
    /// @return Always returns false for testing
    function isInFlight(uint256 requestId) external pure returns (bool) {
        return false;
    }
    
    /// @notice Mock function to simulate checking if a subscription has pending requests
    /// @param subscriptionId The subscription ID
    /// @return Always returns false for testing
    function pendingRequestExists(uint256 subscriptionId) external pure returns (bool) {
        return false;
    }
}
