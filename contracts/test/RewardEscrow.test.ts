import { expect } from "chai";
import { ethers } from "hardhat";
import { RewardEscrow, MockERC20 } from "../typechain-types";

describe("RewardEscrow", function () {
  let rewardEscrow: RewardEscrow;
  let mockERC20: MockERC20;
  let campaignManager: any;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addr3: any;
  let dcipherSigner: any;
  let mockRandomnessSender: any;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2, addr3, dcipherSigner] = await ethers.getSigners();

    // Deploy mock contracts
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockERC20 = await MockERC20.deploy("Mock Token", "MTK");

    const MockRandomnessSender = await ethers.getContractFactory("MockRandomnessSender");
    mockRandomnessSender = await MockRandomnessSender.deploy();

    const CampaignManager = await ethers.getContractFactory("CampaignManager");
    campaignManager = await CampaignManager.deploy(
      await mockRandomnessSender.getAddress(),
      owner.address
    );

    // Deploy RewardEscrow
    const RewardEscrow = await ethers.getContractFactory("RewardEscrow");
    rewardEscrow = await RewardEscrow.deploy(
      owner.address,
      await campaignManager.getAddress(),
      await mockERC20.getAddress(),
      dcipherSigner.address
    );

    // Setup campaign with participants
    const participants = [addr1.address, addr2.address, addr3.address];
    const winnerCount = 2;
    await campaignManager.setupCampaign(participants, winnerCount);

    // Mock winner selection
    await mockRandomnessSender.mockRandomnessCallback(
      await campaignManager.getAddress(),
      1,
      ethers.keccak256(ethers.toUtf8Bytes("random"))
    );

    // Mint tokens to owner for testing
    const mintAmount = ethers.parseEther("1000");
    await mockERC20.mint(owner.address, mintAmount);
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await rewardEscrow.owner()).to.equal(owner.address);
    });

    it("Should set the correct campaign manager", async function () {
      expect(await rewardEscrow.campaignManager()).to.equal(await campaignManager.getAddress());
    });

    it("Should set the correct reward token", async function () {
      expect(await rewardEscrow.rewardToken()).to.equal(await mockERC20.getAddress());
    });

    it("Should set the correct dcipher signer", async function () {
      expect(await rewardEscrow.dcipherSigner()).to.equal(dcipherSigner.address);
    });

    it("Should have initial state correctly set", async function () {
      expect(await rewardEscrow.areRewardsUnlocked()).to.equal(false);
      expect(await rewardEscrow.totalRewardsDeposited()).to.equal(0);
    });
  });

  describe("Reward Deposit", function () {
    it("Should allow owner to deposit rewards", async function () {
      const depositAmount = ethers.parseEther("100");
      
      // Approve tokens first
      await mockERC20.approve(await rewardEscrow.getAddress(), depositAmount);
      
      await expect(rewardEscrow.deposit(depositAmount))
        .to.emit(rewardEscrow, "RewardsDeposited")
        .withArgs(owner.address, depositAmount);

      expect(await rewardEscrow.totalRewardsDeposited()).to.equal(depositAmount);
    });

    it("Should not allow non-owner to deposit rewards", async function () {
      const depositAmount = ethers.parseEther("100");
      
      // Approve tokens for addr1
      await mockERC20.approve(await rewardEscrow.getAddress(), depositAmount);
      
      await expect(
        rewardEscrow.connect(addr1).deposit(depositAmount)
      ).to.be.revertedWith("Only owner can call this function");
    });

    it("Should not allow zero amount deposit", async function () {
      await expect(
        rewardEscrow.deposit(0)
      ).to.be.revertedWith("Amount must be greater than 0");
    });

    it("Should not allow deposit after rewards are unlocked", async function () {
      // First deposit
      const depositAmount = ethers.parseEther("100");
      await mockERC20.approve(await rewardEscrow.getAddress(), depositAmount);
      await rewardEscrow.deposit(depositAmount);

      // Unlock rewards
      await rewardEscrow.connect(dcipherSigner).unlockRewards();

      // Try to deposit again
      await mockERC20.approve(await rewardEscrow.getAddress(), depositAmount);
      await expect(
        rewardEscrow.deposit(depositAmount)
      ).to.be.revertedWith("Rewards already unlocked");
    });
  });

  describe("Reward Unlock", function () {
    beforeEach(async function () {
      // Deposit some rewards first
      const depositAmount = ethers.parseEther("100");
      await mockERC20.approve(await rewardEscrow.getAddress(), depositAmount);
      await rewardEscrow.deposit(depositAmount);
    });

    it("Should allow dcipher signer to unlock rewards", async function () {
      await expect(rewardEscrow.connect(dcipherSigner).unlockRewards())
        .to.emit(rewardEscrow, "RewardsUnlocked")
        .withArgs(dcipherSigner.address);

      expect(await rewardEscrow.areRewardsUnlocked()).to.equal(true);
    });

    it("Should not allow non-dcipher signer to unlock rewards", async function () {
      await expect(
        rewardEscrow.connect(addr1).unlockRewards()
      ).to.be.revertedWith("Only dcipher signer can call this function");
    });

    it("Should not allow unlocking rewards twice", async function () {
      await rewardEscrow.connect(dcipherSigner).unlockRewards();

      await expect(
        rewardEscrow.connect(dcipherSigner).unlockRewards()
      ).to.be.revertedWith("Rewards already unlocked");
    });

    it("Should not allow unlocking without deposits", async function () {
      // Deploy new escrow without deposits
      const newRewardEscrow = await (await ethers.getContractFactory("RewardEscrow")).deploy(
        owner.address,
        await campaignManager.getAddress(),
        await mockERC20.getAddress(),
        dcipherSigner.address
      );

      await expect(
        newRewardEscrow.connect(dcipherSigner).unlockRewards()
      ).to.be.revertedWith("No rewards deposited");
    });
  });

  describe("Reward Claim", function () {
    beforeEach(async function () {
      // Deposit rewards
      const depositAmount = ethers.parseEther("100");
      await mockERC20.approve(await rewardEscrow.getAddress(), depositAmount);
      await rewardEscrow.deposit(depositAmount);

      // Unlock rewards
      await rewardEscrow.connect(dcipherSigner).unlockRewards();
    });

    it("Should allow winners to claim rewards", async function () {
      const winners = await campaignManager.getWinners();
      expect(winners.length).to.equal(2);

      const winner = winners[0];
      const initialBalance = await mockERC20.balanceOf(winner);
      const expectedReward = ethers.parseEther("50"); // 100 / 2 winners

      await expect(rewardEscrow.connect(ethers.provider.getSigner(winner)).claimReward())
        .to.emit(rewardEscrow, "RewardClaimed")
        .withArgs(winner, expectedReward);

      const finalBalance = await mockERC20.balanceOf(winner);
      expect(finalBalance - initialBalance).to.equal(expectedReward);
    });

    it("Should not allow non-winners to claim rewards", async function () {
      // addr4 is not a winner
      const addr4 = ethers.Wallet.createRandom();
      
      await expect(
        rewardEscrow.connect(ethers.provider.getSigner(addr4.address)).claimReward()
      ).to.be.revertedWith("Not a winner");
    });

    it("Should not allow claiming before unlock", async function () {
      // Deploy new escrow without unlocking
      const newRewardEscrow = await (await ethers.getContractFactory("RewardEscrow")).deploy(
        owner.address,
        await campaignManager.getAddress(),
        await mockERC20.getAddress(),
        dcipherSigner.address
      );

      const depositAmount = ethers.parseEther("100");
      await mockERC20.approve(await newRewardEscrow.getAddress(), depositAmount);
      await newRewardEscrow.deposit(depositAmount);

      const winners = await campaignManager.getWinners();
      const winner = winners[0];

      await expect(
        newRewardEscrow.connect(ethers.provider.getSigner(winner)).claimReward()
      ).to.be.revertedWith("Rewards are not yet unlocked");
    });

    it("Should not allow claiming twice", async function () {
      const winners = await campaignManager.getWinners();
      const winner = winners[0];

      // First claim
      await rewardEscrow.connect(ethers.provider.getSigner(winner)).claimReward();

      // Second claim should fail
      await expect(
        rewardEscrow.connect(ethers.provider.getSigner(winner)).claimReward()
      ).to.be.revertedWith("Already claimed");
    });

    it("Should mark winners as claimed", async function () {
      const winners = await campaignManager.getWinners();
      const winner = winners[0];

      expect(await rewardEscrow.hasClaimed(winner)).to.equal(false);

      await rewardEscrow.connect(ethers.provider.getSigner(winner)).claimReward();

      expect(await rewardEscrow.hasClaimed(winner)).to.equal(true);
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      // Deposit rewards
      const depositAmount = ethers.parseEther("100");
      await mockERC20.approve(await rewardEscrow.getAddress(), depositAmount);
      await rewardEscrow.deposit(depositAmount);
    });

    it("Should return correct reward amount", async function () {
      // Before unlock
      expect(await rewardEscrow.getRewardAmount()).to.equal(0);

      // After unlock
      await rewardEscrow.connect(dcipherSigner).unlockRewards();
      const expectedReward = ethers.parseEther("50"); // 100 / 2 winners
      expect(await rewardEscrow.getRewardAmount()).to.equal(expectedReward);
    });

    it("Should check claim eligibility correctly", async function () {
      const winners = await campaignManager.getWinners();
      const winner = winners[0];
      const nonWinner = ethers.Wallet.createRandom().address;

      // Before unlock
      expect(await rewardEscrow.canClaim(winner)).to.equal(false);
      expect(await rewardEscrow.canClaim(nonWinner)).to.equal(false);

      // After unlock
      await rewardEscrow.connect(dcipherSigner).unlockRewards();
      expect(await rewardEscrow.canClaim(winner)).to.equal(true);
      expect(await rewardEscrow.canClaim(nonWinner)).to.equal(false);

      // After claiming
      await rewardEscrow.connect(ethers.provider.getSigner(winner)).claimReward();
      expect(await rewardEscrow.canClaim(winner)).to.equal(false);
    });

    it("Should return correct winner count", async function () {
      expect(await rewardEscrow.getWinnerCount()).to.equal(2);
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow owner to emergency withdraw before unlock", async function () {
      const depositAmount = ethers.parseEther("100");
      await mockERC20.approve(await rewardEscrow.getAddress(), depositAmount);
      await rewardEscrow.deposit(depositAmount);

      const initialBalance = await mockERC20.balanceOf(owner.address);
      
      await rewardEscrow.emergencyWithdraw(await mockERC20.getAddress(), depositAmount);
      
      const finalBalance = await mockERC20.balanceOf(owner.address);
      expect(finalBalance - initialBalance).to.equal(depositAmount);
    });

    it("Should not allow emergency withdraw after unlock", async function () {
      const depositAmount = ethers.parseEther("100");
      await mockERC20.approve(await rewardEscrow.getAddress(), depositAmount);
      await rewardEscrow.deposit(depositAmount);

      await rewardEscrow.connect(dcipherSigner).unlockRewards();

      await expect(
        rewardEscrow.emergencyWithdraw(await mockERC20.getAddress(), depositAmount)
      ).to.be.revertedWith("Cannot withdraw after unlock");
    });

    it("Should not allow non-owner to emergency withdraw", async function () {
      const depositAmount = ethers.parseEther("100");
      await mockERC20.approve(await rewardEscrow.getAddress(), depositAmount);
      await rewardEscrow.deposit(depositAmount);

      await expect(
        rewardEscrow.connect(addr1).emergencyWithdraw(await mockERC20.getAddress(), depositAmount)
      ).to.be.revertedWith("Only owner can call this function");
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to update campaign manager", async function () {
      const newCampaignManager = ethers.Wallet.createRandom().address;
      
      await rewardEscrow.updateCampaignManager(newCampaignManager);
      
      expect(await rewardEscrow.campaignManager()).to.equal(newCampaignManager);
    });

    it("Should not allow non-owner to update campaign manager", async function () {
      const newCampaignManager = ethers.Wallet.createRandom().address;
      
      await expect(
        rewardEscrow.connect(addr1).updateCampaignManager(newCampaignManager)
      ).to.be.revertedWith("Only owner can call this function");
    });

    it("Should not allow updating campaign manager after unlock", async function () {
      // Deposit and unlock rewards
      const depositAmount = ethers.parseEther("100");
      await mockERC20.approve(await rewardEscrow.getAddress(), depositAmount);
      await rewardEscrow.deposit(depositAmount);
      await rewardEscrow.connect(dcipherSigner).unlockRewards();

      const newCampaignManager = ethers.Wallet.createRandom().address;
      
      await expect(
        rewardEscrow.updateCampaignManager(newCampaignManager)
      ).to.be.revertedWith("Cannot update after unlock");
    });

    it("Should not allow setting zero address as campaign manager", async function () {
      await expect(
        rewardEscrow.updateCampaignManager(ethers.ZeroAddress)
      ).to.be.revertedWith("Campaign manager cannot be zero address");
    });
  });
});

// Mock ERC20 contract for testing
describe("MockERC20", function () {
  let mockERC20: MockERC20;
  let owner: any;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockERC20 = await MockERC20.deploy("Mock Token", "MTK");
  });

  it("Should mint tokens correctly", async function () {
    const mintAmount = ethers.parseEther("100");
    await mockERC20.mint(owner.address, mintAmount);
    
    expect(await mockERC20.balanceOf(owner.address)).to.equal(mintAmount);
  });
});
