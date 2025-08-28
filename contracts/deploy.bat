@echo off
setlocal enabledelayedexpansion

REM DCipher DEX Deployment Script for Windows
REM This script deploys all DCipher contracts to the specified network

REM Colors for output (Windows 10+ supports ANSI colors)
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM Function to print colored output
:print_status
echo %BLUE%[INFO]%NC% %~1
goto :eof

:print_success
echo %GREEN%[SUCCESS]%NC% %~1
goto :eof

REM Function to show usage
:show_usage
echo Usage: %~nx0 [OPTIONS]
echo.
echo Options:
echo   -n NETWORK    Target network (filecoin_mainnet, filecoin_calibration, arbitrum_sepolia, optimism_sepolia, base_sepolia)
echo   -k KEY        Private key for deployment (without 0x prefix)
echo   -r RPC_URL    Custom RPC URL (optional, overrides network default)
echo   -s ADDRESS    Sequencer address (optional, uses default if not specified)
echo   -d ADDRESS    DEX router address (optional, uses default if not specified)
echo   -o ADDRESS    Owner address (optional, uses deployer if not specified)
echo   -h            Show this help message
echo.
echo Examples:
echo   %~nx0 -n base_sepolia -k 1234567890abcdef...
echo   %~nx0 -n filecoin_calibration -k 1234567890abcdef... -s 0x1234... -d 0x5678...
echo.
echo Environment Variables:
echo   PRIVATE_KEY              Private key for deployment (alternative to -k)
echo   NETWORK                  Target network (alternative to -n)
echo.
echo Supported Networks:
echo   filecoin_mainnet         Filecoin Mainnet (Chain ID: 314)
echo   filecoin_calibration    Filecoin Calibration Testnet (Chain ID: 314159)
echo   arbitrum_sepolia        Arbitrum Sepolia Testnet (Chain ID: 421614)
echo   optimism_sepolia        Optimism Sepolia Testnet (Chain ID: 11155420)
echo   base_sepolia            Base Sepolia Testnet (Chain ID: 84532)
goto :eof

REM Default values
set "NETWORK="
set "PRIVATE_KEY="
set "RPC_URL="
set "SEQUENCER="
set "DEX_ROUTER="
set "OWNER="

REM Parse command line arguments
:parse_args
if "%~1"=="" goto :check_params
if "%~1"=="-n" (
    set "NETWORK=%~2"
    shift
    shift
    goto :parse_args
)
if "%~1"=="-k" (
    set "PRIVATE_KEY=%~2"
    shift
    shift
    goto :parse_args
)
if "%~1"=="-r" (
    set "RPC_URL=%~2"
    shift
    shift
    goto :parse_args
)
if "%~1"=="-s" (
    set "SEQUENCER=%~2"
    shift
    shift
    goto :parse_args
)
if "%~1"=="-d" (
    set "DEX_ROUTER=%~2"
    shift
    shift
    goto :parse_args
)
if "%~1"=="-o" (
    set "OWNER=%~2"
    shift
    shift
    goto :parse_args
)
if "%~1"=="-h" (
    call :show_usage
    exit /b 0
)
echo Unknown option: %~1
call :show_usage
exit /b 1

:check_params
REM Check if required parameters are provided
if "%NETWORK%"=="" (
    if defined NETWORK_ENV set "NETWORK=%NETWORK_ENV%"
)
if "%PRIVATE_KEY%"=="" (
    if defined PRIVATE_KEY_ENV set "PRIVATE_KEY=%PRIVATE_KEY_ENV%"
)

if "%NETWORK%"=="" (
    echo Network not specified. Use -n option or set NETWORK environment variable.
    call :show_usage
    exit /b 1
)

if "%PRIVATE_KEY%"=="" (
    echo Private key not specified. Use -k option or set PRIVATE_KEY environment variable.
    call :show_usage
    exit /b 1
)

REM Network configurations
if "%NETWORK%"=="filecoin_mainnet" (
    set "CHAIN_ID=314"
    set "DEFAULT_RPC=https://api.node.glif.io/rpc/v1"
    set "BLOCKLOCK_SENDER=0x34092470CC59A097d770523931E3bC179370B44b"
) else if "%NETWORK%"=="filecoin_calibration" (
    set "CHAIN_ID=314159"
    set "DEFAULT_RPC=https://api.calibration.node.glif.io/rpc/v1"
    set "BLOCKLOCK_SENDER=0xF00aB3B64c81b6Ce51f8220EB2bFaa2D469cf702"
) else if "%NETWORK%"=="arbitrum_sepolia" (
    set "CHAIN_ID=421614"
    set "DEFAULT_RPC=https://sepolia-rollup.arbitrum.io/rpc"
    set "BLOCKLOCK_SENDER=0xd22302849a87d5B00f13e504581BC086300DA080"
) else if "%NETWORK%"=="optimism_sepolia" (
    set "CHAIN_ID=11155420"
    set "DEFAULT_RPC=https://sepolia.optimism.io"
    set "BLOCKLOCK_SENDER=0xd22302849a87d5B00f13e504581BC086300DA080"
) else if "%NETWORK%"=="base_sepolia" (
    set "CHAIN_ID=84532"
    set "DEFAULT_RPC=https://sepolia.base.org"
    set "BLOCKLOCK_SENDER=0x82Fed730CbdeC5A2D8724F2e3b316a70A565e27e"
) else (
    echo Unsupported network: %NETWORK%
    echo Supported networks: filecoin_mainnet, filecoin_calibration, arbitrum_sepolia, optimism_sepolia, base_sepolia
    exit /b 1
)

