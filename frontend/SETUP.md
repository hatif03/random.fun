# DCipher Swap Frontend Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env.local` file in the frontend directory with the following variables:

   ```env
   # WalletConnect Configuration (REQUIRED)
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id_here
   
   # Contract Addresses (Update these with your deployed addresses)
   NEXT_PUBLIC_DCIPHER_SWAP_ADDRESS=0x0000000000000000000000000000000000000000
   NEXT_PUBLIC_BATCHER_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
   NEXT_PUBLIC_EXECUTOR_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
   NEXT_PUBLIC_CONFIG_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
   
   # API Endpoints
   NEXT_PUBLIC_KEYPER_API_URL=https://api.keyper.example.com
   NEXT_PUBLIC_PRICE_API_URL=https://api.prices.example.com
   NEXT_PUBLIC_GAS_API_URL=https://api.gas.example.com
   ```

3. **Get WalletConnect Project ID**
   - Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Sign up/Login and create a new project
   - Copy the Project ID and paste it in your `.env.local` file

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

## Resolving Common Issues

### WalletConnect Project ID Error
If you see this error:
```
Error: No projectId found. Every dApp must now provide a WalletConnect Cloud projectId to enable WalletConnect v2
```

**Solution**: Make sure you have:
1. Created a `.env.local` file in the frontend directory
2. Added your WalletConnect Project ID to `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`
3. Restarted your development server

### Contract Addresses
Update the contract addresses in `.env.local` with your deployed smart contract addresses on Base Sepolia testnet.

## Features

- **Sleek, Minimalist UI**: Modern design with smooth animations and transitions
- **MEV Protection**: Encrypted transaction ordering prevents front-running
- **Wallet Integration**: Seamless connection with MetaMask, WalletConnect, and other wallets
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Real-time Updates**: Live transaction status and monitoring

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Web3**: Wagmi, RainbowKit, Ethers.js
- **Wallet Connection**: WalletConnect v2, MetaMask
- **Blockchain**: Base Sepolia testnet

## Project Structure

```
frontend/
├── app/                    # Next.js app router pages
│   ├── swap/             # Main swap interface
│   ├── blocklock/        # Text encryption demo
│   └── page.tsx          # Homepage
├── components/            # Reusable UI components
│   ├── SwapCard.tsx      # Main swap interface
│   ├── TokenSelector.tsx # Token selection dropdown
│   ├── SettingsModal.tsx # Swap settings modal
│   └── TransactionStatus.tsx # Transaction monitoring
├── hooks/                 # Custom React hooks
│   └── useSwap.ts        # Swap logic and state management
├── lib/                   # Utility libraries
│   ├── config.ts         # Configuration constants
│   ├── encryption.ts     # Encryption utilities
│   └── blockchain.ts     # Blockchain interaction utilities
└── public/                # Static assets
    └── assets/logos/      # Token logos
```

## Customization

### Colors and Theme
The design system uses a slate color palette. You can customize colors by modifying the Tailwind classes in the components.

### Typography
The interface uses a combination of font weights:
- `font-light` for headings
- `font-medium` for buttons and labels
- `font-normal` for body text

### Spacing and Layout
- Consistent spacing using Tailwind's spacing scale
- Responsive grid layouts for different screen sizes
- Smooth transitions and hover effects

## Deployment

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push to main branch

3. **Environment Variables in Production**
   Make sure to add all required environment variables in your production deployment platform.

## Support

For issues and questions:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure your wallet is connected to Base Sepolia testnet
4. Check that contract addresses are correct and contracts are deployed

## License

This project is licensed under the MIT License.
