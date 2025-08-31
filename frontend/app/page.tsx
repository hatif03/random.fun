import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="grid-2 items-center gap-8 md:gap-12">
            {/* Left Panel - Pink Background */}
            <div className="card card-pink">
              <h1 className="heading-1 mb-4 md:mb-6 text-3xl md:text-5xl lg:text-6xl">
                Go from zero to winners
              </h1>
              <p className="body-text mb-6 md:mb-8 text-base md:text-lg">
                With our VRF Campaign System, anyone can create fair and transparent campaigns. 
                Just set your goals, define your winners, and let blockchain randomness do the rest. 
                It&apos;s that easy.
              </p>
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Link href="/admin" className="btn btn-primary text-center">
              Create Campaign
            </Link>
            <Link href="/campaign" className="btn text-center">
              View Campaign
            </Link>
                  <Link href="/demo" className="btn btn-yellow text-center">
        Live System
      </Link>
          </div>
            </div>

            {/* Right Panel - Yellow Background */}
            <div className="card card-yellow relative">
              <div className="relative z-10">
                <h2 className="heading-2 mb-4 md:mb-6 text-2xl md:text-3xl lg:text-4xl text-black">
                  Fair Selection
                </h2>
                <p className="body-text text-black mb-4 md:mb-6 text-base md:text-lg">
                  Our system uses Randamu VRF to ensure truly random and verifiable winner selection. 
                  No manipulation, no bias - just pure blockchain randomness.
                </p>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 md:w-4 md:h-4 bg-black rounded-full flex-shrink-0"></div>
                    <span className="text-black font-bold text-sm md:text-base">Verifiable Randomness</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 md:w-4 md:h-4 bg-black rounded-full flex-shrink-0"></div>
                    <span className="text-black font-bold text-sm md:text-base">Smart Contract Security</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 md:w-4 md:h-4 bg-black rounded-full flex-shrink-0"></div>
                    <span className="text-black font-bold text-sm md:text-base">Transparent Process</span>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-4 md:top-8 right-4 md:right-8 w-16 h-16 md:w-24 md:h-24 bg-pink-400 border-4 border-black rounded-full opacity-80"></div>
              <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 w-12 h-12 md:w-16 md:h-16 bg-blue-500 border-4 border-black transform rotate-45"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container">
          <h2 className="heading-2 text-center mb-12 md:mb-16 text-2xl md:text-3xl lg:text-4xl">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="card text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-pink-500 border-4 border-black mx-auto mb-4 md:mb-6 flex items-center justify-center">
                <span className="text-lg md:text-2xl font-black text-white">1</span>
              </div>
              <h3 className="heading-3 mb-3 md:mb-4 text-lg md:text-xl">Setup Campaign</h3>
              <p className="body-text text-sm md:text-base">
                Define your whitelist, set the number of winners, and establish your on-chain goal.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-yellow-500 border-4 border-black mx-auto mb-4 md:mb-6 flex items-center justify-center">
                <span className="text-lg md:text-2xl font-black text-black">2</span>
              </div>
              <h3 className="heading-3 mb-3 md:mb-4 text-lg md:text-xl">Random Selection</h3>
              <p className="body-text text-sm md:text-base">
                Use Randamu VRF to randomly select winners from your whitelist pool.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-black border-4 border-black mx-auto mb-4 md:mb-6 flex items-center justify-center">
                <span className="text-lg md:text-2xl font-black text-white">3</span>
              </div>
              <h3 className="heading-3 mb-3 md:mb-4 text-lg md:text-xl">Reward Distribution</h3>
              <p className="body-text text-sm md:text-base">
                Winners can claim their rewards once the on-chain goal is achieved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20">
        <div className="container text-center">
          <h2 className="heading-2 mb-6 md:mb-8 text-2xl md:text-3xl lg:text-4xl">Ready to Get Started?</h2>
          <p className="body-text mb-6 md:mb-8 max-w-2xl mx-auto text-base md:text-lg">
            Join the future of fair campaign management. Create your first campaign in minutes 
            and experience the power of blockchain-verified randomness.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <Link href="/admin" className="btn btn-primary">
              Start Creating
            </Link>
                  <Link href="/demo" className="btn btn-pink">
        Live System
      </Link>
            <Link href="/campaign" className="btn btn-yellow">
              Join Campaign
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
