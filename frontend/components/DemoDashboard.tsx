'use client';

import { useState, useEffect } from 'react';
import { getCampaign, getTransactionHistory, getWinnerSelection, simulateTVLUpdate } from '../lib/mockService';
import type { Campaign, MockTransaction } from '../lib/mockData';

export default function DemoDashboard() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [transactions, setTransactions] = useState<MockTransaction[]>([]);
  const [winnerSelection, setWinnerSelection] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadData();
    // Auto-update TVL every 10 seconds for demo
    const interval = setInterval(() => {
      if (campaign?.status === 'awaiting') {
        updateTVL();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setCampaign(getCampaign());
    setTransactions(getTransactionHistory());
    setWinnerSelection(getWinnerSelection());
  };

  const updateTVL = async () => {
    setIsUpdating(true);
    try {
      const updatedCampaign = await simulateTVLUpdate();
      setCampaign(updatedCampaign);
    } catch (error) {
      console.error('Failed to update TVL:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!campaign) return <div>Loading...</div>;

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'setup': return 'bg-yellow-500';
      case 'selection': return 'bg-pink-500';
      case 'awaiting': return 'bg-blue-500';
      case 'claiming': return 'bg-black';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Campaign Overview */}
      <div className="card card-pink">
        <h2 className="heading-2 mb-4 md:mb-6 text-xl md:text-2xl lg:text-3xl text-black">Campaign Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="text-center p-3 md:p-4 border-2 border-black bg-white">
            <div className="text-xl md:text-2xl font-black">{campaign.whitelist.length}</div>
            <div className="caption text-xs md:text-sm">Whitelist Size</div>
          </div>
          <div className="text-center p-3 md:p-4 border-2 border-black bg-white">
            <div className="text-xl md:text-2xl font-black">{campaign.winners}</div>
            <div className="caption text-xs md:text-sm">Winners</div>
          </div>
          <div className="text-center p-3 md:p-4 border-2 border-black bg-white">
            <div className="text-xl md:text-2xl font-black">{campaign.rewards.length}</div>
            <div className="caption text-xs md:text-sm">Reward Tiers</div>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          <div className="flex items-center justify-between">
            <span className="caption text-black text-xs md:text-sm">Status:</span>
            <span className={`status-badge ${getStatusColor(campaign.status)} text-xs md:text-sm`}>
              {campaign.status.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="caption text-black text-xs md:text-sm">Created:</span>
            <span className="text-black text-sm md:text-base">{formatDate(campaign.createdAt)}</span>
          </div>

          {campaign.deployedAt && (
            <div className="flex items-center justify-between">
              <span className="caption text-black text-xs md:text-sm">Deployed:</span>
              <span className="text-black text-sm md:text-base">{formatDate(campaign.deployedAt)}</span>
            </div>
          )}

          {campaign.selectionStartedAt && (
            <div className="flex items-center justify-between">
              <span className="caption text-black text-xs md:text-sm">Selection Started:</span>
              <span className="text-black text-sm md:text-base">{formatDate(campaign.selectionStartedAt)}</span>
            </div>
          )}
        </div>
      </div>

      {/* TVL Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="heading-3 text-lg md:text-xl">TVL Progress</h3>
          <button
            onClick={updateTVL}
            disabled={isUpdating || campaign.status !== 'awaiting'}
            className="btn btn-pink text-xs md:text-sm"
          >
            {isUpdating ? 'Updating...' : 'Simulate Progress'}
          </button>
        </div>

        <div className="space-y-3 md:space-y-4">
          <div className="flex justify-between mb-2">
            <span className="caption text-xs md:text-sm">Current TVL</span>
            <span className="font-bold text-sm md:text-base">${parseInt(campaign.currentValue).toLocaleString()}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${campaign.progress}%` }}
            ></div>
          </div>
          <div className="text-right mt-1">
            <span className="caption text-xs md:text-sm">Target: ${parseInt(campaign.targetValue).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Winner Selection */}
      {winnerSelection && (
        <div className="card">
          <h3 className="heading-3 mb-3 md:mb-4 text-lg md:text-xl">Winner Selection</h3>
          
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center justify-between">
              <span className="caption text-xs md:text-sm">VRF Provider:</span>
              <span className="text-sm md:text-base">{winnerSelection.vrfProvider}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="caption text-xs md:text-sm">Request ID:</span>
              <span className="text-sm md:text-base font-mono">{formatAddress(winnerSelection.requestId)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="caption text-xs md:text-sm">Selection Time:</span>
              <span className="text-sm md:text-base">{formatDate(winnerSelection.selectionTimestamp)}</span>
            </div>
          </div>

          <div className="border-t-2 border-black pt-3 md:pt-4 mt-3 md:mt-4">
            <h4 className="heading-3 mb-2 md:mb-3 text-base md:text-lg">Selected Winners</h4>
            <div className="space-y-2 md:space-y-3">
              {winnerSelection.selectedWinners.map((winner: string, index: number) => (
                <div key={winner} className="flex items-center justify-between p-2 border border-black bg-gray-50">
                  <span className="text-sm md:text-base font-mono">{formatAddress(winner)}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs md:text-sm bg-yellow-500 px-2 py-1 border border-black">
                      Winner #{index + 1}
                    </span>
                    <span className="text-xs md:text-sm bg-pink-500 px-2 py-1 border border-black text-black">
                      {campaign.rewards[index]?.amount} {campaign.rewards[index]?.token}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="card">
        <h3 className="heading-3 mb-3 md:mb-4 text-lg md:text-xl">Transaction History</h3>
        
        <div className="space-y-2 md:space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 border border-black bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`status-badge ${tx.status === 'success' ? 'bg-green-500' : tx.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'} text-xs`}>
                    {tx.status.toUpperCase()}
                  </span>
                  <span className="text-xs md:text-sm font-bold uppercase">{tx.type}</span>
                </div>
                <div className="text-xs md:text-sm">{tx.description}</div>
                {tx.hash && (
                  <div className="text-xs font-mono text-gray-600 mt-1">
                    {formatAddress(tx.hash)}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-xs md:text-sm">{formatDate(tx.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
