# pump.fun Frontend

A modern, brutalist-design frontend for managing VRF-powered campaigns built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🎯 Admin Dashboard
- **Campaign Setup**: Create campaigns with whitelist, winner count, and on-chain goals
- **Campaign Management**: Monitor status, trigger VRF selection, and manage rewards
- **Real-time Progress**: Track campaign progress with visual indicators
- **Quick Actions**: Emergency controls and campaign utilities

### 👥 Public User Interface
- **Wallet Integration**: Seamless wallet connection with RainbowKit
- **Eligibility Checking**: Verify whitelist status and participation requirements
- **Winner Verification**: Check if selected as a winner after VRF selection
- **Reward Claiming**: Claim rewards once on-chain goals are achieved

### 🎨 Design System
- **Brutalist Aesthetic**: Bold, high-contrast design inspired by modern web aesthetics
- **Responsive Layout**: Mobile-first design that works on all devices
- **Custom Components**: Tailored UI components with consistent styling
- **Color Palette**: Vibrant pink, yellow, and black against white backgrounds

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom CSS variables
- **Wallet**: RainbowKit + Wagmi for Web3 integration
- **State Management**: React hooks and context
- **Blockchain**: Base Sepolia testnet support

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm or npm
- Wallet with Base Sepolia testnet ETH

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Add your WalletConnect project ID:
```bash
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   ├── campaign/          # Public campaign pages
│   ├── globals.css        # Global styles and design system
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Home page
│   ├── providers.tsx      # Web3 and React providers
│   └── config.ts          # Wagmi configuration
├── components/            # Reusable UI components
│   └── walletConnect.tsx  # Wallet connection component
└── public/               # Static assets
```

## Design Principles

### Brutalist Aesthetics
- **Bold Typography**: Heavy, uppercase headings with strong visual hierarchy
- **High Contrast**: Black borders and text on white/pink/yellow backgrounds
- **Geometric Shapes**: Sharp edges, thick borders, and structured layouts
- **Visual Impact**: Large buttons, prominent call-to-actions, and clear information hierarchy

### Color System
- **Primary Pink**: #FF6B9D - Used for main actions and highlights
- **Primary Yellow**: #FFD93D - Used for secondary actions and accents
- **Primary Black**: #000000 - Used for text, borders, and primary buttons
- **Primary White**: #FFFFFF - Used for backgrounds and contrast

### Component Patterns
- **Cards**: 3px black borders with 6px drop shadows
- **Buttons**: Bold, uppercase text with hover animations and state changes
- **Inputs**: Thick borders with focus states using pink shadows
- **Status Badges**: Color-coded indicators for different campaign states

## Usage

### For Admins
1. Navigate to `/admin` to access the dashboard
2. Set up campaign parameters (whitelist, winners, goals)
3. Deploy the campaign smart contract
4. Monitor progress and manage the campaign lifecycle

### For Users
1. Navigate to `/campaign` to view campaign details
2. Connect your wallet using the top-right button
3. Check your eligibility status
4. Verify winner selection after VRF completion
5. Claim rewards when available

## Development

### Adding New Components
1. Create components in the `components/` directory
2. Use the established design system classes
3. Follow the brutalist aesthetic principles
4. Ensure responsive design for mobile devices

### Styling Guidelines
- Use CSS custom properties for colors
- Maintain consistent spacing with Tailwind classes
- Follow the established component patterns
- Test hover and focus states

### State Management
- Use React hooks for local state
- Implement proper loading states for async operations
- Handle errors gracefully with user feedback
- Maintain consistent data flow patterns

## Deployment

### Build for Production
```bash
pnpm build
```

### Start Production Server
```bash
pnpm start
```

### Environment Variables
Ensure all required environment variables are set in your production environment:
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`
- Any additional blockchain configuration

## Contributing

1. Follow the established design system
2. Maintain the brutalist aesthetic
3. Ensure responsive design
4. Add proper TypeScript types
5. Test on multiple devices and screen sizes

## License

This project is licensed under the MIT License.
