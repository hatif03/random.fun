"use client";
import React, { useState } from "react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [slippage, setSlippage] = useState(0.5);
  const [deadline, setDeadline] = useState(20);
  const [customSlippage, setCustomSlippage] = useState("");

  const handleSlippageChange = (value: number) => {
    setSlippage(value);
    setCustomSlippage("");
  };

  const handleCustomSlippageChange = (value: string) => {
    setCustomSlippage(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0 && numValue <= 50) {
      setSlippage(numValue);
    }
  };

  const handleSave = () => {
    // In a real app, you'd save these settings to local storage or context
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-lg mx-4 shadow-2xl border border-slate-200/50">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-light text-slate-900">
            Swap Settings
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-xl"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-8">
          {/* Slippage Tolerance */}
          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-4">
              Slippage Tolerance
            </h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Your transaction will revert if the price changes unfavorably by more than this percentage.
            </p>
            
            {/* Preset Slippage Options */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[0.1, 0.5, 1.0].map((value) => (
                <button
                  key={value}
                  onClick={() => handleSlippageChange(value)}
                  className={`py-3 px-4 rounded-xl border transition-all duration-200 font-medium ${
                    slippage === value && customSlippage === ""
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {value}%
                </button>
              ))}
            </div>

            {/* Custom Slippage Input */}
            <div className="flex items-center space-x-3">
              <input
                type="number"
                value={customSlippage}
                onChange={(e) => handleCustomSlippageChange(e.target.value)}
                placeholder="Custom"
                min="0.1"
                max="50"
                step="0.1"
                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
              <span className="text-slate-600 font-medium">%</span>
            </div>
            
            <p className="text-sm text-slate-500 mt-3">
              Current: {slippage}%
            </p>
          </div>

          {/* Transaction Deadline */}
          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-4">
              Transaction Deadline
            </h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Your transaction will revert if it is not confirmed within this time.
            </p>
            
            <div className="flex items-center space-x-3">
              <input
                type="number"
                value={deadline}
                onChange={(e) => setDeadline(parseInt(e.target.value) || 20)}
                min="1"
                max="1440"
                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
              <span className="text-slate-600 font-medium">minutes</span>
            </div>
            
            <p className="text-sm text-slate-500 mt-3">
              Transaction will expire in {deadline} minutes
            </p>
          </div>

          {/* Advanced Settings */}
          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-4">
              Advanced Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <span className="text-sm text-slate-700 font-medium">
                  MEV Protection
                </span>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    disabled
                    className="w-4 h-4 text-slate-900 bg-slate-100 border-slate-300 rounded focus:ring-slate-500"
                  />
                  <span className="ml-3 text-xs text-slate-500 font-medium">
                    Always Enabled
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <span className="text-sm text-slate-700 font-medium">
                  Gas Optimization
                </span>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-slate-900 bg-slate-100 border-slate-300 rounded focus:ring-slate-500"
                  />
                  <span className="ml-3 text-xs text-slate-500 font-medium">
                    Enabled
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-10">
          <button
            onClick={onClose}
            className="flex-1 py-4 px-6 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-4 px-6 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all duration-200 font-medium"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
