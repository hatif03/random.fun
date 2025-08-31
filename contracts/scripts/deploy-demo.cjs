const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting VRF Campaign Demo Deployment...\n");

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
  await mockERC20.deployed();
  console.log(`✅ MockERC20 deployed to: ${mockERC20.address}`);

  const MockRandomnessSender = await ethers.getContractFactory("MockRandomnessSender");
  const mockRandomnessSender = await MockRandomnessSender.deploy();
  await mockRandomnessSender.deployed();
  console.log(`✅ MockRandomnessSender deployed to: ${mockRandomnessSender.address}`);

  const CampaignManager = await ethers.getContractFactory("CampaignManager");
  const campaignManager = await CampaignManager.deploy(
    mockRandomnessSender.address,
    deployer.address
  );
  await campaignManager.deployed();
  console.log(`✅ CampaignManager deployed to: ${campaignManager.address}`);

  const RewardEscrow = await ethers.getContractFactory("RewardEscrow");
  const rewardEscrow = await RewardEscrow.deploy(
    deployer.address,
    campaignManager.address,
    mockERC20.address,
    deployer.address // Using deployer as dcipher signer for demo
  );
  await rewardEscrow.deployed();
  console.log(`✅ RewardEscrow deployed to: ${rewardEscrow.address}\n`);

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
    const tx = await campaignManager.requestWinnerSelection(callbackGasLimit, { value: ethers.utils.parseEther("0.1") });
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
  const randomness = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("demo-randomness"));
  
  await mockRandomnessSender.mockRandomnessCallback(
    campaignManager.address,
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
  const rewardAmount = ethers.utils.parseEther("1000"); // 1000 tokens total
  
  // Mint tokens to deployer
  await mockERC20.mint(deployer.address, rewardAmount);
  console.log(`✅ Minted ${ethers.utils.formatEther(rewardAmount)} tokens to deployer`);
  
  // Approve and deposit rewards
  await mockERC20.approve(rewardEscrow.address, rewardAmount);
  await rewardEscrow.deposit(rewardAmount);
  console.log(`✅ Deposited ${ethers.utils.formatEther(rewardAmount)} tokens to RewardEscrow\n`);

  // Step 5: Simulate dcipher unlocking rewards
  console.log("🔓 Step 5: Simulating dcipher unlocking rewards...");
  await rewardEscrow.unlockRewards();
  console.log("✅ Rewards unlocked by dcipher signer\n");

  // Step 6: Winners claim rewards
  console.log("🎁 Step 6: Winners claiming rewards...");
  for (let i = 0; i < winners.length; i++) {
    const winner = winners[i];
    const winnerSigner = [participant1, participant2, participant3, participant4, participant5].find(
      p => p.address === winner
    );
    
    if (winnerSigner) {
      const balanceBefore = await mockERC20.balanceOf(winner);
      await rewardEscrow.connect(winnerSigner).claimReward();
      const balanceAfter = await mockERC20.balanceOf(winner);
      const claimed = balanceAfter.sub(balanceBefore);
      console.log(`✅ ${winner} claimed ${ethers.utils.formatEther(claimed)} tokens`);
    }
  }

  console.log("\n🎉 Demo Deployment Complete!");
  console.log("=============================");
  console.log("Contract Addresses:");
  console.log(`- MockERC20: ${mockERC20.address}`);
  console.log(`- MockRandomnessSender: ${mockRandomnessSender.address}`);
  console.log(`- CampaignManager: ${campaignManager.address}`);
  console.log(`- RewardEscrow: ${rewardEscrow.address}`);
  console.log("\nDemo participants can now interact with the contracts!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
