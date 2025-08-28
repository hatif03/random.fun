#!/bin/bash

# DCipher DEX Deployment Script
# This script deploys all DCipher contracts to the specified network

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -n, --network NETWORK    Target network (filecoin_mainnet, filecoin_calibration, arbitrum_sepolia, optimism_sepolia, base_sepolia)"
    echo "  -k, --key PRIVATE_KEY    Private key for deployment (without 0x prefix)"
    echo "  -r, --rpc RPC_URL        Custom RPC URL (optional, overrides network default)"
    echo "  -s, --sequencer ADDRESS  Sequencer address (optional, uses default if not specified)"
    echo "  -d, --dex-router ADDRESS DEX router address (optional, uses default if not specified)"
    echo "  -o, --owner ADDRESS      Owner address (optional, uses deployer if not specified)"
    echo "  -h, --help               Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 -n base_sepolia -k 1234567890abcdef..."
    echo "  $0 -n filecoin_calibration -k 1234567890abcdef... -s 0x1234... -d 0x5678..."
    echo ""
    echo "Environment Variables:"
    echo "  PRIVATE_KEY              Private key for deployment (alternative to -k)"
    echo "  NETWORK                  Target network (alternative to -n)"
    echo ""
    echo "Supported Networks:"
    echo "  filecoin_mainnet         Filecoin Mainnet (Chain ID: 314)"
    echo "  filecoin_calibration    Filecoin Calibration Testnet (Chain ID: 314159)"
    echo "  arbitrum_sepolia        Arbitrum Sepolia Testnet (Chain ID: 421614)"
    echo "  optimism_sepolia        Optimism Sepolia Testnet (Chain ID: 11155420)"
    echo "  base_sepolia            Base Sepolia Testnet (Chain ID: 84532)"
}

# Default values
NETWORK=""
PRIVATE_KEY=""
RPC_URL=""
SEQUENCER=""
DEX_ROUTER=""
OWNER=""

# Network configurations
declare -A NETWORK_CONFIGS
NETWORK_CONFIGS[filecoin_mainnet]="314|https://api.node.glif.io/rpc/v1|0x34092470CC59A097d770523931E3bC179370B44b"
NETWORK_CONFIGS[filecoin_calibration]="314159|https://api.calibration.node.glif.io/rpc/v1|0xF00aB3B64c81b6Ce51f8220EB2bFaa2D469cf702"
NETWORK_CONFIGS[arbitrum_sepolia]="421614|https://sepolia-rollup.arbitrum.io/rpc|0xd22302849a87d5B00f13e504581BC086300DA080"
NETWORK_CONFIGS[optimism_sepolia]="11155420|https://sepolia.optimism.io|0xd22302849a87d5B00f13e504581BC086300DA080"
NETWORK_CONFIGS[base_sepolia]="84532|https://sepolia.base.org|0x82Fed730CbdeC5A2D8724F2e3b316a70A565e27e"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -n|--network)
            NETWORK="$2"
            shift 2
            ;;
        -k|--key)
            PRIVATE_KEY="$2"
            shift 2
            ;;
        -r|--rpc)
            RPC_URL="$2"
            shift 2
            ;;
        -s|--sequencer)
            SEQUENCER="$2"
            shift 2
            ;;
        -d|--dex-router)
            DEX_ROUTER="$2"
            shift 2
            ;;
        -o|--owner)
            OWNER="$2"
            shift 2
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Check if required parameters are provided
if [[ -z "$NETWORK" ]]; then
    NETWORK=${NETWORK:-$NETWORK_ENV}
fi

if [[ -z "$PRIVATE_KEY" ]]; then
    PRIVATE_KEY=${PRIVATE_KEY:-$PRIVATE_KEY_ENV}
fi

if [[ -z "$NETWORK" ]]; then
    print_error "Network not specified. Use -n option or set NETWORK environment variable."
    show_usage
    exit 1
fi

if [[ -z "$PRIVATE_KEY" ]]; then
    print_error "Private key not specified. Use -k option or set PRIVATE_KEY environment variable."
    show_usage
    exit 1
