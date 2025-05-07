'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from './components/AppLayout';

// Types
interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  active: boolean;
}

interface Game {
  id: string;
  name: string;
  slug: string;
  active: boolean;
}

export default function HomePage() {
  // States
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPromo, setCurrentPromo] = useState(0);

  // Fetch games and promotions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch active promotions
        const promotionsRes = await fetch('/api/admin/promotions?activeOnly=true');
        if (promotionsRes.ok) {
          const promotionsData = await promotionsRes.json();
          console.log('Fetched promotions:', promotionsData); // Debug log
          setPromotions(promotionsData);
        }
        
        // Fetch active games
        const gamesRes = await fetch('/api/admin/games');
        if (gamesRes.ok) {
          const gamesData = await gamesRes.json();
          // Filter only active games
          const activeGames = gamesData.filter((game: Game) => game.active);
          setGames(activeGames);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Auto-rotate promotions if they exist
  useEffect(() => {
    if (promotions.length > 1) {
      const interval = setInterval(() => {
        setCurrentPromo((prev) => (prev + 1) % promotions.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [promotions]);

  return (
    <AppLayout title="Lagoons Gaming - #1 Fish Games & Slots | Instant BTC Payments">
      <div className="space-y-10">
        {/* Hero Section */}
        <section className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-700">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 mix-blend-multiply" />
            </div>
            <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Fish Games & Slots with Instant Bitcoin Payouts
              </h1>
              <p className="mt-6 max-w-3xl text-xl text-blue-100">
                Dive into the ultimate fish shooting experience and premium slots with lightning-fast 
                Bitcoin recharges and withdrawals. No delays, no hassle - just pure gaming excitement.
              </p>
              <div className="mt-10 max-w-sm sm:flex sm:max-w-none">
                <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                  <Link
                    href="/deposit"
                    className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 sm:px-8"
                  >
                    Instant Recharge
                  </Link>
                  <Link
                    href="/withdraw"
                    className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-500 bg-opacity-60 hover:bg-opacity-70 sm:px-8"
                  >
                    Cash Out Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Weekly Promotions Banner */}
        <section className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-md overflow-hidden">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white">WEEKLY BONUS BLITZ</h2>
              <p className="mt-2 text-xl text-white">
                Deposit on Mondays and get 100% MATCH up to 200 USD! New promotions every week!
              </p>
              <div className="mt-4">
              </div>
            </div>
          </div>
        </section>

        {/* Current Promotion Carousel - Only show if promotions exist */}
        {promotions.length > 0 && (
          <section className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-2xl font-bold text-gray-900">Featured Promotions</h2>
            </div>
            <div className="border-t border-gray-200">
              <div className="relative h-80 sm:h-96 overflow-hidden">
                {promotions.map((promo, idx) => {
                  // Define a default background color if no image
                  const bgColor = idx % 3 === 0 
                    ? 'from-blue-500 to-purple-600' 
                    : idx % 3 === 1 
                      ? 'from-red-500 to-pink-600' 
                      : 'from-yellow-500 to-orange-500';
                  
                  return (
                    <div
                      key={promo.id}
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        idx === currentPromo ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      {promo.imageUrl ? (
                        <div className="h-full w-full relative">
                          {/* Use proper image tag instead of background-image */}
                          <div className="absolute inset-0 z-0">
                            <img 
                              src={promo.imageUrl} 
                              alt={promo.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error('Image failed to load:', promo.imageUrl);
                                // Replace with a gradient background on error
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement!.className = 
                                  `h-full bg-gradient-to-br ${bgColor}`;
                              }}
                            />
                          </div>
                          
                          <div className="absolute inset-0 bg-black bg-opacity-50 z-10 flex items-center">
                            <div className="px-4 sm:px-6 lg:px-8 z-20">
                              <h3 className="text-3xl font-bold text-white sm:text-4xl">{promo.title}</h3>
                              <p className="mt-2 text-xl text-white text-opacity-90 max-w-3xl">
                                {promo.description}
                              </p>
                              <div className="mt-6">
                                <button className="px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-100">
                                  Claim Now
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={`h-full bg-gradient-to-br ${bgColor}`}>
                          <div className="h-full flex items-center">
                            <div className="px-4 sm:px-6 lg:px-8">
                              <h3 className="text-3xl font-bold text-white sm:text-4xl">{promo.title}</h3>
                              <p className="mt-2 text-xl text-white text-opacity-90 max-w-3xl">
                                {promo.description}
                              </p>
                              <div className="mt-6">
                                <button className="px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-100">
                                  Claim Now
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {/* Carousel controls - only if there's more than one promotion */}
                {promotions.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                    {promotions.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPromo(idx)}
                        className={`w-3 h-3 rounded-full ${
                          idx === currentPromo ? 'bg-white' : 'bg-white bg-opacity-50'
                        }`}
                      >
                        <span className="sr-only">Promotion {idx + 1}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* How It Works */}
        <section className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900">Play in 3 Easy Steps</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-900">1. Select Your Game</h3>
                <p className="mt-2 text-base text-gray-500">
                  Choose from premium fish games, slots, and other casino favorites.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-900">2. Instant Recharge</h3>
                <p className="mt-2 text-base text-gray-500">
                  Enter your game ID and deposit amount - funds available in seconds.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-900">3. Win & Cash Out</h3>
                <p className="mt-2 text-base text-gray-500">
                  Withdraw your winnings anytime with our lightning-fast payout system.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Top Games Section */}
        <section className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Hot Fish Games & Slots</h2>
            {/* <Link href="/games" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All Games →
            </Link> */}
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {/* Orionstars */}
              <div className="group relative">
                <div className="relative w-full h-40 bg-gray-200 rounded-lg overflow-hidden group-hover:opacity-75">
                  <img 
                    src="/games/Orionstars.jpg" 
                    alt="Orionstars" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image failed to load:', e.currentTarget.src);
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<div class="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-600 to-purple-700"><span class="text-white font-medium text-lg">Orionstars</span></div>';
                    }}
                  />
                </div>
                <h3 className="mt-4 text-sm text-gray-700">
                  <Link href="/deposit?game=orionstars">
                    <span className="absolute inset-0" />
                    Orionstars
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-gray-500">Massive Jackpots</p>
              </div>
              
              {/* Fire Kirin */}
              <div className="group relative">
                <div className="relative w-full h-40 bg-gray-200 rounded-lg overflow-hidden group-hover:opacity-75">
                  <img 
                    src="/games/firekirin.jpg" 
                    alt="Fire Kirin" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image failed to load:', e.currentTarget.src);
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<div class="flex items-center justify-center w-full h-full bg-gradient-to-br from-red-600 to-orange-600"><span class="text-white font-medium text-lg">Fire Kirin</span></div>';
                    }}
                  />
                </div>
                <h3 className="mt-4 text-sm text-gray-700">
                  <Link href="/deposit?game=firekirin">
                    <span className="absolute inset-0" />
                    Fire Kirin
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-gray-500">High RTP</p>
              </div>
              
              {/* Pandamaster */}
              <div className="group relative">
                <div className="relative w-full h-40 bg-gray-200 rounded-lg overflow-hidden group-hover:opacity-75">
                  <img 
                    src="/games/Pandamaster.jpg" 
                    alt="Pandamaster" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image failed to load:', e.currentTarget.src);
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<div class="flex items-center justify-center w-full h-full bg-gradient-to-br from-green-600 to-teal-700"><span class="text-white font-medium text-lg">Pandamaster</span></div>';
                    }}
                  />
                </div>
                <h3 className="mt-4 text-sm text-gray-700">
                  <Link href="/deposit?game=pandamaster">
                    <span className="absolute inset-0" />
                    Pandamaster
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-gray-500">Multiplayer Action</p>
              </div>
              
              {/* Juwa */}
              <div className="group relative">
                <div className="relative w-full h-40 bg-gray-200 rounded-lg overflow-hidden group-hover:opacity-75">
                  <img 
                    src="/games/juwa.png" 
                    alt="Juwa" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image failed to load:', e.currentTarget.src);
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<div class="flex items-center justify-center w-full h-full bg-gradient-to-br from-purple-500 to-indigo-700"><span class="text-white font-medium text-lg">Juwa</span></div>';
                    }}
                  />
                </div>
                <h3 className="mt-4 text-sm text-gray-700">
                  <Link href="/deposit?game=juwa">
                    <span className="absolute inset-0" />
                    Juwa
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-gray-500">Big Tournaments</p>
              </div>
            </div>
          </div>
        </section>

        {/* Supported Games Grid */}
        {/* {games.length > 0 && (
          <section className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-2xl font-bold text-gray-900">All Supported Games</h2>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                {games.map((game) => (
                  <div key={game.id} className="group relative">
                    <div className="relative w-full h-40 bg-gray-200 rounded-lg overflow-hidden group-hover:opacity-75">
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
                        <span className="text-white font-medium">{game.name}</span>
                      </div>
                    </div>
                    <h3 className="mt-4 text-sm text-gray-700">
                      <Link href={`/deposit?game=${game.slug}`}>
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
        )} */}

        {/* Our Advantages */}
        <section className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900">Why Players Choose Us</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Instant Payments</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Lightning-fast deposits and 15-minute withdrawal processing, 24/7.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Weekly Bonuses</h3>
                  <p className="mt-2 text-base text-gray-500">
                    New promotions every week with massive deposit matches and free spins.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">100% Secure</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Advanced encryption and Bitcoin payments for complete privacy and security.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Premium Fish Games</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Exclusive access to the best fish hunting games with massive jackpots.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">VIP Rewards</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Exclusive perks for regular players including cashback and personalized bonuses.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">24/7 Support</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Professional support team available around the clock via live chat and email.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-md overflow-hidden">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to Start Winning?
            </h2>
            <p className="mt-4 text-xl text-white text-opacity-90">
              Join thousands of players enjoying instant deposits and lightning-fast withdrawals.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-md shadow">
                <Link href="/deposit" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50">
                  Get Started Now
                </Link>
              </div>
              <div className="ml-3 inline-flex">
                {/* <Link href="/promotions" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 bg-opacity-60 hover:bg-opacity-70">
                  See All Promotions
                </Link> */}
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}