"use client";
import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useSwap } from "@/hooks/useSwap";
import TokenSelector from "./TokenSelector";
import { ethers } from "ethers";

// Mock token data - in production this would come from an API
const MOCK_TOKENS = [
  {
    address: "0x0000000000000000000000000000000000000000",
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    logoURI: "/assets/logos/eth.svg",
  },
  {
    address: "0x4200000000000000000000000000000000000006",
    symbol: "WETH",
    name: "Wrapped Ethereum",
    decimals: 18,
    logoURI: "/assets/logos/weth.svg",
  },
  {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logoURI: "/assets/logos/usdc.svg",
  },
];

const SwapCard = () => {
  const { address } = useAccount();
  const [tokenIn, setTokenIn] = useState(MOCK_TOKENS[0]);
  const [tokenOut, setTokenOut] = useState(MOCK_TOKENS[2]);
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("");
  const [slippage, setSlippage] = useState(0.5);
  const [deadline, setDeadline] = useState(20); // minutes
  const [isLoading, setIsLoading] = useState(false);

  const { executeSwap, swapStatus } = useSwap();

  // Mock price calculation - in production this would come from DEX aggregator
  const calculatePrice = (amount: string, fromToken: any, toToken: any) => {
    if (!amount || parseFloat(amount) <= 0) return "0";
    
    // Mock exchange rate (1 ETH = 2000 USDC)
    const rate = fromToken.symbol === "ETH" && toToken.symbol === "USDC" ? 2000 : 0.0005;
    const result = parseFloat(amount) * rate;
    return result.toFixed(6);
  };

  // Update amount out when amount in changes
  useEffect(() => {
    if (amountIn && tokenIn && tokenOut) {
      const calculated = calculatePrice(amountIn, tokenIn, tokenOut);
      setAmountOut(calculated);
    }
  }, [amountIn, tokenIn, tokenOut]);

  const handleSwap = async () => {
    if (!address || !amountIn || !amountOut || !tokenIn || !tokenOut) return;

    setIsLoading(true);
    try {
      const swapData = {
        tokenIn: tokenIn.address,
        tokenOut: tokenOut.address,
        amountIn: ethers.parseUnits(amountIn, tokenIn.decimals),
        amountOutMin: ethers.parseUnits(
          (parseFloat(amountOut) * (1 - slippage / 100)).toString(),
          tokenOut.decimals
        ),
        recipient: address,
        deadline: Math.floor(Date.now() / 1000) + deadline * 60,
        swapCalldata: "0x", // Mock calldata - in production this would be actual swap calldata
      };

      await executeSwap(swapData);
    } catch (error) {
      console.error("Swap failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchTokens = () => {
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
    setAmountIn(amountOut);
    setAmountOut(amountIn);
  };

  const isSwapDisabled = !amountIn || !amountOut || parseFloat(amountIn) <= 0 || isLoading;

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-3xl p-8 shadow-xl">
      <div className="space-y-8">
        {/* Token Input Section */}
        <div className="space-y-6">
          {/* From Token */}
          <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200/30">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-slate-600">From</span>
              <span className="text-sm text-slate-500">
                Balance: 0.0 {tokenIn.symbol}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <TokenSelector
                selectedToken={tokenIn}
                onTokenSelect={setTokenIn}
                tokens={MOCK_TOKENS}
              />
              <input
                type="number"
                value={amountIn}
                onChange={(e) => setAmountIn(e.target.value)}
                placeholder="0.0"
                className="flex-1 text-3xl font-light text-slate-900 bg-transparent outline-none placeholder-slate-300"
              />
            </div>
          </div>

          {/* Switch Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwitchTokens}
              className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* To Token */}
          <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200/30">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-slate-600">To</span>
              <span className="text-sm text-slate-500">
                Balance: 0.0 {tokenOut.symbol}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <TokenSelector
                selectedToken={tokenOut}
                onTokenSelect={setTokenOut}
                tokens={MOCK_TOKENS}
              />
              <input
                type="number"
                value={amountOut}
                onChange={(e) => setAmountOut(e.target.value)}
                placeholder="0.0"
                className="flex-1 text-3xl font-light text-slate-900 bg-transparent outline-none placeholder-slate-300"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Price Information */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/30 rounded-2xl p-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-blue-700 font-medium">Exchange Rate</span>
            <span className="text-blue-700 font-medium">
              1 {tokenIn.symbol} = {calculatePrice("1", tokenIn, tokenOut)} {tokenOut.symbol}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm mt-3">
            <span className="text-blue-600">Slippage Tolerance</span>
            <span className="text-blue-600 font-medium">{slippage}%</span>
          </div>
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={isSwapDisabled}
          className={`w-full py-5 px-6 rounded-2xl font-medium text-lg transition-all duration-300 ${
            isSwapDisabled
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            "Swap"
          )}
        </button>

        {/* Transaction Status */}
        {swapStatus && (
          <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200/30">
            <div className="text-sm text-slate-600 font-medium">
              Status: {swapStatus}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwapCard;
