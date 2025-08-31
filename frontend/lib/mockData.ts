export interface Campaign {
  id: string;
  name: string;
  description: string;
  whitelist: string[];
  winners: number;
  targetContract: string;
  targetFunction: string;
  targetValue: string;
  currentValue: string;
  progress: number;
  status: 'setup' | 'selection' | 'awaiting' | 'claiming' | 'completed';
  createdAt: Date;
  deployedAt?: Date;
  selectionStartedAt?: Date;
  completedAt?: Date;
  rewards: Reward[];
}

export interface Reward {
  id: string;
  amount: string;
  token: string;
  claimed: boolean;
  claimedAt?: Date;
}

export interface User {
  address: string;
  isEligible: boolean;
  isWinner: boolean;
  canClaim: boolean;
  claimedAt?: Date;
  rewardAmount?: string;
}

export interface MockTransaction {
  id: string;
  type: 'deploy' | 'selection' | 'deposit' | 'claim';
  status: 'pending' | 'success' | 'failed';
  hash?: string;
  timestamp: Date;
  description: string;
}

// Mock campaign data
export const mockCampaign: Campaign = {
  id: 'campaign-001',
  name: 'TVL Milestone Campaign',
  description: 'Earn rewards when the protocol reaches $10M in Total Value Locked. This campaign uses Randamu VRF to ensure fair and transparent winner selection.',
  whitelist: [
    '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    '0x1234567890123456789012345678901234567890',
    '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    '0x9876543210987654321098765432109876543210',
    '0x5555555555555555555555555555555555555555',
    '0x6666666666666666666666666666666666666666',
    '0x7777777777777777777777777777777777777777',
    '0x8888888888888888888888888888888888888888',
    '0x9999999999999999999999999999999999999999',
    '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    '0xcccccccccccccccccccccccccccccccccccccc',
    '0xdddddddddddddddddddddddddddddddddddddddd',
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    '0xffffffffffffffffffffffffffffffffffffffff'
  ],
  winners: 5,
  targetContract: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  targetFunction: 'balanceOf(address)',
  targetValue: '10000000',
  currentValue: '7500000',
  progress: 75,
  status: 'awaiting',
  createdAt: new Date('2024-01-15T10:00:00Z'),
  deployedAt: new Date('2024-01-15T10:30:00Z'),
  selectionStartedAt: new Date('2024-01-15T11:00:00Z'),
  rewards: [
    { id: 'reward-1', amount: '1000', token: 'USDC', claimed: false },
    { id: 'reward-2', amount: '500', token: 'USDC', claimed: false },
    { id: 'reward-3', amount: '250', token: 'USDC', claimed: false },
    { id: 'reward-4', amount: '100', token: 'USDC', claimed: false },
    { id: 'reward-5', amount: '50', token: 'USDC', claimed: false }
  ]
};

// Mock user data
export const mockUsers: User[] = [
  {
    address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    isEligible: true,
    isWinner: true,
    canClaim: false,
    rewardAmount: '1000'
  },
  {
    address: '0x1234567890123456789012345678901234567890',
    isEligible: true,
    isWinner: true,
    canClaim: false,
    rewardAmount: '500'
  },
  {
    address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    isEligible: true,
    isWinner: true,
    canClaim: false,
    rewardAmount: '250'
  },
  {
    address: '0x9876543210987654321098765432109876543210',
    isEligible: true,
    isWinner: true,
    canClaim: false,
    rewardAmount: '100'
  },
  {
    address: '0x5555555555555555555555555555555555555555',
    isEligible: true,
    isWinner: true,
    canClaim: false,
    rewardAmount: '50'
  },
  {
    address: '0x6666666666666666666666666666666666666666',
    isEligible: true,
    isWinner: false,
    canClaim: false
  },
  {
    address: '0x7777777777777777777777777777777777777777',
    isEligible: true,
    isWinner: false,
    canClaim: false
  }
];

// Mock transaction history
export const mockTransactions: MockTransaction[] = [
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
  },
  {
    id: 'tx-003',
    type: 'deposit',
    status: 'pending',
    timestamp: new Date('2024-01-15T12:00:00Z'),
    description: 'Reward deposit transaction pending'
  }
];

// Mock TVL progression data for charts
export const mockTVLData = [
  { date: '2024-01-01', value: 5000000 },
  { date: '2024-01-05', value: 6000000 },
  { date: '2024-01-10', value: 7000000 },
  { date: '2024-01-15', value: 7500000 },
  { date: '2024-01-20', value: 8000000 },
  { date: '2024-01-25', value: 8500000 },
  { date: '2024-01-30', value: 9000000 },
  { date: '2024-02-05', value: 9500000 },
  { date: '2024-02-10', value: 10000000 }
];

// Mock winner selection data
export const mockWinnerSelection = {
  requestId: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  randomWords: [12345, 67890, 11111, 22222, 33333],
  selectedWinners: [
    '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    '0x1234567890123456789012345678901234567890',
    '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    '0x9876543210987654321098765432109876543210',
    '0x5555555555555555555555555555555555555555'
  ],
  selectionTimestamp: new Date('2024-01-15T11:15:00Z'),
  vrfProvider: 'Randamu VRF'
};

// Helper functions
export const findUserByAddress = (address: string): User | undefined => {
  return mockUsers.find(user => user.address.toLowerCase() === address.toLowerCase());
};

export const updateCampaignStatus = (status: Campaign['status']) => {
  mockCampaign.status = status;
  return mockCampaign;
};

export const simulateTVLProgress = () => {
  const currentValue = parseInt(mockCampaign.currentValue);
  const targetValue = parseInt(mockCampaign.targetValue);
  const increment = Math.floor(Math.random() * 500000) + 100000;
  const newValue = Math.min(currentValue + increment, targetValue);
  
  mockCampaign.currentValue = newValue.toString();
  mockCampaign.progress = Math.round((newValue / targetValue) * 100);
  
  if (newValue >= targetValue) {
    mockCampaign.status = 'claiming';
    mockCampaign.completedAt = new Date();
  }
  
  return mockCampaign;
};
