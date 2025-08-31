// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title RewardEscrow contract
/// @author Randamu
/// @notice A contract that holds rewards and releases them only when triggered by dcipher's conditional signing service
contract RewardEscrow {
    using SafeERC20 for IERC20;
    
    /// @notice The address that can deposit rewards
    address public owner;
    
    /// @notice The address of the CampaignManager contract, used to verify winners
    address public campaignManager;
    
    /// @notice The address of the ERC20 reward token
    address public rewardToken;
    
    /// @notice Hardcoded address that represents the dcipher network's conditional signing agent
    /// @dev This is the only address authorized to unlock the rewards
    address public immutable dcipherSigner;
    
    /// @notice Boolean flag, initially false, indicates if rewards are unlocked
    bool public areRewardsUnlocked;
    
    /// @notice Mapping to prevent users from claiming rewards more than once
    mapping(address => bool) public hasClaimed;
    
    /// @notice Total amount of rewards deposited
    uint256 public totalRewardsDeposited;
    
    /// @notice Events
    event RewardsDeposited(address indexed depositor, uint256 amount);
    event RewardsUnlocked(address indexed unlocker);
    event RewardClaimed(address indexed winner, uint256 amount);
    
    /// @notice Modifier to restrict access to owner only
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    /// @notice Modifier to restrict access to dcipher signer only
    modifier onlyDcipherSigner() {
        require(msg.sender == dcipherSigner, "Only dcipher signer can call this function");
        _;
    }
    
    /// @notice Initializes the contract
    /// @param _owner The address that can deposit rewards
    /// @param _campaignManager The address of the CampaignManager contract
    /// @param _rewardToken The address of the ERC20 reward token
    /// @param _dcipherSigner The address of the dcipher network's conditional signing agent
    constructor(
        address _owner,
        address _campaignManager,
        address _rewardToken,
        address _dcipherSigner
    ) {
        require(_owner != address(0), "Owner cannot be zero address");
        require(_campaignManager != address(0), "Campaign manager cannot be zero address");
        require(_rewardToken != address(0), "Reward token cannot be zero address");
        require(_dcipherSigner != address(0), "Dcipher signer cannot be zero address");
        
        owner = _owner;
        campaignManager = _campaignManager;
        rewardToken = _rewardToken;
        dcipherSigner = _dcipherSigner;
    }
    
    /// @notice Deposit rewards into the contract
    /// @param _amount Amount of reward tokens to deposit
    function deposit(uint256 _amount) external onlyOwner {
        require(_amount > 0, "Amount must be greater than 0");
        require(!areRewardsUnlocked, "Rewards already unlocked");
        
        // Transfer tokens from owner to contract
        IERC20(rewardToken).safeTransferFrom(msg.sender, address(this), _amount);
        
        totalRewardsDeposited += _amount;
        
        emit RewardsDeposited(msg.sender, _amount);
    }
    
    /// @notice Unlock rewards - can only be called by the dcipher signer
    /// @dev This function is called by the dcipher network once the on-chain goal is met
    function unlockRewards() external onlyDcipherSigner {
        require(!areRewardsUnlocked, "Rewards already unlocked");
        require(totalRewardsDeposited > 0, "No rewards deposited");
        
        areRewardsUnlocked = true;
        
        emit RewardsUnlocked(msg.sender);
    }
    
    /// @notice Allow a whitelisted user to claim their share of rewards
    function claimReward() external {
        require(areRewardsUnlocked, "Rewards are not yet unlocked");
        require(ICampaignManager(campaignManager).isWinnerMapping(msg.sender), "Not a winner");
        require(!hasClaimed[msg.sender], "Already claimed");
        
        // Mark as claimed
        hasClaimed[msg.sender] = true;
        
        // Calculate reward amount (equal distribution among winners)
        uint256 winnerCount = ICampaignManager(campaignManager).getWinnerCount();
        require(winnerCount > 0, "No winners selected");
        
        uint256 rewardAmount = totalRewardsDeposited / winnerCount;
        require(rewardAmount > 0, "No rewards to claim");
        
        // Transfer tokens to winner
        IERC20(rewardToken).safeTransfer(msg.sender, rewardAmount);
        
        emit RewardClaimed(msg.sender, rewardAmount);
    }
    
    /// @notice Get the reward amount for a winner
    /// @return Amount of reward tokens each winner receives
    function getRewardAmount() external view returns (uint256) {
        if (!areRewardsUnlocked) {
            return 0;
        }
        
        uint256 winnerCount = ICampaignManager(campaignManager).getWinnerCount();
        if (winnerCount == 0) {
            return 0;
        }
        
        return totalRewardsDeposited / winnerCount;
    }
    
    /// @notice Check if an address can claim rewards
    /// @param _address The address to check
    /// @return True if the address can claim, false otherwise
    function canClaim(address _address) external view returns (bool) {
        if (!areRewardsUnlocked) {
            return false;
        }
        
        if (hasClaimed[_address]) {
            return false;
        }
        
        return ICampaignManager(campaignManager).isWinnerMapping(_address);
    }
    
    /// @notice Get the total number of winners
    /// @return Count of winners
    function getWinnerCount() external view returns (uint256) {
        return ICampaignManager(campaignManager).getWinnerCount();
    }
    
    /// @notice Emergency function to withdraw tokens (only owner, before unlock)
    /// @param _token The token to withdraw
    /// @param _amount The amount to withdraw
    function emergencyWithdraw(address _token, uint256 _amount) external onlyOwner {
        require(!areRewardsUnlocked, "Cannot withdraw after unlock");
        require(_token != rewardToken || _amount <= totalRewardsDeposited, "Insufficient balance");
        
        IERC20(_token).safeTransfer(owner, _amount);
    }
    
    /// @notice Update the campaign manager address (only owner)
    /// @param _newCampaignManager The new campaign manager address
    function updateCampaignManager(address _newCampaignManager) external onlyOwner {
        require(_newCampaignManager != address(0), "Campaign manager cannot be zero address");
        require(!areRewardsUnlocked, "Cannot update after unlock");
        
        campaignManager = _newCampaignManager;
    }
}

/// @title Interface for CampaignManager contract
/// @notice Minimal interface to interact with CampaignManager
interface ICampaignManager {
    function isWinnerMapping(address _address) external view returns (bool);
    function getWinnerCount() external view returns (uint256);
}
