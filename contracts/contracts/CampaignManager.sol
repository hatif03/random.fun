// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {RandomnessReceiverBase} from "randomness-solidity/src/RandomnessReceiverBase.sol";

/// @title CampaignManager contract
/// @author Randamu
/// @notice A contract that manages fair selection of whitelist participants using Randamu's VRF
contract CampaignManager is RandomnessReceiverBase {
    /// @notice Array to store the initial pool of eligible users
    address[] public eligibleParticipants;
    
    /// @notice Array to store the final whitelisted addresses
    address[] public winners;
    
    /// @notice Mapping for efficient, on-chain checks of winner status
    mapping(address => bool) public isWinnerMapping;
    
    /// @notice To track the specific randomness request
    uint256 public requestId;
    
    /// @notice Flag to indicate if the VRF process has finished
    bool public isSelectionComplete;
    
    /// @notice Number of winners to select
    uint256 public winnerCount;
    
    /// @notice Maximum number of participants allowed
    uint256 public constant MAX_PARTICIPANTS = 1000;
    
    /// @notice Events
    event CampaignSetup(address[] participants);
    event WinnerSelectionRequested(uint256 requestId);
    event WinnersSelected(address[] winners);
    
    /// @notice Initializes the contract with the address of the randomness sender
    /// @param randomnessSender The address of the randomness provider
    /// @param _owner The address that will have administrative privileges
    constructor(address randomnessSender, address _owner) RandomnessReceiverBase(randomnessSender, _owner) {}
    
    /// @notice Setup the campaign with eligible participants
    /// @param _participants Array of addresses eligible for the campaign
    /// @param _winnerCount Number of winners to select
    function setupCampaign(address[] calldata _participants, uint256 _winnerCount) external onlyOwner {
        require(_participants.length > 0, "Participants array cannot be empty");
        require(_participants.length <= MAX_PARTICIPANTS, "Too many participants");
        require(_winnerCount > 0 && _winnerCount <= _participants.length, "Invalid winner count");
        require(!isSelectionComplete, "Campaign already completed");
        
        // Clear previous data
        delete eligibleParticipants;
        delete winners;
        
        // Add participants
        for (uint256 i = 0; i < _participants.length; i++) {
            require(_participants[i] != address(0), "Invalid address");
            eligibleParticipants.push(_participants[i]);
        }
        
        winnerCount = _winnerCount;
        
        emit CampaignSetup(_participants);
    }
    
    /// @notice Request winner selection using VRF
    /// @param callbackGasLimit Gas limit for the callback function
    function requestWinnerSelection(uint32 callbackGasLimit) external onlyOwner payable returns (uint256, uint256) {
        require(eligibleParticipants.length > 0, "No participants set");
        require(!isSelectionComplete, "Selection already completed");
        require(winnerCount > 0, "Winner count not set");
        
        // Create randomness request
        (uint256 requestID, uint256 requestPrice) = _requestRandomnessPayInNative(callbackGasLimit);
        
        // Store request id
        requestId = requestID;
        
        emit WinnerSelectionRequested(requestID);
        
        return (requestID, requestPrice);
    }
    
    /// @notice Callback function that processes received randomness
    /// @dev Ensures the received request ID matches the stored one before updating state
    /// @param requestID The ID of the randomness request
    /// @param _randomness The random value received from the oracle
    function onRandomnessReceived(uint256 requestID, bytes32 _randomness) internal override {
        require(requestId == requestID, "Request ID mismatch");
        require(!isSelectionComplete, "Selection already completed");
        
        // Use randomness to select winners
        _selectWinners(_randomness);
        
        // Mark selection as complete
        isSelectionComplete = true;
        
        emit WinnersSelected(winners);
    }
    
    /// @notice Internal function to select winners using the randomness seed
    /// @param _randomness The random seed from VRF
    function _selectWinners(bytes32 _randomness) internal {
        uint256 participantCount = eligibleParticipants.length;
        uint256 winnersToSelect = winnerCount;
        
        // Create a copy of participants for selection
        address[] memory tempParticipants = new address[](participantCount);
        for (uint256 i = 0; i < participantCount; i++) {
            tempParticipants[i] = eligibleParticipants[i];
        }
        
        // Fisher-Yates shuffle using the randomness seed
        for (uint256 i = participantCount - 1; i > 0; i--) {
            uint256 j = uint256(keccak256(abi.encodePacked(_randomness, i))) % (i + 1);
            (tempParticipants[i], tempParticipants[j]) = (tempParticipants[j], tempParticipants[i]);
        }
        
        // Select first N participants as winners
        for (uint256 i = 0; i < winnersToSelect; i++) {
            address winner = tempParticipants[i];
            winners.push(winner);
            isWinnerMapping[winner] = true;
        }
    }
    
    /// @notice Get the list of eligible participants
    /// @return Array of eligible participant addresses
    function getEligibleParticipants() external view returns (address[] memory) {
        return eligibleParticipants;
    }
    
    /// @notice Get the list of winners
    /// @return Array of winner addresses
    function getWinners() external view returns (address[] memory) {
        return winners;
    }
    
    /// @notice Check if an address is a winner
    /// @param _address The address to check
    /// @return True if the address is a winner, false otherwise
    function isWinner(address _address) external view returns (bool) {
        return isWinnerMapping[_address];
    }
    
    /// @notice Get the total number of eligible participants
    /// @return Count of eligible participants
    function getEligibleParticipantCount() external view returns (uint256) {
        return eligibleParticipants.length;
    }
    
    /// @notice Get the total number of winners
    /// @return Count of winners
    function getWinnerCount() external view returns (uint256) {
        return winners.length;
    }
}
