"use client";
import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";

interface Transaction {
  id: string;
  status: string;
  timestamp: number;
  hash?: string;
  type: "swap" | "approval";
}

const TransactionStatus: React.FC = () => {
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock transaction data - in production this would come from blockchain events
  useEffect(() => {
    if (address) {
      // Simulate some recent transactions
      const mockTransactions: Transaction[] = [
        {
          id: "1",
          status: "Success",
          timestamp: Date.now() - 300000, // 5 minutes ago
          hash: "0x1234...5678",
          type: "swap",
        },
        {
          id: "2",
          status: "Included in Block",
          timestamp: Date.now() - 60000, // 1 minute ago
          type: "swap",
        },
      ];
      setTransactions(mockTransactions);
    }
  }, [address]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Encrypting...":
        return "🔒";
      case "Awaiting Signature...":
        return "✍️";
      case "Submitted & Shielded":
        return "📦";
      case "Included in Block":
        return "⛓️";
      case "Executing...":
        return "⚡";
      case "Success":
        return "✅";
      case "Failed":
        return "❌";
      default:
        return "⏳";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Success":
        return "text-emerald-600";
      case "Failed":
        return "text-red-600";
      case "Included in Block":
        return "text-blue-600";
      case "Executing...":
        return "text-amber-600";
      default:
        return "text-slate-600";
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  if (!address) {
    return (
      <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6">
        <div className="text-center text-slate-500">
          Connect wallet to view transactions
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-slate-900">
          Recent Transactions
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-600 hover:text-slate-800 text-sm font-medium transition-colors duration-200"
        >
          {isExpanded ? "Show Less" : "Show All"}
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-slate-300 text-4xl mb-3">📋</div>
          <p className="text-slate-500 text-sm font-medium">
            No transactions yet
          </p>
          <p className="text-slate-400 text-xs mt-1">
            Your swap transactions will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions
            .slice(0, isExpanded ? transactions.length : 3)
            .map((tx) => (
              <div
                key={tx.id}
                className="border border-slate-200/50 rounded-xl p-4 hover:bg-white/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{getStatusIcon(tx.status)}</span>
                    <span className={`text-sm font-medium ${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {formatTime(tx.timestamp)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="capitalize font-medium">{tx.type}</span>
                  {tx.hash && (
                    <a
                      href={`https://sepolia.basescan.org/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 hover:text-slate-800 hover:underline transition-colors duration-200"
                    >
                      View on Explorer
                    </a>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Transaction Flow Info */}
      <div className="mt-8 pt-6 border-t border-slate-200/50">
        <h4 className="text-sm font-medium text-slate-700 mb-4">
          Transaction Flow
        </h4>
        <div className="space-y-3 text-xs text-slate-600">
          <div className="flex items-center space-x-3">
            <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-medium">1</span>
            <span>Client-side encryption</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xs font-medium">2</span>
            <span>Submitted to encrypted mempool</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-medium">3</span>
            <span>Included in block</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xs font-medium">4</span>
            <span>Decrypted and executed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionStatus;
