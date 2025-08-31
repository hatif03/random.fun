'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

export function WalletConnect({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}

export function WalletConnectButton() {
  return (
    <div className="block">
      <ConnectButton />
    </div>
  );
}

export function MobileWalletConnectButton() {
  return (
    <div className="block md:hidden">
      <ConnectButton />
    </div>
  );
}