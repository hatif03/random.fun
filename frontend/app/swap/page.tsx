"use client";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import SwapCard from "@/components/SwapCard";
import SettingsModal from "@/components/SettingsModal";
import TransactionStatus from "@/components/TransactionStatus";
import Header from "@/components/header";
import Footer from "@/components/Footer";
import Wallet from "../wallet";

const SwapPage = () => {
  const { isConnected } = useAccount();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (!isConnected) {
    return <Wallet />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-light text-slate-900 mb-6 tracking-tight">
            DCipher
            <span className="block text-4xl md:text-5xl font-normal text-slate-600 mt-2">
              MEV-Protected Swaps
            </span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Trade with confidence using encrypted transaction ordering that prevents front-running
          </p>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Swap Interface - Takes up 2/3 of the space */}
          <div className="xl:col-span-2">
            <SwapCard />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Settings Button */}
            <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all duration-200 font-medium text-sm tracking-wide"
              >
                ⚙️ Swap Settings
              </button>
            </div>

            {/* Transaction Status */}
            <TransactionStatus />
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-light text-slate-900 text-center mb-16">
            How MEV Protection Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300 shadow-lg">
                <span className="text-3xl text-white">🔒</span>
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-3">Encrypt</h3>
              <p className="text-slate-600 leading-relaxed">
                Your trade details are encrypted client-side before submission
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300 shadow-lg">
                <span className="text-3xl text-white">📦</span>
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-3">Batch</h3>
              <p className="text-slate-600 leading-relaxed">
                Encrypted transactions are batched and ordered by the sequencer
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300 shadow-lg">
                <span className="text-3xl text-white">⚡</span>
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-3">Execute</h3>
              <p className="text-slate-600 leading-relaxed">
                Transactions are decrypted and executed in the committed order
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default SwapPage;
