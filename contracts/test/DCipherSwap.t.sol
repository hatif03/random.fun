// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {ConfigContract} from "../src/ConfigContract.sol";
import {BatcherContract} from "../src/BatcherContract.sol";
import {ExecutorContract} from "../src/ExecutorContract.sol";
import {DCipherSwap} from "../src/DCipherSwap.sol";
import {TypesLib} from "blocklock-solidity/libraries/TypesLib.sol";

/// @title DCipherSwap Test
/// @notice Test suite for DCipher contracts
/// @author DCipher Team
contract DCipherSwapTest is Test {
    
    // Test addresses
    address public constant BLOCKLOCK_SENDER = address(0x1234);
    address public constant SEQUENCER = address(0x5678);
    address public constant DEX_ROUTER = address(0x9ABC);
    address public constant USER = address(0xDEF0);
    address public constant OWNER = address(0x1111);
    
    // Contracts
    ConfigContract public configContract;
    BatcherContract public batcherContract;
    ExecutorContract public executorContract;
    DCipherSwap public dcipherSwap;
    
    // Test data
    address[] public testKeypers;
    uint32 public constant TEST_BATCH_SPAN = 50;
    uint64 public constant TEST_TX_SIZE_LIMIT = 512;
    uint64 public constant TEST_BATCH_SIZE_LIMIT = 5120;
    
    function setUp() public {
        // Set up test keypers
        testKeypers = new address[](3);
        testKeypers[0] = address(0x1111);
        testKeypers[1] = address(0x2222);
        testKeypers[2] = address(0x3333);
        
        // Set owner context BEFORE deploying contracts
        vm.startPrank(OWNER);
        
        // Deploy contracts
        configContract = new ConfigContract();
        batcherContract = new BatcherContract(address(configContract));
        executorContract = new ExecutorContract(
            address(configContract),
            address(batcherContract),
            SEQUENCER,
            DEX_ROUTER
        );
        dcipherSwap = new DCipherSwap(
            BLOCKLOCK_SENDER,
            address(configContract),
            address(batcherContract),
            address(executorContract)
        );
        
        // Configure the system (now OWNER is the deployer)
        _configureTestSystem();
        
        vm.stopPrank();
        
        // Set up test environment
        vm.label(address(configContract), "ConfigContract");
        vm.label(address(batcherContract), "BatcherContract");
        vm.label(address(executorContract), "ExecutorContract");
        vm.label(address(dcipherSwap), "DCipherSwap");
        vm.label(BLOCKLOCK_SENDER, "BlocklockSender");
        vm.label(SEQUENCER, "Sequencer");
        vm.label(DEX_ROUTER, "DEXRouter");
        vm.label(USER, "User");
        vm.label(OWNER, "Owner");
    }
    
    function _configureTestSystem() internal {
        // Set up configuration (owner context already set in setUp)
        configContract.setNextKeypers(testKeypers, 2); // 2 out of 3 threshold
        configContract.setNextBatchSpan(TEST_BATCH_SPAN);
        configContract.setNextSizeLimits(TEST_TX_SIZE_LIMIT, TEST_BATCH_SIZE_LIMIT);
        configContract.setNextTargets(
            address(0), // feeReceiver
            address(executorContract),
            bytes4(keccak256("executeBatch(uint64,bytes[])"))
        );
        
        // Schedule configuration with proper delay (MIN_CONFIG_DELAY = 100 blocks)
        configContract.scheduleNextConfig(1, uint64(block.number + 101));
        
        // Fast forward to the scheduled block to allow activation
        vm.roll(block.number + 101);
        
        // The new config will be at index 1 (since there's already a default config at index 0)
        configContract.activateConfig(1);
    }
    
    function test_ContractDeployment() public view {
        assertEq(address(configContract), address(configContract));
        assertEq(address(batcherContract), address(batcherContract));
        assertEq(address(executorContract), address(executorContract));
        assertEq(address(dcipherSwap), address(dcipherSwap));
    }
    
    function test_ConfigContractInitialization() public view {
        ConfigContract.BatchConfig memory config = configContract.getCurrentConfig();
        assertEq(config.batchSpan, TEST_BATCH_SPAN);
        assertEq(config.transactionSizeLimit, TEST_TX_SIZE_LIMIT);
        assertEq(config.batchSizeLimit, TEST_BATCH_SIZE_LIMIT);
        assertEq(config.keypers.length, 3);
        assertEq(config.threshold, 2);
    }
    
    function test_BatcherContractInitialization() public view {
        uint64 currentBatch = batcherContract.getCurrentBatchIndex();
        assertEq(currentBatch, 0);
        
        BatcherContract.Batch memory batch = batcherContract.getBatch(0);
        assertEq(batch.batchIndex, 0);
        assertEq(batch.isFinalized, false);
        assertEq(batch.isExecuted, false);
    }
    
    function test_ExecutorContractInitialization() public view {
        assertEq(executorContract.getSequencer(), SEQUENCER);
        assertEq(executorContract.getDexRouter(), DEX_ROUTER);
    }
    
    function test_DCipherSwapInitialization() public view {
        assertEq(address(dcipherSwap.configContract()), address(configContract));
        assertEq(address(dcipherSwap.batcherContract()), address(batcherContract));
        assertEq(address(dcipherSwap.executorContract()), address(executorContract));
    }
    
    function test_SubmitTransaction() public {
        vm.startPrank(USER);
        
        bytes memory encryptedTx = abi.encode("test transaction data");
        (uint64 batchIndex, uint256 requestId) = batcherContract.submitTransaction(encryptedTx);
        
        assertEq(batchIndex, 0);
        assertGt(requestId, 0);
        
        BatcherContract.Batch memory batch = batcherContract.getBatch(0);
        assertEq(batch.encryptedTransactions.length, 1);
        assertEq(batch.totalSize, encryptedTx.length);
        
        vm.stopPrank();
    }
    
    function test_BatchFinalization() public {
        // Submit a transaction
        vm.prank(USER);
        batcherContract.submitTransaction(abi.encode("test data"));
        
        // Fast forward to trigger batch finalization
        vm.roll(block.number + TEST_BATCH_SPAN);
        
        // Finalize batch
        batcherContract.finalizeBatch(0);
        
        BatcherContract.Batch memory batch = batcherContract.getBatch(0);
        assertEq(batch.isFinalized, true);
        assertEq(batch.endBlock, block.number);
    }
    
    function test_ConfigUpdate() public {
        // Set owner context for configuration calls
        vm.startPrank(OWNER);
        
        // Set new configuration
        configContract.setNextKeypers(testKeypers, 3); // 3 out of 3 threshold
        configContract.setNextBatchSpan(75);
        
        // Schedule new config with proper delay
        configContract.scheduleNextConfig(2, uint64(block.number + 150));
        
        // Fast forward to the scheduled block
        vm.roll(block.number + 150);
        
        // Activate new config
        configContract.activateConfig(2);
        
        vm.stopPrank();
        
        ConfigContract.BatchConfig memory config = configContract.getCurrentConfig();
        assertEq(config.batchSpan, 75);
        assertEq(config.threshold, 3);
    }
    
    function test_AccessControl() public {
        // Test that only owner can update config
        vm.startPrank(USER);
        
        vm.expectRevert();
        configContract.setNextBatchSpan(200);
        
        vm.stopPrank();
        
        // Test that only sequencer can execute batches
        vm.startPrank(USER);
        
        vm.expectRevert();
        executorContract.executeBatch(0, new bytes[](0));
        
        vm.stopPrank();
    }
    
    function test_BatchSizeLimits() public {
        vm.startPrank(USER);
        
        // Submit transaction within size limit
        bytes memory smallTx = new bytes(TEST_TX_SIZE_LIMIT);
        batcherContract.submitTransaction(smallTx);
        
        // Try to submit transaction exceeding size limit
        bytes memory largeTx = new bytes(TEST_TX_SIZE_LIMIT + 1);
        vm.expectRevert("Transaction too large");
        batcherContract.submitTransaction(largeTx);
        
        vm.stopPrank();
    }
    
    function test_RequestIdGeneration() public {
        vm.startPrank(USER);
        
        bytes memory tx1 = abi.encode("transaction 1");
        bytes memory tx2 = abi.encode("transaction 2");
        
        (, uint256 request1) = batcherContract.submitTransaction(tx1);
        (, uint256 request2) = batcherContract.submitTransaction(tx2);
        
        // Request IDs should be different
        assertTrue(request1 != request2);
        
        vm.stopPrank();
    }
    
    function test_EmergencyFunctions() public {
        // Test emergency pause
        vm.prank(OWNER);
        executorContract.emergencyPauseBatch(0);
        
        assertTrue(executorContract.isBatchExecuted(0));
    }
    
    function test_ConfigurationValidation() public {
        // Set owner context for configuration calls
        vm.startPrank(OWNER);
        
        // Test invalid threshold
        vm.expectRevert("Invalid threshold");
        configContract.setNextKeypers(testKeypers, 4); // 4 > 3 keypers
        
        // Test invalid batch span
        vm.expectRevert("Batch span must be positive");
        configContract.setNextBatchSpan(0);
        
        // Test invalid size limits
        vm.expectRevert("Batch size limit must be >= transaction size limit");
        configContract.setNextSizeLimits(1000, 500); // batch < transaction
        
        vm.stopPrank();
    }
}
