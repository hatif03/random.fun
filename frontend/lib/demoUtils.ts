import { mockCampaign } from './mockData';

// Demo configuration
export const DEMO_CONFIG = {
  title: 'VRF Campaign System Demo',
  description: 'Interactive demonstration of the VRF Campaign System',
  duration: '5 minutes',
  features: ['Campaign Setup', 'VRF Selection', 'Reward Distribution', 'User Claims']
};

// Demo addresses for testing
export const DEMO_ADDRESSES = {
  winners: [
    { address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', reward: '1000 USDC', description: '1st Place Winner' },
    { address: '0x1234567890123456789012345678901234567890', reward: '500 USDC', description: '2nd Place Winner' },
    { address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', reward: '250 USDC', description: '3rd Place Winner' },
    { address: '0x9876543210987654321098765432109876543210', reward: '100 USDC', description: '4th Place Winner' },
    { address: '0x5555555555555555555555555555555555555555', reward: '50 USDC', description: '5th Place Winner' }
  ],
  eligible: [
    { address: '0x6666666666666666666666666666666666666666', description: 'Eligible, not selected' },
    { address: '0x7777777777777777777777777777777777777777', description: 'Eligible, not selected' },
    { address: '0x8888888888888888888888888888888888888888', description: 'Eligible, not selected' },
    { address: '0x9999999999999999999999999999999999999999', description: 'Eligible, not selected' },
    { address: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', description: 'Eligible, not selected' }
  ]
};

// Demo workflow steps
export const DEMO_WORKFLOW = [
  {
    step: 1,
    title: 'Campaign Setup',
    description: 'Create campaign with whitelist and parameters',
    actions: ['Define whitelist', 'Set winners', 'Configure goals', 'Deploy contract'],
    status: 'completed',
    icon: '🚀'
  },
  {
    step: 2,
    title: 'VRF Selection',
    description: 'Use Randamu VRF to select winners',
    actions: ['Request randomness', 'Generate numbers', 'Select winners', 'Update state'],
    status: 'completed',
    icon: '🎲'
  },
  {
    step: 3,
    title: 'Goal Monitoring',
    description: 'Track progress toward campaign goals',
    actions: ['Monitor TVL', 'Check progress', 'Update status', 'Enable claiming'],
    status: 'in-progress',
    icon: '📊'
  },
  {
    step: 4,
    title: 'Reward Distribution',
    description: 'Winners claim their rewards',
    actions: ['Verify eligibility', 'Process claims', 'Transfer tokens', 'Record transactions'],
    status: 'pending',
    icon: '💰'
  }
];

// Get demo statistics
export const getDemoStats = () => {
  return {
    totalParticipants: mockCampaign.whitelist.length,
    winners: mockCampaign.winners,
    totalRewards: mockCampaign.rewards.reduce((sum, reward) => sum + parseInt(reward.amount), 0),
    progress: mockCampaign.progress,
    status: mockCampaign.status,
    createdAt: mockCampaign.createdAt,
    deployedAt: mockCampaign.deployedAt,
    selectionStartedAt: mockCampaign.selectionStartedAt
  };
};

// Get demo transaction summary
export const getTransactionSummary = () => {
  const transactions = [
    { type: 'deploy', count: 1, status: 'success' },
    { type: 'selection', count: 1, status: 'success' },
    { type: 'deposit', count: 0, status: 'pending' },
    { type: 'claim', count: 0, status: 'pending' }
  ];
  
  return transactions;
};

// Format demo data for display
export const formatDemoData = {
  address: (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`,
  date: (date: Date) => new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date),
  currency: (amount: string) => `$${parseInt(amount).toLocaleString()}`,
  percentage: (value: number) => `${value}%`
};

// Demo tips and help
export const DEMO_TIPS = [
  'Try different wallet addresses to see eligibility and winner status',
  'Use the Admin Dashboard to simulate campaign management',
  'Watch the TVL progress bar update in real-time',
  'Check transaction history for detailed operation logs',
  'Explore the winner selection process and VRF integration'
];

// Demo scenarios
export const DEMO_SCENARIOS = [
  {
    title: 'Winner Experience',
    description: 'Test the complete winner journey from eligibility to claiming',
    addresses: DEMO_ADDRESSES.winners.slice(0, 2),
    steps: ['Check eligibility', 'Verify winner status', 'Claim rewards']
  },
  {
    title: 'Eligible Non-Winner',
    description: 'See what happens for eligible participants who weren\'t selected',
    addresses: DEMO_ADDRESSES.eligible.slice(0, 2),
    steps: ['Check eligibility', 'Verify non-winner status', 'Wait for next campaign']
  },
  {
    title: 'Campaign Management',
    description: 'Experience the admin side of campaign creation and management',
    actions: ['Deploy campaign', 'Start VRF selection', 'Monitor progress', 'Manage rewards']
  }
];
