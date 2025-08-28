"use client";
import React from "react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-light text-slate-900 mb-8 tracking-tight">
            Welcome to
            <span className="block text-4xl md:text-5xl font-normal text-slate-600 mt-2">
              DCipher
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">
            Experience secure, MEV-protected trading with encrypted transaction ordering
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/swap">
              <div className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Start Trading
              </div>
            </Link>
            <Link href="/blocklock">
              <div className="px-8 py-4 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl transition-all duration-300 font-medium text-lg">
                Try Text Encryption
              </div>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300 shadow-lg">
              <span className="text-3xl text-white">🔒</span>
            </div>
            <h3 className="text-xl font-medium text-slate-900 mb-3">MEV Protection</h3>
            <p className="text-slate-600 leading-relaxed">
              Prevent front-running with encrypted transaction ordering
            </p>
          </div>
          
          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300 shadow-lg">
              <span className="text-3xl text-white">⚡</span>
            </div>
            <h3 className="text-xl font-medium text-slate-900 mb-3">Fast Execution</h3>
            <p className="text-slate-600 leading-relaxed">
              Quick and efficient swap execution with minimal delays
            </p>
          </div>
          
          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300 shadow-lg">
              <span className="text-3xl text-white">🛡️</span>
            </div>
            <h3 className="text-xl font-medium text-slate-900 mb-3">Secure Trading</h3>
            <p className="text-slate-600 leading-relaxed">
              Advanced encryption ensures your trades remain private
            </p>
          </div>
        </div>

        {/* Get Started Section */}
        <div className="text-center">
          <h2 className="text-3xl font-light text-slate-900 mb-6">
            Ready to Start Trading?
          </h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Connect your wallet and experience the future of decentralized trading with built-in MEV protection.
          </p>
          <Link href="/swap">
            <div className="inline-block px-10 py-5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white rounded-2xl transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Launch DCipher Swap
            </div>
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
