"use client";
import React, { useState } from "react";
import Image from "next/image";

interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string;
}

interface TokenSelectorProps {
  selectedToken: Token;
  onTokenSelect: (token: Token) => void;
  tokens: Token[];
}

const TokenSelector: React.FC<TokenSelectorProps> = ({
  selectedToken,
  onTokenSelect,
  tokens,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTokenSelect = (token: Token) => {
    onTokenSelect(token);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-slate-300 transition-all duration-200 min-w-[140px] shadow-sm hover:shadow-md"
      >
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
          {selectedToken.logoURI ? (
            <Image
              src={selectedToken.logoURI}
              alt={selectedToken.symbol}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <span className="text-sm font-semibold text-slate-600">
              {selectedToken.symbol.charAt(0)}
            </span>
          )}
        </div>
        <span className="font-medium text-slate-900">
          {selectedToken.symbol}
        </span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 max-h-80 overflow-hidden">
          <div className="p-4">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search tokens..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {tokens.map((token) => (
                <button
                  key={token.address}
                  onClick={() => handleTokenSelect(token)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors duration-150 ${
                    selectedToken.address === token.address
                      ? "bg-slate-100 border border-slate-200"
                      : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    {token.logoURI ? (
                      <Image
                        src={token.logoURI}
                        alt={token.symbol}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-slate-600">
                        {token.symbol.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-slate-900">
                      {token.symbol}
                    </div>
                    <div className="text-sm text-slate-500">
                      {token.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default TokenSelector;
