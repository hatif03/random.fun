import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white/60 backdrop-blur-sm border-t border-slate-200/50 py-8 mt-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-lg font-light text-slate-900">DCipher</span>
          </div>
          <p className="text-slate-600 text-sm mb-4">
            MEV-protected decentralized exchange with encrypted transaction ordering
          </p>
          <div className="text-slate-500 text-xs">
            © 2024 DCipher. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
