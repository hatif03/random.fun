import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Providers } from "./providers";
import { WalletConnectButton, MobileWalletConnectButton } from "../components/walletConnect";

export const metadata: Metadata = {
  title: "pump.fun - VRF Campaign System",
  description: "Create, manage, and participate in VRF-powered campaigns",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen bg-white">
            <header className="border-b-4 border-black bg-white sticky top-0 z-40">
              <div className="container">
                {/* Desktop Header */}
                <div className="hidden md:flex items-center justify-between py-4 md:py-6">
                  <div className="text-2xl md:text-4xl font-black text-black uppercase tracking-tight">
                    pump.fun
                  </div>
                  <nav className="flex items-center space-x-6 lg:space-x-8">
                    <Link href="/" className="font-bold text-black hover:text-pink-500 transition-colors">
                      Home
                    </Link>
                    <Link href="/admin" className="font-bold text-black hover:text-pink-500 transition-colors">
                      Admin
                    </Link>
                    <Link href="/campaign" className="font-bold text-black hover:text-pink-500 transition-colors">
                      Campaign
                    </Link>
                  </nav>
                  <WalletConnectButton />
                </div>

                {/* Mobile Header */}
                <div className="md:hidden">
                  <div className="flex items-center justify-between py-3">
                    <div className="text-xl font-black text-black uppercase tracking-tight">
                      pump.fun
                    </div>
                    <div className="flex items-center space-x-2">
                      <MobileWalletConnectButton />
                      <button className="p-2 border-2 border-black hover:bg-black hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Mobile Navigation */}
                  <div className="border-t-2 border-black py-3">
                    <nav className="flex flex-col space-y-2">
                      <Link href="/" className="font-bold text-black hover:text-pink-500 transition-colors py-2 px-2">
                        Home
                      </Link>
                      <Link href="/admin" className="font-bold text-black hover:text-pink-500 transition-colors py-2 px-2">
                        Admin
                      </Link>
                      <Link href="/campaign" className="font-bold text-black hover:text-pink-500 transition-colors py-2 px-2">
                        Campaign
                      </Link>
                    </nav>
                  </div>
                </div>
              </div>
            </header>
            <main>
              {children}
            </main>
            <footer className="border-t-4 border-black bg-black text-white py-6 md:py-8">
              <div className="container text-center">
                <p className="font-bold uppercase tracking-wide text-sm md:text-base">
                  pump.fun - VRF Campaign System - Built with Next.js & Solidity
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
