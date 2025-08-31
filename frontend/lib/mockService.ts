import { 
  mockCampaign, 
  mockUsers, 
  mockTransactions, 
  mockWinnerSelection,
  findUserByAddress,
  updateCampaignStatus,
  simulateTVLProgress,
  type Campaign,
  type User,
  type MockTransaction
} from './mockData';

// Simulate blockchain transaction delays
const simulateTransaction = async (delay: number = 2000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Generate mock transaction hash
const generateMockHash = (): string => {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};

// Mock campaign deployment
export const deployCampaign = async (campaignData: Partial<Campaign>): Promise<{ success: boolean; hash: string; campaign: Campaign }> => {
  await simulateTransaction(3000);
  
  // Update campaign with deployment data
  Object.assign(mockCampaign, {
    ...campaignData,
    deployedAt: new Date(),
    status: 'selection' as const
  });
  
  const hash = generateMockHash();
  
  // Add deployment transaction
  mockTransactions.unshift({
    id: `tx-${Date.now()}`,
    type: 'deploy',
    status: 'success',
    hash,
    timestamp: new Date(),
    description: 'Campaign contract deployed successfully'
  });
  
  return {
    success: true,
    hash,
    campaign: mockCampaign
  };
};

// Mock VRF selection process
export const startVRFSelection = async (): Promise<{ success: boolean; requestId: string; hash: string }> => {
  await simulateTransaction(4000);
  
  // Update campaign status
  updateCampaignStatus('awaiting');
  mockCampaign.selectionStartedAt = new Date();
  
  const requestId = generateMockHash();
  const hash = generateMockHash();
  
  // Add selection transaction
  mockTransactions.unshift({
    id: `tx-${Date.now()}`,
    type: 'selection',
    status: 'success',
    hash,
    timestamp: new Date(),
    description: 'VRF selection process initiated'
  });
  
  return {
    success: true,
    requestId,
    hash
  };
};

// Mock reward deposit
export const depositRewards = async (amount: string, token: string): Promise<{ success: boolean; hash: string }> => {
  await simulateTransaction(2500);
  
  const hash = generateMockHash();
  
  // Add deposit transaction
  mockTransactions.unshift({
    id: `tx-${Date.now()}`,
    type: 'deposit',
    status: 'success',
    hash,
    timestamp: new Date(),
    description: `Deposited ${amount} ${token} for rewards`
  });
  
  return {
    success: true,
    hash
  };
};

// Mock eligibility check
export const checkEligibility = async (address: string): Promise<User | null> => {
  await simulateTransaction(1500);
  
  const user = findUserByAddress(address);
  if (!user) {
    // Create new user if not found
    const newUser: User = {
      address,
      name: `User ${address.slice(0, 6)}...${address.slice(-4)}`,
      isEligible: mockCampaign.whitelist.includes(address),
      isWinner: false,
      canClaim: false,
      hasClaimed: false,
      joinedAt: new Date()
    };
    mockUsers.push(newUser);
    return newUser;
  }
  
  return user;
};

// Mock winner status check
export const checkWinnerStatus = async (address: string): Promise<User | null> => {
  await simulateTransaction(1500);
  
  const user = findUserByAddress(address);
  if (!user) return null;
  
  // Update winner status based on campaign status
  if (mockCampaign.status === 'awaiting' || mockCampaign.status === 'claiming') {
    user.isWinner = mockWinnerSelection.selectedWinners.includes(address);
    if (user.isWinner) {
      const rewardIndex = mockWinnerSelection.selectedWinners.indexOf(address);
      user.rewardAmount = mockCampaign.rewards[rewardIndex]?.amount;
    }
  }
  
  return user;
};

// Mock reward claiming
export const claimRewards = async (address: string): Promise<{ success: boolean; hash: string; amount: string }> => {
  await simulateTransaction(3000);
  
  const user = findUserByAddress(address);
  if (!user || !user.isWinner) {
    throw new Error('User is not eligible to claim rewards');
  }
  
  const hash = generateMockHash();
  
  // Mark reward as claimed
  user.canClaim = false;
  user.claimedAt = new Date();
  
  // Add claim transaction
  mockTransactions.unshift({
    id: `tx-${Date.now()}`,
    type: 'claim',
    status: 'success',
    hash,
    timestamp: new Date(),
    description: `Claimed ${user.rewardAmount} USDC rewards`
  });
  
  return {
    success: true,
    hash,
    amount: user.rewardAmount || '0'
  };
};

// Simulate TVL progress for demo
export const simulateTVLUpdate = async (): Promise<Campaign> => {
  await simulateTransaction(1000);
  return simulateTVLProgress();
};

// Get campaign data
export const getCampaign = (): Campaign => {
  return { ...mockCampaign };
};

// Get transaction history
export const getTransactionHistory = (): MockTransaction[] => {
  return [...mockTransactions];
};

// Get winner selection data
export const getWinnerSelection = () => {
  return { ...mockWinnerSelection };
};

// Reset demo data (for testing)
export const resetDemo = (): void => {
  // Reset campaign to initial state
  mockCampaign.status = 'setup';
  mockCampaign.currentValue = '7500000';
  mockCampaign.progress = 75;
  mockCampaign.deployedAt = undefined;
  mockCampaign.selectionStartedAt = undefined;
  mockCampaign.completedAt = undefined;
  
  // Reset user statuses
  mockUsers.forEach(user => {
    user.isWinner = false;
    user.canClaim = false;
    user.claimedAt = undefined;
  });
  
  // Clear transactions
  mockTransactions.length = 0;
  
  // Add initial transactions back
  mockTransactions.push(
    {
      id: 'tx-001',
      type: 'deploy',
      status: 'success',
      hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      timestamp: new Date('2024-01-15T10:30:00Z'),
      description: 'Campaign contract deployed successfully'
    },
    {
      id: 'tx-002',
      type: 'selection',
      status: 'success',
      hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      timestamp: new Date('2024-01-15T11:00:00Z'),
      description: 'VRF selection process initiated'
    }
  );
};