fi

# Validate network
if [[ ! ${NETWORK_CONFIGS[$NETWORK]+_} ]]; then
    print_error "Unsupported network: $NETWORK"
    echo "Supported networks: ${!NETWORK_CONFIGS[@]}"
    exit 1
fi

# Parse network configuration
IFS='|' read -r CHAIN_ID DEFAULT_RPC BLOCKLOCK_SENDER <<< "${NETWORK_CONFIGS[$NETWORK]}"

# Use custom RPC if provided, otherwise use default
if [[ -n "$RPC_URL" ]]; then
    RPC_URL_FINAL="$RPC_URL"
else
    RPC_URL_FINAL="$DEFAULT_RPC"
fi

# Set default addresses if not provided
if [[ -z "$SEQUENCER" ]]; then
    SEQUENCER="0x1234567890123456789012345678901234567890"
    print_warning "Using default sequencer address: $SEQUENCER"
fi

if [[ -z "$DEX_ROUTER" ]]; then
    DEX_ROUTER="0x1234567890123456789012345678901234567890"
    print_warning "Using default DEX router address: $DEX_ROUTER"
fi

if [[ -z "$OWNER" ]]; then
    # Extract owner address from private key
    OWNER=$(cast wallet address --private-key "$PRIVATE_KEY")
    print_status "Using deployer as owner: $OWNER"
fi

# Display deployment configuration
print_status "Deployment Configuration:"
echo "  Network: $NETWORK (Chain ID: $CHAIN_ID)"
echo "  RPC URL: $RPC_URL_FINAL"
echo "  Blocklock Sender: $BLOCKLOCK_SENDER"
echo "  Sequencer: $SEQUENCER"
echo "  DEX Router: $DEX_ROUTER"
echo "  Owner: $OWNER"
echo ""

# Confirm deployment
read -p "Do you want to proceed with deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_status "Deployment cancelled."
    exit 0
fi

# Check if forge is available
if ! command -v forge &> /dev/null; then
    print_error "Foundry (forge) is not installed or not in PATH"
    echo "Please install Foundry: https://getfoundry.sh/"
    exit 1
fi

# Check if we're in the contracts directory
if [[ ! -f "foundry.toml" ]]; then
    print_error "This script must be run from the contracts directory"
    exit 1
fi

# Build contracts first
print_status "Building contracts..."
forge build
if [[ $? -eq 0 ]]; then
    print_success "Contracts built successfully"
else
    print_error "Contract build failed"
    exit 1
fi

# Set environment variables for deployment
export PRIVATE_KEY="$PRIVATE_KEY"
export RPC_URL="$RPC_URL_FINAL"

# Create deployment command
DEPLOY_CMD="forge script Deploy --rpc-url $RPC_URL_FINAL --broadcast --verify"

# Add network-specific verification if supported
case $NETWORK in
    base_sepolia)
        DEPLOY_CMD="$DEPLOY_CMD --etherscan-api-key $ETHERSCAN_API_KEY"
        ;;
    arbitrum_sepolia)
        DEPLOY_CMD="$DEPLOY_CMD --etherscan-api-key $ARBISCAN_API_KEY"
        ;;
    optimism_sepolia)
        DEPLOY_CMD="$DEPLOY_CMD --etherscan-api-key $OPTIMISM_ETHERSCAN_API_KEY"
        ;;
esac

# Execute deployment
print_status "Starting deployment..."
print_status "Command: $DEPLOY_CMD"
echo ""

# Run deployment
if eval $DEPLOY_CMD; then
    print_success "Deployment completed successfully!"
    echo ""
    print_status "Next steps:"
    echo "  1. Verify contracts on the network's block explorer"
    echo "  2. Update your frontend configuration with the new contract addresses"
    echo "  3. Test the deployed contracts"
    echo ""
    print_status "Contract addresses can be found in the deployment output above."
else
    print_error "Deployment failed!"
    exit 1
fi
