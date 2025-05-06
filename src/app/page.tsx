import React, { useState, useEffect } from 'react';
import Layout from './layout';
import Link from 'next/link';

// Mock data for promotions
const PROMOTIONS = [
  {
    id: 'promo1',
    title: '50% Bonus on First Deposit',
    description: 'New players get 50% extra on their first deposit up to 0.005 BTC',
    bgColor: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'promo2',
    title: 'Weekend Cashback',
    description: 'Play on weekends and get 10% cashback on all your activity',
    bgColor: 'from-green-500 to-emerald-600'
  },
  {
    id: 'promo3',
    title: 'Refer a Friend',
    description: 'Earn 0.001 BTC for each friend you refer who makes a deposit',
    bgColor: 'from-orange-500 to-amber-600'
  }
];

// Game options
const GAMES = [
  { id: 'orionstars', name: 'Orionstars', image: '/images/game1.jpg' },
  { id: 'fishtable', name: 'Fish Table', image: '/images/game2.jpg' },
  { id: 'luckytiger', name: 'Lucky Tiger', image: '/images/game3.jpg' },
  { id: 'goldendragon', name: 'Golden Dragon', image: '/images/game4.jpg' }
];

const HomePage: React.FC = () => {
  const [currentPromo, setCurrentPromo] = useState(0);

  useEffect(() => {
    // Auto-rotate promotions
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % PROMOTIONS.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout title="CryptoGaming - Secure Bitcoin Deposits & Withdrawals">
      <div className="space-y-10">
        {/* Hero Section */}
        <section className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="relative bg-gradient-to-r from-purple-600 to-indigo-700">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-700 mix-blend-multiply" />
            </div>
            <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Fast Bitcoin Gaming Payments</h1>
              <p className="mt-6 max-w-3xl text-xl text-indigo-100">
                Seamlessly deposit and withdraw Bitcoin for your favorite online games.
                No complicated setup. Just connect, play, and cash out.
              </p>
              <div className="mt-10 max-w-sm sm:flex sm:max-w-none">
                <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                  <Link
                    href="/deposit"
                    className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 sm:px-8"
                  >
                    Make Deposit
                  </Link>
                  <Link
                    href="/withdraw"
                    className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-500 bg-opacity-60 hover:bg-opacity-70 sm:px-8"
                  >
                    Withdraw Funds
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Current Promotion Carousel */}
        <section className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-bold text-gray-900">Current Promotions</h2>
          </div>
          <div className="border-t border-gray-200">
            <div className="relative h-64 sm:h-80 overflow-hidden">
              {PROMOTIONS.map((promo, idx) => (
                <div
                  key={promo.id}
                  className={`absolute inset-0 transition-opacity duration-500 bg-gradient-to-r ${promo.bgColor} ${
                    idx === currentPromo ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="h-full flex items-center">
                    <div className="px-4 sm:px-6 lg:px-8">
                      <h3 className="text-2xl font-bold text-white sm:text-3xl">{promo.title}</h3>
                      <p className="mt-2 text-lg text-white text-opacity-90 max-w-3xl">
                        {promo.description}
                      </p>
                      <button className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Carousel controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {PROMOTIONS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPromo(idx)}
                    className={`w-2.5 h-2.5 rounded-full ${
                      idx === currentPromo ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                  >
                    <span className="sr-only">Promotion {idx + 1}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-bold text-gray-900">How It Works</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">1. Select Your Game</h3>
                <p className="mt-2 text-base text-gray-500">
                  Choose from our selection of supported games including Orionstars, Fish Table, and more.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">2. Make Your Deposit</h3>
                <p className="mt-2 text-base text-gray-500">
                  Enter your game ID and deposit amount, then send Bitcoin to the provided address.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">3. Start Playing</h3>
                <p className="mt-2 text-base text-gray-500">
                  Once confirmed, your funds will be available in your game account. Withdraw anytime.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Supported Games */}
        <section className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-bold text-gray-900">Supported Games</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {GAMES.map((game) => (
                <div key={game.id} className="group relative">
                  <div className="relative w-full h-40 bg-gray-200 rounded-lg overflow-hidden group-hover:opacity-75">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
                      <span className="text-white font-medium">{game.name}</span>
                    </div>
                  </div>
                  <h3 className="mt-4 text-sm text-gray-700">
                    <Link href={`/deposit?game=${game.id}`}>
                      <span className="absolute inset-0" />
                      {game.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">Play Now</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-bold text-gray-900">Why Choose Our Service</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Fast Transactions</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Quick deposits and withdrawals with Bitcoin and Lightning Network.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Secure Payments</h3>
                  <p className="mt-2 text-base text-gray-500">
                    All transactions are secure and protected by blockchain technology.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">No Registration</h3>
                  <p className="mt-2 text-base text-gray-500">
                    No need to create an account. Just enter your game ID and start playing.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Low Fees</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Minimal transaction fees compared to traditional payment methods.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">24/7 Processing</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Automated processing available around the clock with manual support.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Customer Support</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Dedicated support team to help with any questions or issues.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;