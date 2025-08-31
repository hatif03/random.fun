import { expect } from "chai";
import { ethers } from "hardhat";
import { CampaignManager } from "../typechain-types";

describe("CampaignManager", function () {
  let campaignManager: CampaignManager;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addr3: any;
  let addr4: any;
  let addr5: any;
  let mockRandomnessSender: any;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();

    // Deploy mock randomness sender
    const MockRandomnessSender = await ethers.getContractFactory("MockRandomnessSender");
    mockRandomnessSender = await MockRandomnessSender.deploy();

    // Deploy CampaignManager
    const CampaignManager = await ethers.getContractFactory("CampaignManager");
    campaignManager = await CampaignManager.deploy(
      await mockRandomnessSender.getAddress(),
      owner.address
    );
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await campaignManager.owner()).to.equal(owner.address);
    });

    it("Should set the correct randomness sender", async function () {
      expect(await campaignManager.randomnessSender()).to.equal(await mockRandomnessSender.getAddress());
    });

    it("Should have initial state correctly set", async function () {
      expect(await campaignManager.isSelectionComplete()).to.equal(false);
      expect(await campaignManager.getEligibleParticipantCount()).to.equal(0);
      expect(await campaignManager.getWinnerCount()).to.equal(0);
    });
  });

  describe("Campaign Setup", function () {
    it("Should allow owner to setup campaign", async function () {
      const participants = [addr1.address, addr2.address, addr3.address];
      const winnerCount = 2;

      await expect(campaignManager.setupCampaign(participants, winnerCount))
        .to.emit(campaignManager, "CampaignSetup")
        .withArgs(participants);

      expect(await campaignManager.getEligibleParticipantCount()).to.equal(3);
      expect(await campaignManager.winnerCount()).to.equal(2);
    });

    it("Should not allow non-owner to setup campaign", async function () {
      const participants = [addr1.address, addr2.address];
      const winnerCount = 1;

      await expect(
        campaignManager.connect(addr1).setupCampaign(participants, winnerCount)
      ).to.be.revertedWith("Only callable by owner");
    });

    it("Should not allow empty participants array", async function () {
      const participants: string[] = [];
      const winnerCount = 1;

      await expect(
        campaignManager.setupCampaign(participants, winnerCount)
      ).to.be.revertedWith("Participants array cannot be empty");
    });

    it("Should not allow winner count greater than participants", async function () {
      const participants = [addr1.address, addr2.address];
      const winnerCount = 3;

      await expect(
        campaignManager.setupCampaign(participants, winnerCount)
      ).to.be.revertedWith("Invalid winner count");
    });

    it("Should not allow zero winner count", async function () {
      const participants = [addr1.address, addr2.address];
      const winnerCount = 0;

      await expect(
        campaignManager.setupCampaign(participants, winnerCount)
      ).to.be.revertedWith("Invalid winner count");
    });

    it("Should not allow duplicate setup after completion", async function () {
      const participants = [addr1.address, addr2.address];
      const winnerCount = 1;

      await campaignManager.setupCampaign(participants, winnerCount);
      
      // Mock the randomness callback to complete selection
      await mockRandomnessSender.mockRandomnessCallback(
        await campaignManager.getAddress(),
        1, // requestId
        ethers.keccak256(ethers.toUtf8Bytes("random"))
      );

      await expect(
        campaignManager.setupCampaign(participants, winnerCount)
      ).to.be.revertedWith("Campaign already completed");
    });
  });

  describe("Winner Selection", function () {
    beforeEach(async function () {
      const participants = [addr1.address, addr2.address, addr3.address, addr4.address, addr5.address];
      const winnerCount = 2;
      await campaignManager.setupCampaign(participants, winnerCount);
    });

    it("Should allow owner to request winner selection", async function () {
      const callbackGasLimit = 100000;

      await expect(campaignManager.requestWinnerSelection(callbackGasLimit))
        .to.emit(campaignManager, "WinnerSelectionRequested");

      expect(await campaignManager.requestId()).to.not.equal(0);
    });

    it("Should not allow non-owner to request winner selection", async function () {
      const callbackGasLimit = 100000;

      await expect(
        campaignManager.connect(addr1).requestWinnerSelection(callbackGasLimit)
      ).to.be.revertedWith("Only callable by owner");
    });

    it("Should not allow winner selection without setup", async function () {
      const newCampaignManager = await (await ethers.getContractFactory("CampaignManager")).deploy(
        await mockRandomnessSender.getAddress(),
        owner.address
      );

      const callbackGasLimit = 100000;

      await expect(
        newCampaignManager.requestWinnerSelection(callbackGasLimit)
      ).to.be.revertedWith("No participants set");
    });

    it("Should not allow winner selection after completion", async function () {
      const callbackGasLimit = 100000;

      // Mock the randomness callback to complete selection
      await mockRandomnessSender.mockRandomnessCallback(
        await campaignManager.getAddress(),
        1, // requestId
        ethers.keccak256(ethers.toUtf8Bytes("random"))
      );

      await expect(
        campaignManager.requestWinnerSelection(callbackGasLimit)
      ).to.be.revertedWith("Selection already completed");
    });
  });

  describe("Randomness Callback", function () {
    beforeEach(async function () {
      const participants = [addr1.address, addr2.address, addr3.address, addr4.address, addr5.address];
      const winnerCount = 2;
      await campaignManager.setupCampaign(participants, winnerCount);
    });

    it("Should process randomness and select winners", async function () {
      const requestId = 1;
      const randomness = ethers.keccak256(ethers.toUtf8Bytes("random"));

      // Mock the randomness callback
      await mockRandomnessSender.mockRandomnessCallback(
        await campaignManager.getAddress(),
        requestId,
        randomness
      );

      expect(await campaignManager.isSelectionComplete()).to.equal(true);
      expect(await campaignManager.getWinnerCount()).to.equal(2);
      
      const winners = await campaignManager.getWinners();
      expect(winners.length).to.equal(2);
      
      // Check that winners are marked in the mapping
      for (const winner of winners) {
        expect(await campaignManager.isWinnerMapping(winner)).to.equal(true);
      }
    });

    it("Should not process randomness with wrong request ID", async function () {
      const wrongRequestId = 999;
      const randomness = ethers.keccak256(ethers.toUtf8Bytes("random"));

      // Mock the randomness callback with wrong request ID
      await mockRandomnessSender.mockRandomnessCallback(
        await campaignManager.getAddress(),
        wrongRequestId,
        randomness
      );

      expect(await campaignManager.isSelectionComplete()).to.equal(false);
    });

    it("Should not process randomness twice", async function () {
      const requestId = 1;
      const randomness = ethers.keccak256(ethers.toUtf8Bytes("random"));

      // First callback
      await mockRandomnessSender.mockRandomnessCallback(
        await campaignManager.getAddress(),
        requestId,
        randomness
      );

      expect(await campaignManager.isSelectionComplete()).to.equal(true);

      // Second callback should not change state
      const newRandomness = ethers.keccak256(ethers.toUtf8Bytes("new random"));
      await mockRandomnessSender.mockRandomnessCallback(
        await campaignManager.getAddress(),
        requestId,
        newRandomness
      );

      // State should remain the same
      expect(await campaignManager.isSelectionComplete()).to.equal(true);
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      const participants = [addr1.address, addr2.address, addr3.address];
      const winnerCount = 1;
      await campaignManager.setupCampaign(participants, winnerCount);
    });

    it("Should return correct eligible participants", async function () {
      const participants = await campaignManager.getEligibleParticipants();
      expect(participants).to.include(addr1.address);
      expect(participants).to.include(addr2.address);
      expect(participants).to.include(addr3.address);
      expect(participants.length).to.equal(3);
    });

    it("Should return correct winner count", async function () {
      expect(await campaignManager.getWinnerCount()).to.equal(0); // Before selection
      
      // Mock selection
      await mockRandomnessSender.mockRandomnessCallback(
        await campaignManager.getAddress(),
        1,
        ethers.keccak256(ethers.toUtf8Bytes("random"))
      );

      expect(await campaignManager.getWinnerCount()).to.equal(1); // After selection
    });

    it("Should check winner status correctly", async function () {
      // Mock selection
      await mockRandomnessSender.mockRandomnessCallback(
        await campaignManager.getAddress(),
        1,
        ethers.keccak256(ethers.toUtf8Bytes("random"))
      );

      const winners = await campaignManager.getWinners();
      expect(winners.length).to.equal(1);
      
      // Check winner status
      expect(await campaignManager.isWinner(winners[0])).to.equal(true);
      expect(await campaignManager.isWinner(addr4.address)).to.equal(false);
    });
  });
});

// Mock RandomnessSender contract for testing
describe("MockRandomnessSender", function () {
  let mockRandomnessSender: any;
  let owner: any;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();

    const MockRandomnessSender = await ethers.getContractFactory("MockRandomnessSender");
    mockRandomnessSender = await MockRandomnessSender.deploy();
  });

  it("Should be able to mock randomness callback", async function () {
    const receiver = ethers.Wallet.createRandom().address;
    const requestId = 1;
    const randomness = ethers.keccak256(ethers.toUtf8Bytes("test"));

    await expect(
      mockRandomnessSender.mockRandomnessCallback(receiver, requestId, randomness)
    ).to.not.be.reverted;
  });
});
