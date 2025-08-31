'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DemoDashboard from '../../components/DemoDashboard';
import { getCampaign } from '../../lib/mockService';
import type { Campaign } from '../../lib/mockData';

export default function DemoPage() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'workflow' | 'testing'>('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setCampaign(getCampaign());
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!campaign) return <div>Loading...</div>;

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="heading-1 mb-3 md:mb-4 text-3xl md:text-5xl lg:text-6xl">VRF Campaign Demo</h1>
          <p className="body-text text-base md:text-lg max-w-3xl mx-auto">
            Experience the complete VRF-powered campaign system with mock data and interactive features. 
            This demo showcases the entire workflow from campaign creation to winner selection and reward distribution.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-8 md:mb-12">
          <button
            onClick={() => setActiveTab('overview')}
            className={`btn mr-2 mb-2 ${activeTab === 'overview' ? 'btn-primary' : ''}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`btn mr-2 mb-2 ${activeTab === 'workflow' ? 'btn-primary' : ''}`}
          >
            Workflow
          </button>
          <button
            onClick={() => setActiveTab('testing')}
            className={`btn mr-2 mb-2 ${activeTab === 'testing' ? 'btn-primary' : ''}`}
          >
            Testing
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6 md:space-y-8">
            {/* Campaign Overview */}
            <div className="card card-pink">
              <h2 className="heading-2 mb-4 md:mb-6 text-xl md:text-2xl lg:text-3xl text-black">Campaign Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-6">
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
                <div className="text-center p-3 md:p-4 border-2 border-black bg-white">
                  <div className="text-xl md:text-2xl font-black">{campaign.progress}%</div>
                  <div className="caption text-xs md:text-sm">TVL Progress</div>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div>
                  <h3 className="heading-3 mb-2 md:mb-3 text-lg md:text-xl text-black">{campaign.name}</h3>
                  <p className="body-text text-black text-sm md:text-base">{campaign.description}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="caption text-black text-xs md:text-sm">Status:</span>
                  <span className={`status-badge status-${campaign.status} text-xs md:text-sm`}>
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

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <Link href="/admin" className="card hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="heading-3 mb-3 md:mb-4 text-lg md:text-xl">Admin Dashboard</h3>
                <p className="body-text text-sm md:text-base mb-4">
                  Create and manage campaigns, deploy contracts, and initiate VRF selection processes.
                </p>
                <div className="btn btn-primary w-full text-center">Go to Admin</div>
              </Link>

              <Link href="/campaign" className="card hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="heading-3 mb-3 md:mb-4 text-lg md:text-xl">Campaign Participation</h3>
                <p className="body-text text-sm md:text-base mb-4">
                  Check eligibility, verify winner status, and claim rewards as a participant.
                </p>
                <div className="btn btn-pink w-full text-center">Join Campaign</div>
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'workflow' && (
          <div className="space-y-6 md:space-y-8">
            {/* Workflow Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="card text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-yellow-500 border-4 border-black mx-auto mb-4 md:mb-6 flex items-center justify-center">
                  <span className="text-2xl md:text-3xl font-black text-black">1</span>
                </div>
                <h3 className="heading-3 mb-3 md:mb-4 text-lg md:text-xl">Campaign Setup</h3>
                <p className="body-text text-sm md:text-base mb-4">
                  Define whitelist, set winners, and establish on-chain goals for the campaign.
                </p>
                <div className="text-xs md:text-sm space-y-1">
                  <div>• Configure whitelist addresses</div>
                  <div>• Set number of winners</div>
                  <div>• Define target contract & function</div>
                  <div>• Deploy smart contract</div>
                </div>
              </div>

              <div className="card text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-pink-500 border-4 border-black mx-auto mb-4 md:mb-6 flex items-center justify-center">
                  <span className="text-2xl md:text-3xl font-black text-black">2</span>
                </div>
                <h3 className="heading-3 mb-3 md:mb-4 text-lg md:text-xl">VRF Selection</h3>
                <p className="body-text text-sm md:text-base mb-4">
                  Use Randamu VRF to randomly select winners from the eligible whitelist.
                </p>
                <div className="text-xs md:text-sm space-y-1">
                  <div>• Initiate VRF request</div>
                  <div>• Generate random numbers</div>
                  <div>• Select winners fairly</div>
                  <div>• Update on-chain state</div>
                </div>
              </div>

              <div className="card text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-black border-4 border-black mx-auto mb-4 md:mb-6 flex items-center justify-center">
                  <span className="text-2xl md:text-3xl font-black text-white">3</span>
                </div>
                <h3 className="heading-3 mb-3 md:mb-4 text-lg md:text-xl">Reward Distribution</h3>
                <p className="body-text text-sm md:text-base mb-4">
                  Winners claim rewards once the on-chain goal is achieved.
                </p>
                <div className="text-xs md:text-sm space-y-1">
                  <div>• Monitor goal progress</div>
                  <div>• Enable claiming</div>
                  <div>• Distribute rewards</div>
                  <div>• Track transactions</div>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="card">
              <h3 className="heading-3 mb-3 md:mb-4 text-lg md:text-xl">Technical Implementation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <h4 className="heading-3 mb-2 md:mb-3 text-base md:text-lg">Smart Contracts</h4>
                  <div className="space-y-2 text-sm md:text-base">
                    <div>• CampaignManager.sol - Main campaign logic</div>
                    <div>• RandomNumberGenerator.sol - VRF integration</div>
                    <div>• RewardEscrow.sol - Reward management</div>
                    <div>• MockERC20.sol - Test token implementation</div>
                  </div>
                </div>
                <div>
                  <h4 className="heading-3 mb-2 md:mb-3 text-base md:text-lg">VRF Integration</h4>
                  <div className="space-y-2 text-sm md:text-base">
                    <div>• Randamu VRF for randomness</div>
                    <div>• BLS signature verification</div>
                    <div>• On-chain winner selection</div>
                    <div>• Verifiable randomness proofs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'testing' && (
          <div className="space-y-6 md:space-y-8">
            {/* Testing Instructions */}
            <div className="card card-yellow">
              <h3 className="heading-3 mb-3 md:mb-4 text-lg md:text-xl text-black">Testing Instructions</h3>
              <div className="space-y-3 md:space-y-4 text-black">
                <div className="text-sm md:text-base">
                  <strong>Step 1:</strong> Go to the Admin Dashboard to create and manage campaigns
                </div>
                <div className="text-sm md:text-base">
                  <strong>Step 2:</strong> Use the Campaign Participation page to test user interactions
                </div>
                <div className="text-sm md:text-base">
                  <strong>Step 3:</strong> Try different wallet addresses to see eligibility and winner status
                </div>
              </div>
            </div>

            {/* Demo Addresses */}
            <div className="card">
              <h3 className="heading-3 mb-3 md:mb-4 text-lg md:text-xl">Demo Addresses</h3>
              <div className="space-y-2 md:space-y-3">
                <div className="text-sm md:text-base mb-3">
                  Use these addresses to test different scenarios:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div className="p-3 border-2 border-green-500 bg-green-50">
                    <div className="text-sm font-bold text-green-800">Winners:</div>
                    <div className="text-xs font-mono text-green-600 mt-1">
                      0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6 (1000 USDC)
                    </div>
                    <div className="text-xs font-mono text-green-600">
                      0x1234567890123456789012345678901234567890 (500 USDC)
                    </div>
                    <div className="text-xs font-mono text-green-600">
                      0xabcdefabcdefabcdefabcdefabcdefabcdefabcd (250 USDC)
                    </div>
                  </div>
                  <div className="p-3 border-2 border-blue-500 bg-blue-50">
                    <div className="text-sm font-bold text-blue-800">Eligible (Not Winners):</div>
                    <div className="text-xs font-mono text-blue-600 mt-1">
                      0x6666666666666666666666666666666666666666
                    </div>
                    <div className="text-xs font-mono text-blue-600">
                      0x7777777777777777777777777777777777777777
                    </div>
                    <div className="text-xs font-mono text-blue-600">
                      0x8888888888888888888888888888888888888888
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Demo Dashboard */}
            <div>
              <h3 className="heading-3 mb-3 md:mb-4 text-lg md:text-xl text-center">Live Demo Dashboard</h3>
              <DemoDashboard />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 md:mt-16 pt-8 border-t-4 border-black">
          <p className="body-text text-base md:text-lg mb-4">
            This is a demonstration of the VRF Campaign System. All data is mock data for testing purposes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <Link href="/admin" className="btn btn-primary">
              Admin Dashboard
            </Link>
            <Link href="/campaign" className="btn btn-pink">
              Campaign Participation
            </Link>
            <Link href="/" className="btn">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
