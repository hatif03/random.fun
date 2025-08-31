'use client';

import { useState } from 'react';

export default function CampaignPage() {
  const [userAddress, setUserAddress] = useState('');
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [isCheckingWinner, setIsCheckingWinner] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [userStatus, setUserStatus] = useState({
    isEligible: false,
    isWinner: false,
    canClaim: false
  });

  const campaignInfo = {
    name: "TVL Milestone Campaign",
    description: "Earn rewards when the protocol reaches $10M in Total Value Locked",
    whitelistSize: 150,
    winners: 10,
    targetValue: "$10,000,000",
    currentValue: "$7,500,000",
    progress: 75,
    status: "awaiting"
  };

  const handleCheckEligibility = async () => {
    if (!userAddress) return;
    setIsCheckingEligibility(true);
    // TODO: Implement eligibility check
    setTimeout(() => {
      setUserStatus(prev => ({ ...prev, isEligible: true }));
      setIsCheckingEligibility(false);
    }, 1500);
  };

  const handleCheckWinner = async () => {
    if (!userAddress) return;
    setIsCheckingWinner(true);
    // TODO: Implement winner check
    setTimeout(() => {
      setUserStatus(prev => ({ ...prev, isWinner: true }));
      setIsCheckingWinner(false);
    }, 1500);
  };

  const handleClaim = async () => {
    if (!userAddress) return;
    setIsClaiming(true);
    // TODO: Implement reward claiming
    setTimeout(() => {
      setIsClaiming(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container">
        <div className="mb-8 md:mb-12">
          <h1 className="heading-1 mb-3 md:mb-4 text-3xl md:text-5xl lg:text-6xl">Campaign Participation</h1>
          <p className="body-text text-base md:text-lg">Join the community and track your progress</p>
        </div>

        <div className="grid-2 gap-6 md:gap-8 lg:gap-12">
          {/* Campaign Information */}
          <div className="space-y-6 md:space-y-8">
            <div className="card card-pink">
              <h2 className="heading-2 mb-4 md:mb-6 text-xl md:text-2xl lg:text-3xl text-black">Campaign Details</h2>
              
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h3 className="heading-3 mb-2 md:mb-3 text-lg md:text-xl text-black">{campaignInfo.name}</h3>
                  <p className="body-text text-black text-sm md:text-base">{campaignInfo.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="text-center p-3 md:p-4 border-2 border-black bg-white">
                    <div className="text-xl md:text-2xl font-black">{campaignInfo.whitelistSize}</div>
                    <div className="caption text-xs md:text-sm">Whitelist Size</div>
                  </div>
                  <div className="text-center p-3 md:p-4 border-2 border-black bg-white">
                    <div className="text-xl md:text-2xl font-black">{campaignInfo.winners}</div>
                    <div className="caption text-xs md:text-sm">Winners</div>
                  </div>
                </div>

                <div className="border-t-2 border-black pt-3 md:pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="caption text-black text-xs md:text-sm">Goal Progress</span>
                    <span className="font-bold text-black text-sm md:text-base">{campaignInfo.currentValue} / {campaignInfo.targetValue}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${campaignInfo.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="caption text-black text-xs md:text-sm">Status:</span>
                  <span className={`status-badge status-${campaignInfo.status} text-xs md:text-sm`}>
                    {campaignInfo.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Eligibility Requirements */}
            <div className="card">
              <h3 className="heading-3 mb-3 md:mb-4 text-lg md:text-xl">Eligibility Requirements</h3>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 border-2 border-black rounded-full flex-shrink-0"></div>
                  <span className="text-sm md:text-base">Wallet must be on the initial whitelist</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 border-2 border-black rounded-full flex-shrink-0"></div>
                  <span className="text-sm md:text-base">Must have interacted with the protocol</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-yellow-500 border-2 border-black rounded-full flex-shrink-0"></div>
                  <span className="text-sm md:text-base">On-chain goal must be achieved</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Actions */}
          <div className="space-y-6 md:space-y-8">
            <div className="card">
              <h2 className="heading-2 mb-4 md:mb-6 text-xl md:text-2xl lg:text-3xl">Your Participation</h2>
              
              <div className="space-y-4 md:space-y-6">
                <div>
                  <label className="block caption mb-2 text-xs md:text-sm">Your Wallet Address</label>
                  <input
                    type="text"
                    className="input text-sm md:text-base"
                    placeholder="0x..."
                    value={userAddress}
                    onChange={(e) => setUserAddress(e.target.value)}
                  />
                </div>

                <div className="space-y-3 md:space-y-4">
                  <button
                    className="btn btn-yellow w-full text-sm md:text-base"
                    onClick={handleCheckEligibility}
                    disabled={!userAddress || isCheckingEligibility}
                  >
                    {isCheckingEligibility ? 'Checking...' : 'Check Eligibility'}
                  </button>

                  {userStatus.isEligible && (
                    <button
                      className="btn btn-pink w-full text-sm md:text-base"
                      onClick={handleCheckWinner}
                      disabled={isCheckingWinner}
                    >
                      {isCheckingWinner ? 'Checking...' : 'Check Winner Status'}
                    </button>
                  )}

                  {userStatus.isWinner && campaignInfo.status === 'claiming' && (
                    <button
                      className="btn btn-primary w-full text-sm md:text-base"
                      onClick={handleClaim}
                      disabled={isClaiming}
                    >
                      {isClaiming ? 'Claiming...' : 'Claim Rewards'}
                    </button>
                  )}
                </div>

                {/* User Status Display */}
                <div className="border-t-4 border-black pt-4 md:pt-6">
                  <h3 className="heading-3 mb-3 md:mb-4 text-lg md:text-xl">Your Status</h3>
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="caption text-xs md:text-sm">Eligibility:</span>
                      <span className={`status-badge ${userStatus.isEligible ? 'bg-green-500 text-white' : 'bg-gray-300'} text-xs md:text-sm`}>
                        {userStatus.isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="caption text-xs md:text-sm">Winner Status:</span>
                      <span className={`status-badge ${userStatus.isWinner ? 'bg-yellow-500 text-black' : 'bg-gray-300'} text-xs md:text-sm`}>
                        {userStatus.isWinner ? 'WINNER' : 'NOT SELECTED'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="caption text-xs md:text-sm">Can Claim:</span>
                      <span className={`status-badge ${userStatus.canClaim ? 'bg-black text-white' : 'bg-gray-300'} text-xs md:text-sm`}>
                        {userStatus.canClaim ? 'READY' : 'NOT READY'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="card">
              <h3 className="heading-3 mb-3 md:mb-4 text-lg md:text-xl">How It Works</h3>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-black text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold mt-1 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <div className="font-bold text-sm md:text-base">Check Eligibility</div>
                    <div className="text-xs md:text-sm">Verify if your wallet is on the whitelist</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-black text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold mt-1 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <div className="font-bold text-sm md:text-base">Wait for Selection</div>
                    <div className="text-xs md:text-sm">VRF randomly selects winners from eligible addresses</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-black text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold mt-1 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <div className="font-bold text-sm md:text-base">Claim Rewards</div>
                    <div className="text-xs md:text-sm">Winners can claim once the goal is achieved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