REM Use custom RPC if provided, otherwise use default
if not "%RPC_URL%"=="" (
    set "RPC_URL_FINAL=%RPC_URL%"
) else (
    set "RPC_URL_FINAL=%DEFAULT_RPC%"
)

REM Set default addresses if not provided
if "%SEQUENCER%"=="" (
    set "SEQUENCER=0x1234567890123456789012345678901234567890"
    echo %YELLOW%[WARNING]%NC% Using default sequencer address: %SEQUENCER%
)

if "%DEX_ROUTER%"=="" (
    set "DEX_ROUTER=0x1234567890123456789012345678901234567890"
    echo %YELLOW%[WARNING]%NC% Using default DEX router address: %DEX_ROUTER%
)

if "%OWNER%"=="" (
    echo %BLUE%[INFO]%NC% Using deployer as owner (will be extracted from private key)
)

REM Display deployment configuration
call :print_status "Deployment Configuration:"
echo   Network: %NETWORK% (Chain ID: %CHAIN_ID%)
echo   RPC URL: %RPC_URL_FINAL%
echo   Blocklock Sender: %BLOCKLOCK_SENDER%
echo   Sequencer: %SEQUENCER%
echo   DEX Router: %DEX_ROUTER%
echo   Owner: %OWNER%
echo.

REM Confirm deployment
set /p "CONFIRM=Do you want to proceed with deployment? (y/N): "
if /i not "%CONFIRM%"=="y" (
    call :print_status "Deployment cancelled."
    exit /b 0
)

REM Check if forge is available
where forge >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo %RED%[ERROR]%NC% Foundry (forge) is not installed or not in PATH
    echo Please install Foundry: https://getfoundry.sh/
    exit /b 1
)

REM Check if we're in the contracts directory
if not exist "foundry.toml" (
    echo %RED%[ERROR]%NC% This script must be run from the contracts directory
    exit /b 1
)

REM Build contracts first
call :print_status "Building contracts..."
forge build
if %ERRORLEVEL% neq 0 (
    echo %RED%[ERROR]%NC% Contract build failed
    exit /b 1
)
call :print_success "Contracts built successfully"

REM Set environment variables for deployment
set "PRIVATE_KEY=%PRIVATE_KEY%"
set "RPC_URL=%RPC_URL_FINAL%"

REM Create deployment command
set "DEPLOY_CMD=forge script Deploy --rpc-url %RPC_URL_FINAL% --broadcast --verify"

REM Add network-specific verification if supported
if "%NETWORK%"=="base_sepolia" (
    if defined ETHERSCAN_API_KEY set "DEPLOY_CMD=%DEPLOY_CMD% --etherscan-api-key %ETHERSCAN_API_KEY%"
) else if "%NETWORK%"=="arbitrum_sepolia" (
    if defined ARBISCAN_API_KEY set "DEPLOY_CMD=%DEPLOY_CMD% --etherscan-api-key %ARBISCAN_API_KEY%"
) else if "%NETWORK%"=="optimism_sepolia" (
    if defined OPTIMISM_ETHERSCAN_API_KEY set "DEPLOY_CMD=%DEPLOY_CMD% --etherscan-api-key %OPTIMISM_ETHERSCAN_API_KEY%"
)

REM Execute deployment
call :print_status "Starting deployment..."
call :print_status "Command: %DEPLOY_CMD%"
echo.

REM Run deployment
%DEPLOY_CMD%
if %ERRORLEVEL% equ 0 (
    call :print_success "Deployment completed successfully!"
    echo.
    call :print_status "Next steps:"
    echo   1. Verify contracts on the network's block explorer
    echo   2. Update your frontend configuration with the new contract addresses
    echo   3. Test the deployed contracts
    echo.
    call :print_status "Contract addresses can be found in the deployment output above."
) else (
    echo %RED%[ERROR]%NC% Deployment failed!
    exit /b 1
)

endlocal
