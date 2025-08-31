import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Starting VRF Campaign Example Workflow...\n");

  // Get signers
  const [deployer, participant1, participant2, participant3, participant4, participant5] = await ethers.getSigners();
  
  console.log("📋 Participants:");
  console.log(`- Deployer/Owner: ${deployer.address}`);
  console.log(`- Participant 1: ${participant1.address}`);
  console.log(`- Participant 2: ${participant2.address}`);
  console.log(`- Participant 3: ${participant3.address}`);
  console.log(`- Participant 4: ${participant4.address}`);
  console.log(`- Participant 5: ${participant5.address}\n`);

  // Deploy mock contracts for demonstration
  console.log("🔨 Deploying contracts...");
  
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const mockERC20 = await MockERC20.deploy("Campaign Token", "CAMP");
  console.log(`✅ MockERC20 deployed to: ${await mockERC20.getAddress()}`);

  const MockRandomnessSender = await ethers.getContractFactory("MockRandomnessSender");
  const mockRandomnessSender = await MockRandomnessSender.deploy();
  console.log(`✅ MockRandomnessSender deployed to: ${await mockRandomnessSender.getAddress()}`);

  const CampaignManager = await ethers.getContractFactory("CampaignManager");
  const campaignManager = await CampaignManager.deploy(
    await mockRandomnessSender.getAddress(),
    deployer.address
  );
  console.log(`✅ CampaignManager deployed to: ${await campaignManager.getAddress()}`);

  const RewardEscrow = await ethers.getContractFactory("RewardEscrow");
  const rewardEscrow = await RewardEscrow.deploy(
    deployer.address,
    await campaignManager.getAddress(),
    await mockERC20.getAddress(),
    deployer.address // Using deployer as dcipher signer for demo
  );
  console.log(`✅ RewardEscrow deployed to: ${await rewardEscrow.getAddress()}\n`);

  // Step 1: Setup Campaign
  console.log("📝 Step 1: Setting up campaign...");
  const participants = [
    participant1.address,
    participant2.address,
    participant3.address,
    participant4.address,
    participant5.address
  ];
  const winnerCount = 2;
  
  await campaignManager.setupCampaign(participants, winnerCount);
  console.log(`✅ Campaign setup complete with ${participants.length} participants and ${winnerCount} winners`);
  console.log(`📊 Eligible participants: ${participants.join(", ")}\n`);

  // Step 2: Request Winner Selection (VRF)
  console.log("🎲 Step 2: Requesting winner selection via VRF...");
  const callbackGasLimit = 100000;
  
  try {
    const tx = await campaignManager.requestWinnerSelection(callbackGasLimit, { value: ethers.parseEther("0.1") });
    await tx.wait();
    console.log("✅ Winner selection requested");
    console.log(`🆔 Request ID: ${await campaignManager.requestId()}\n`);
  } catch (error) {
    console.log("⚠️  VRF request failed (expected in demo with mock contract)");
    console.log("   In production, this would trigger Randamu's VRF network\n");
  }

  // Step 3: Simulate VRF Callback (for demo purposes)
  console.log("🎯 Step 3: Simulating VRF callback...");
  const requestId = await campaignManager.requestId();
  const randomness = ethers.keccak256(ethers.toUtf8Bytes("demo-randomness"));
  
  await mockRandomnessSender.mockRandomnessCallback(
    await campaignManager.getAddress(),
    requestId,
    randomness
  );
  console.log("✅ VRF callback simulated");
  console.log(`🎲 Randomness seed: ${randomness}`);
  
  // Check winners
  const winners = await campaignManager.getWinners();
  console.log(`🏆 Winners selected: ${winners.join(", ")}`);
  console.log(`✅ Selection complete: ${await campaignManager.isSelectionComplete()}\n`);

  // Step 4: Setup Rewards
  console.log("💰 Step 4: Setting up rewards...");
  const rewardAmount = ethers.parseEther("1000"); // 1000 tokens total
  
  // Mint tokens to deployer
  await mockERC20.mint(deployer.address, rewardAmount);
  console.log(`✅ Minted ${ethers.formatEther(rewardAmount)} tokens to deployer`);
  
  // Approve and deposit rewards
  await mockERC20.approve(await rewardEscrow.getAddress(), rewardAmount);
  await rewardEscrow.deposit(rewardAmount);
  console.log(`✅ Deposited ${ethers.formatEther(rewardAmount)} tokens to escrow`);
  console.log(`📊 Total rewards in escrow: ${ethers.formatEther(await rewardEscrow.totalRewardsDeposited())}\n`);

  // Step 5: Unlock Rewards (dcipher signer)
  console.log("🔓 Step 5: Unlocking rewards...");
  await rewardEscrow.unlockRewards();
  console.log("✅ Rewards unlocked by dcipher signer");
  console.log(`🔓 Rewards unlocked: ${await rewardEscrow.areRewardsUnlocked()}\n`);

  // Step 6: Claim Rewards
  console.log("🎁 Step 6: Claiming rewards...");
  const rewardPerWinner = await rewardEscrow.getRewardAmount();
  console.log(`💰 Reward per winner: ${ethers.formatEther(rewardPerWinner)} tokens`);
  
  for (let i = 0; i < winners.length; i++) {
    const winner = winners[i];
    const winnerSigner = ethers.provider.getSigner(winner);
    
    try {
      const tx = await rewardEscrow.connect(winnerSigner).claimReward();
      await tx.wait();
      console.log(`✅ ${winner} claimed ${ethers.formatEther(rewardPerWinner)} tokens`);
    } catch (error) {
      console.log(`❌ ${winner} failed to claim: ${error.message}`);
    }
  }

  // Final Status
  console.log("\n🎉 Workflow Complete!");
  console.log("====================");
  console.log(`📊 Campaign Status: ${await campaignManager.isSelectionComplete() ? "Complete" : "In Progress"}`);
  console.log(`🏆 Winners: ${winners.join(", ")}`);
  console.log(`💰 Total Rewards: ${ethers.formatEther(await rewardEscrow.totalRewardsDeposited())} tokens`);
  console.log(`🔓 Rewards Unlocked: ${await rewardEscrow.areRewardsUnlocked() ? "Yes" : "No"}`);
  
  // Check individual winner balances
  console.log("\n💳 Winner Balances:");
  for (const winner of winners) {
    const balance = await mockERC20.balanceOf(winner);
    const hasClaimed = await rewardEscrow.hasClaimed(winner);
    console.log(`- ${winner}: ${ethers.formatEther(balance)} tokens (Claimed: ${hasClaimed ? "Yes" : "No"})`);
  }

  console.log("\n📋 Contract Addresses:");
  console.log(`- MockERC20: ${await mockERC20.getAddress()}`);
  console.log(`- CampaignManager: ${await campaignManager.getAddress()}`);
  console.log(`- RewardEscrow: ${await rewardEscrow.getAddress()}`);
  console.log(`- MockRandomnessSender: ${await mockRandomnessSender.getAddress()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Workflow failed:", error);
    process.exit(1);
  });
