"use client";
import React from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => {
  return (
    <div className="fixed top-0 w-full h-20 flex items-center justify-between z-10 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
      <div className="relative lg:left-8 left-4">
        <Link href="/">
          <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <div className="hidden md:block">
              <div className="text-xl font-light text-slate-900">DCipher</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center space-x-8 pr-8">
        <Link href="/" className="text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium">
          Home
        </Link>
        <Link href="/blocklock" className="text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium">
          Text Encrypt
        </Link>
        <Link href="/swap" className="text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium">
          DCipher Swap
        </Link>
      </nav>

      {/* Wallet Connect */}
      <div className="relative lg:right-8 right-4">
        <ConnectButton />
      </div>
    </div>
  );
};

export default Header;

