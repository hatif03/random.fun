import { ethers } from "hardhat";

async function main() {
  console.log("Deploying Campaign Manager and Reward Escrow contracts...");

  // Get the signer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // For Base Sepolia, you'll need to replace this with the actual RandomnessSender address
  // This is a placeholder - you need to get the actual address from Randamu documentation
  const RANDOMNESS_SENDER_ADDRESS = "0x0000000000000000000000000000000000000000"; // TODO: Replace with actual address
  
  // For testing purposes, you can use a mock ERC20 token address
  // In production, this would be the actual reward token address
  const REWARD_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000"; // TODO: Replace with actual token address
  
  // The dcipher signer address - this should be the address that dcipher network uses
  const DCIPHER_SIGNER_ADDRESS = "0x0000000000000000000000000000000000000000"; // TODO: Replace with actual address

  console.log("Randomness Sender Address:", RANDOMNESS_SENDER_ADDRESS);
  console.log("Reward Token Address:", REWARD_TOKEN_ADDRESS);
  console.log("Dcipher Signer Address:", DCIPHER_SIGNER_ADDRESS);

  // Deploy CampaignManager
  console.log("\nDeploying CampaignManager...");
  const CampaignManager = await ethers.getContractFactory("CampaignManager");
  const campaignManager = await CampaignManager.deploy(
    RANDOMNESS_SENDER_ADDRESS,
    deployer.address
  );
  await campaignManager.waitForDeployment();
  
  const campaignManagerAddress = await campaignManager.getAddress();
  console.log("CampaignManager deployed to:", campaignManagerAddress);

  // Deploy RewardEscrow
  console.log("\nDeploying RewardEscrow...");
  const RewardEscrow = await ethers.getContractFactory("RewardEscrow");
  const rewardEscrow = await RewardEscrow.deploy(
    deployer.address,
    campaignManagerAddress,
    REWARD_TOKEN_ADDRESS,
    DCIPHER_SIGNER_ADDRESS
  );
  await rewardEscrow.waitForDeployment();
  
  const rewardEscrowAddress = await rewardEscrow.getAddress();
  console.log("RewardEscrow deployed to:", rewardEscrowAddress);

  console.log("\nDeployment Summary:");
  console.log("====================");
  console.log("CampaignManager:", campaignManagerAddress);
  console.log("RewardEscrow:", rewardEscrowAddress);
  console.log("Owner:", deployer.address);
  console.log("Randomness Sender:", RANDOMNESS_SENDER_ADDRESS);
  console.log("Reward Token:", REWARD_TOKEN_ADDRESS);
  console.log("Dcipher Signer:", DCIPHER_SIGNER_ADDRESS);

  console.log("\nNext steps:");
  console.log("1. Update the placeholder addresses with actual addresses");
  console.log("2. Call setupCampaign() on CampaignManager with participant addresses");
  console.log("3. Call requestWinnerSelection() to trigger VRF selection");
  console.log("4. Deposit rewards into RewardEscrow");
  console.log("5. Wait for dcipher to call unlockRewards()");
  console.log("6. Winners can claim their rewards");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
