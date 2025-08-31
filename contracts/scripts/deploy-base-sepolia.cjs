const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying VRF Campaign Contracts to Base Sepolia...\n");

  // Get the signer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH\n");

  // Base Sepolia Configuration
  // Randamu RandomnessSender address on Base Sepolia
  const RANDOMNESS_SENDER_ADDRESS = "0x0000000000000000000000000000000000000000"; // TODO: Replace with actual Randamu address
  
  // For testing, you can deploy a mock ERC20 token
  // In production, this would be the actual reward token address
  const REWARD_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000"; // TODO: Replace with actual token address
  
  // The dcipher signer address - this should be the address that dcipher network uses
  const DCIPHER_SIGNER_ADDRESS = "0x0000000000000000000000000000000000000000"; // TODO: Replace with actual address

  console.log("Configuration:");
  console.log("Randomness Sender Address:", RANDOMNESS_SENDER_ADDRESS);
  console.log("Reward Token Address:", REWARD_TOKEN_ADDRESS);
  console.log("Dcipher Signer Address:", DCIPHER_SIGNER_ADDRESS);
  console.log("");

  // Deploy MockERC20 for testing (remove this in production)
  console.log("🔨 Deploying MockERC20 for testing...");
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const mockERC20 = await MockERC20.deploy("Campaign Token", "CAMP");
  await mockERC20.deployed();
  console.log(`✅ MockERC20 deployed to: ${mockERC20.address}`);

  // Deploy CampaignManager
  console.log("\n🔨 Deploying CampaignManager...");
  const CampaignManager = await ethers.getContractFactory("CampaignManager");
  const campaignManager = await CampaignManager.deploy(
    RANDOMNESS_SENDER_ADDRESS || mockERC20.address, // Use mock for testing if no real address
    deployer.address
  );
  await campaignManager.deployed();
  console.log(`✅ CampaignManager deployed to: ${campaignManager.address}`);

  // Deploy RewardEscrow
  console.log("\n🔨 Deploying RewardEscrow...");
  const RewardEscrow = await ethers.getContractFactory("RewardEscrow");
  const rewardEscrow = await RewardEscrow.deploy(
    deployer.address,
    campaignManager.address,
    REWARD_TOKEN_ADDRESS || mockERC20.address, // Use mock for testing if no real address
    DCIPHER_SIGNER_ADDRESS || deployer.address // Use deployer for testing if no real address
  );
  await rewardEscrow.deployed();
  console.log(`✅ RewardEscrow deployed to: ${rewardEscrow.address}`);

  console.log("\n🎉 Deployment Complete!");
  console.log("=======================");
  console.log("Contract Addresses:");
  console.log(`- MockERC20: ${mockERC20.address}`);
  console.log(`- CampaignManager: ${campaignManager.address}`);
  console.log(`- RewardEscrow: ${rewardEscrow.address}`);
  console.log(`- Owner: ${deployer.address}`);
  console.log("");

  console.log("🔗 Base Sepolia Explorer:");
  console.log(`https://sepolia.basescan.org/address/${campaignManager.address}`);
  console.log(`https://sepolia.basescan.org/address/${rewardEscrow.address}`);
  console.log("");

  console.log("📝 Next Steps:");
  console.log("1. Update the placeholder addresses with actual addresses:");
  console.log("   - Randamu RandomnessSender address");
  console.log("   - Real reward token address");
  console.log("   - Dcipher signer address");
  console.log("2. Call setupCampaign() on CampaignManager with participant addresses");
  console.log("3. Call requestWinnerSelection() to trigger VRF selection");
  console.log("4. Deposit rewards into RewardEscrow");
  console.log("5. Wait for dcipher to call unlockRewards()");
  console.log("6. Winners can claim their rewards");
  console.log("");
  console.log("⚠️  Note: This deployment uses mock contracts for testing.");
  console.log("   For production, deploy with real contract addresses.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
