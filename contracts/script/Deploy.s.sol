// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {ConfigContract} from "../src/ConfigContract.sol";
import {BatcherContract} from "../src/BatcherContract.sol";
import {ExecutorContract} from "../src/ExecutorContract.sol";
import {DCipherSwap} from "../src/DCipherSwap.sol";

/// @title Deploy Script
/// @notice Script to deploy all DCipher contracts
/// @author DCipher Team
contract DeployScript is Script {
    
    // Configuration parameters
    address public constant BLOCKLOCK_SENDER = 0x34092470CC59A097d770523931E3bC179370B44b; // Filecoin mainnet
    address public constant SEQUENCER = 0x1234567890123456789012345678901234567890; // Replace with actual sequencer
    address public constant DEX_ROUTER = 0x1234567890123456789012345678901234567890; // Replace with actual DEX router
    
    // Default configuration values
    uint32 public constant DEFAULT_BATCH_SPAN = 100; // 100 blocks per batch
    uint64 public constant DEFAULT_TX_SIZE_LIMIT = 1024; // 1KB
    uint64 public constant DEFAULT_BATCH_SIZE_LIMIT = 10240; // 10KB
    address[] public DEFAULT_KEYPERS;
    uint32 public constant DEFAULT_THRESHOLD = 3;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy ConfigContract
        ConfigContract configContract = new ConfigContract();
        console2.log("ConfigContract deployed at:", address(configContract));
        
        // Deploy BatcherContract
        BatcherContract batcherContract = new BatcherContract(address(configContract));
        console2.log("BatcherContract deployed at:", address(batcherContract));
        
        // Deploy ExecutorContract
        ExecutorContract executorContract = new ExecutorContract(
            address(configContract),
            address(batcherContract),
            SEQUENCER,
            DEX_ROUTER
        );
        console2.log("ExecutorContract deployed at:", address(executorContract));
        
        // Deploy DCipherSwap
        DCipherSwap dcipherSwap = new DCipherSwap(
            BLOCKLOCK_SENDER,
            address(configContract),
            address(batcherContract),
            address(executorContract)
        );
        console2.log("DCipherSwap deployed at:", address(dcipherSwap));
        
        // Configure the system
        _configureSystem(configContract, batcherContract, executorContract);
        
        vm.stopBroadcast();
        
        console2.log("Deployment completed successfully!");
        console2.log("ConfigContract:", address(configContract));
        console2.log("BatcherContract:", address(batcherContract));
        console2.log("ExecutorContract:", address(executorContract));
        console2.log("DCipherSwap:", address(dcipherSwap));
    }
    
    function _configureSystem(
        ConfigContract configContract,
        BatcherContract batcherContract,
        ExecutorContract executorContract
    ) internal {
        // Set up default keypers (replace with actual addresses)
        DEFAULT_KEYPERS = new address[](5);
        DEFAULT_KEYPERS[0] = 0x1111111111111111111111111111111111111111;
        DEFAULT_KEYPERS[1] = 0x2222222222222222222222222222222222222222;
        DEFAULT_KEYPERS[2] = 0x3333333333333333333333333333333333333333;
        DEFAULT_KEYPERS[3] = 0x4444444444444444444444444444444444444444;
        DEFAULT_KEYPERS[4] = 0x5555555555555555555555555555555555555555;
        
        // Configure the system
        configContract.setNextKeypers(DEFAULT_KEYPERS, DEFAULT_THRESHOLD);
        configContract.setNextBatchSpan(DEFAULT_BATCH_SPAN);
        configContract.setNextSizeLimits(DEFAULT_TX_SIZE_LIMIT, DEFAULT_BATCH_SIZE_LIMIT);
        configContract.setNextTargets(
            address(0), // feeReceiver - set to zero for now
            address(executorContract),
            bytes4(keccak256("executeBatch(uint64,bytes[])"))
        );
        
        // Schedule the configuration
        configContract.scheduleNextConfig(1, uint64(block.number + 200)); // Start at batch 1, 200 blocks from now
        
        // Activate the configuration
        configContract.activateConfig(1);
        
        console2.log("System configuration completed!");
    }
}
