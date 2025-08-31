'use client';

import { useState } from 'react';

export default function AdminDashboard() {
  const [campaignData, setCampaignData] = useState({
    whitelist: '',
    winners: 10,
    targetContract: '',
    targetFunction: 'balanceOf(address)',
    targetValue: '10000000',
    status: 'setup'
  });

  const [isDeploying, setIsDeploying] = useState(false);
  const [isStartingSelection, setIsStartingSelection] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setCampaignData(prev => ({ ...prev, [field]: value }));
  };

  const handleDeployCampaign = async () => {
    setIsDeploying(true);
    // TODO: Implement smart contract deployment
    setTimeout(() => {
      setCampaignData(prev => ({ ...prev, status: 'selection' }));
      setIsDeploying(false);
    }, 2000);
  };

  const handleStartSelection = async () => {
    setIsStartingSelection(true);
    // TODO: Implement VRF selection
    setTimeout(() => {
      setCampaignData(prev => ({ ...prev, status: 'awaiting' }));
      setIsStartingSelection(false);
    }, 2000);
  };

  const handleDepositRewards = async () => {
    setIsDepositing(true);
    // TODO: Implement reward deposit
    setTimeout(() => {
      setIsDepositing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container">
        <div className="mb-8 md:mb-12">
          <h1 className="heading-1 mb-3 md:mb-4 text-3xl md:text-5xl lg:text-6xl">Admin Dashboard</h1>
          <p className="body-text text-base md:text-lg">Create and manage your VRF-powered campaign</p>
        </div>

        <div className="grid-2 gap-6 md:gap-8 lg:gap-12">
          {/* Campaign Setup View */}
          <div className="space-y-6 md:space-y-8">
            <div className="card">
              <h2 className="heading-2 mb-4 md:mb-6 text-xl md:text-2xl lg:text-3xl">Campaign Setup</h2>
              
              <div className="space-y-4 md:space-y-6">
                <div>
                  <label className="block caption mb-2 text-xs md:text-sm">Whitelist Addresses</label>
                  <textarea
                    className="input text-sm md:text-base"
                    rows={4}
                    placeholder="Enter wallet addresses, one per line:&#10;0x1234...&#10;0x5678...&#10;0x9abc..."
                    value={campaignData.whitelist}
                    onChange={(e) => handleInputChange('whitelist', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block caption mb-2 text-xs md:text-sm">Number of Winners</label>
                  <input
                    type="number"
                    className="input text-sm md:text-base"
                    min="1"
                    max="100"
                    value={campaignData.winners}
                    onChange={(e) => handleInputChange('winners', parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <label className="block caption mb-2 text-xs md:text-sm">Target Contract Address</label>
                  <input
                    type="text"
                    className="input text-sm md:text-base"
                    placeholder="0x..."
                    value={campaignData.targetContract}
                    onChange={(e) => handleInputChange('targetContract', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block caption mb-2 text-xs md:text-sm">Target Function</label>
                  <input
                    type="text"
                    className="input text-sm md:text-base"
                    placeholder="balanceOf(address)"
                    value={campaignData.targetFunction}
                    onChange={(e) => handleInputChange('targetFunction', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block caption mb-2 text-xs md:text-sm">Target Value</label>
                  <input
                    type="text"
                    className="input text-sm md:text-base"
                    placeholder="10000000"
                    value={campaignData.targetValue}
                    onChange={(e) => handleInputChange('targetValue', e.target.value)}
                  />
                </div>

                <button
                  className="btn btn-primary w-full text-sm md:text-base"
                  onClick={handleDeployCampaign}
                  disabled={isDeploying}
                >
                  {isDeploying ? 'Deploying...' : 'Deploy Campaign'}
                </button>
              </div>
            </div>
          </div>

          {/* Campaign Management View */}
          <div className="space-y-6 md:space-y-8">
            <div className="card">
              <h2 className="heading-2 mb-4 md:mb-6 text-xl md:text-2xl lg:text-3xl">Campaign Management</h2>
              
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center justify-between">
                  <span className="caption text-xs md:text-sm">Status:</span>
                  <span className={`status-badge status-${campaignData.status} text-xs md:text-sm`}>
                    {campaignData.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <button
                    className="btn btn-pink w-full text-sm md:text-base"
                    onClick={handleStartSelection}
                    disabled={campaignData.status !== 'selection' || isStartingSelection}
                  >
                    {isStartingSelection ? 'Starting Selection...' : 'Start Selection Process'}
                  </button>

                  <button
                    className="btn btn-yellow w-full text-sm md:text-base"
                    onClick={handleDepositRewards}
                    disabled={isDepositing}
                  >
                    {isDepositing ? 'Depositing...' : 'Deposit Rewards'}
                  </button>
                </div>

                <div className="border-t-4 border-black pt-4 md:pt-6">
                  <h3 className="heading-3 mb-3 md:mb-4 text-lg md:text-xl">Campaign Progress</h3>
                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="caption text-xs md:text-sm">Current TVL</span>
                        <span className="font-bold text-sm md:text-base">$7,500,000</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: '75%' }}
                        ></div>
                      </div>
                      <div className="text-right mt-1">
                        <span className="caption text-xs md:text-sm">Target: $10,000,000</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <div className="text-center p-3 md:p-4 border-2 border-black bg-white">
                        <div className="text-xl md:text-2xl font-black">150</div>
                        <div className="caption text-xs md:text-sm">Whitelist Size</div>
                      </div>
                      <div className="text-center p-3 md:p-4 border-2 border-black bg-white">
                        <div className="text-xl md:text-2xl font-black">10</div>
                        <div className="caption text-xs md:text-sm">Winners</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="heading-3 mb-3 md:mb-4 text-lg md:text-xl">Quick Actions</h3>
              <div className="space-y-2 md:space-y-3">
                <button className="btn w-full text-sm md:text-base">View Contract</button>
                <button className="btn w-full text-sm md:text-base">Export Results</button>
                <button className="btn w-full text-sm md:text-base">Emergency Pause</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
