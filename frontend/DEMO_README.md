# VRF Campaign System - Frontend Demo

This is a comprehensive demo of the VRF-powered campaign system built with Next.js, TypeScript, and Tailwind CSS. The demo showcases the entire workflow from campaign creation to winner selection and reward distribution.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation
```bash
cd frontend
npm install
# or
yarn install
# or
pnpm install
```

### Running the Demo
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Demo Features

### 1. **Home Page** (`/`)
- Overview of the VRF Campaign System
- Links to all demo sections
- Feature explanations and benefits

### 2. **Admin Dashboard** (`/admin`)
- **Campaign Setup**: Create campaigns with whitelist, winners, and goals
- **Campaign Management**: Deploy contracts, start VRF selection, manage rewards
- **Live Demo Dashboard**: Real-time campaign monitoring and transaction history
- **Interactive Features**: 
  - Deploy campaigns with custom parameters
  - Initiate VRF selection processes
  - Deposit rewards
  - Monitor TVL progress

### 3. **Campaign Participation** (`/campaign`)
- **User Experience**: Check eligibility, verify winner status, claim rewards
- **Demo Addresses**: Pre-configured addresses for testing different scenarios
- **Interactive Testing**: 
  - Try different wallet addresses
  - See eligibility and winner status changes
  - Experience the complete user journey

### 4. **Live Demo** (`/demo`)
- **Comprehensive Overview**: Complete system demonstration
- **Workflow Explanation**: Step-by-step process breakdown
- **Testing Instructions**: Clear guidance for exploring the system
- **Live Dashboard**: Real-time data updates and monitoring

## 🧪 Testing the Demo

### Demo Addresses

#### Winners (Can claim rewards)
```
0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6 → 1000 USDC (1st Place)
0x1234567890123456789012345678901234567890 → 500 USDC (2nd Place)
0xabcdefabcdefabcdefabcdefabcdefabcdefabcd → 250 USDC (3rd Place)
0x9876543210987654321098765432109876543210 → 100 USDC (4th Place)
0x5555555555555555555555555555555555555555 → 50 USDC (5th Place)
```

#### Eligible Non-Winners
```
0x6666666666666666666666666666666666666666 → Eligible, not selected
0x7777777777777777777777777777777777777777 → Eligible, not selected
0x8888888888888888888888888888888888888888 → Eligible, not selected
```

### Testing Scenarios

#### 1. **Admin Experience**
1. Go to `/admin`
2. Fill in campaign details (whitelist addresses, winners, goals)
3. Deploy the campaign
4. Start VRF selection process
5. Monitor progress and manage rewards

#### 2. **Winner Experience**
1. Go to `/campaign`
2. Use a winner address (e.g., `0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6`)
3. Check eligibility → Should show "ELIGIBLE"
4. Check winner status → Should show "WINNER"
5. Claim rewards (when campaign status is "claiming")

#### 3. **Eligible Non-Winner Experience**
1. Go to `/campaign`
2. Use an eligible non-winner address (e.g., `0x6666666666666666666666666666666666666666`)
3. Check eligibility → Should show "ELIGIBLE"
4. Check winner status → Should show "NOT SELECTED"

#### 4. **Campaign Monitoring**
1. Go to `/demo`
2. Switch to "Testing" tab
3. Watch the live dashboard
4. Use "Simulate Progress" button to see TVL updates

## 🔧 Demo Architecture

### Mock Data System
- **`/lib/mockData.ts`**: Data structures and mock campaign information
- **`/lib/mockService.ts`**: Simulated blockchain interactions and API calls
- **`/lib/demoUtils.ts`**: Demo utilities and configuration

### Components
- **`DemoDashboard.tsx`**: Live campaign monitoring and transaction history
- **Enhanced Admin Page**: Interactive campaign management
- **Enhanced Campaign Page**: User participation simulation

### Key Features
- **Real-time Updates**: Auto-updating TVL progress and status
- **Transaction Simulation**: Mock blockchain transactions with realistic delays
- **Interactive Workflows**: Complete end-to-end campaign lifecycle
- **Responsive Design**: Mobile-friendly brutalist UI design

## 🎨 UI Design

The demo uses a **brutalist design system** with:
- Bold, high-contrast colors
- Thick borders and shadows
- Typography-focused layouts
- Responsive grid systems
- Interactive hover and focus states

### Color Scheme
- **Primary Pink**: #FF6B9D
- **Primary Yellow**: #FFD93D
- **Primary Black**: #000000
- **Primary White**: #FFFFFF
- **Accent Blue**: #0066FF

## 📱 Responsive Features

- Mobile-first design approach
- Adaptive layouts for different screen sizes
- Touch-friendly interactive elements
- Optimized typography scaling

## 🔄 Demo Workflow

### 1. Campaign Creation
- Admin sets up campaign parameters
- Deploys smart contract
- Campaign status: `setup` → `selection`

### 2. VRF Selection
- Admin initiates winner selection
- Randamu VRF generates random numbers
- Winners are selected from whitelist
- Campaign status: `selection` → `awaiting`

### 3. Goal Monitoring
- System tracks progress toward goals
- TVL updates in real-time
- Progress bars and status indicators

### 4. Reward Distribution
- Winners can claim rewards
- Transaction history is maintained
- Campaign status: `awaiting` → `claiming`

## 🚨 Important Notes

- **This is a demo**: All data is mock data for testing purposes
- **No real blockchain**: Transactions are simulated with realistic delays
- **Educational purpose**: Designed to showcase the system's capabilities
- **Interactive learning**: Hands-on experience with VRF campaigns

## 🛠️ Development

### File Structure
```
frontend/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── campaign/          # Campaign participation
│   ├── demo/              # Live demo page
│   └── page.tsx           # Home page
├── components/             # React components
│   └── DemoDashboard.tsx  # Live demo dashboard
├── lib/                    # Utility libraries
│   ├── mockData.ts        # Mock data structures
│   ├── mockService.ts     # Mock service functions
│   └── demoUtils.ts       # Demo utilities
└── app/globals.css        # Global styles
```

### Key Technologies
- **Next.js 14**: React framework with app router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Hooks**: State management and side effects

## 🎯 Next Steps

After exploring the demo:
1. **Review the smart contracts** in the `contracts/` directory
2. **Understand the VRF integration** and randomness generation
3. **Explore the deployment scripts** for real blockchain deployment
4. **Customize the system** for your specific use case

## 📞 Support

For questions about the demo or system:
- Review the smart contract documentation
- Check the deployment guides
- Explore the test files for implementation details

---

**Enjoy exploring the VRF Campaign System Demo! 🎉**
