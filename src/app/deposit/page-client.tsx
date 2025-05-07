'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../components/AppLayout';

// Types
interface Game {
  id: string;
  name: string;
  slug: string;
  active: boolean;
}

interface Deposit {
  id: string;
  gameId: string;
  game: Game;
  username: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  paymentMethod: 'BITCOIN' | 'LIGHTNING';
  address: string;
  txId?: string;
  notes?: string;
  createdAt: string;
}

// Create a separate component that uses useSearchParams
function DepositForm() {
  const { useSearchParams } = require('next/navigation');
  const searchParams = useSearchParams();
  
  // States
  const [games, setGames] = useState<Game[]>([]);
  const [game, setGame] = useState('');
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [usdAmount, setUsdAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'BITCOIN' | 'LIGHTNING'>('BITCOIN');
  
  const [loading, setLoading] = useState(false);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [error, setError] = useState('');
  const [deposit, setDeposit] = useState<Deposit | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Current Bitcoin price in USD (would come from an API in a real app)
  const [btcPrice, setBtcPrice] = useState(94182); // Example price: $94,182 per BTC

  // Fetch available games
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/admin/games');
        
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        
        const data = await response.json();
        // Filter only active games
        const activeGames = data.filter((game: Game) => game.active);
        setGames(activeGames);
        
        // Set game from URL params if available
        const gameSlug = searchParams.get('game');
        if (gameSlug) {
          const selectedGame = activeGames.find((g: Game) => g.slug === gameSlug);
          if (selectedGame) {
            setGame(selectedGame.id);
          }
        }
        
        setGamesLoading(false);
      } catch (err) {
        console.error('Error fetching games:', err);
        setError('Failed to load available games. Please try again later.');
        setGamesLoading(false);
      }
    };
    
    fetchGames();
  }, [searchParams]);

  // Convert USD to BTC
  const convertUsdToBtc = (usd: string): string => {
    if (!usd || isNaN(parseFloat(usd))) return '';
    const btcValue = parseFloat(usd) / btcPrice;
    return btcValue.toFixed(8);
  };

  // Handle USD amount change
  const handleUsdAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const usdValue = e.target.value;
    setUsdAmount(usdValue);
    setAmount(convertUsdToBtc(usdValue));
  };

  // Handle deposit form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      // Validate inputs
      if (!game || !username || !amount) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }
      
      // Create deposit
      const response = await fetch('/api/deposits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: game,
          username,
          amount,
          paymentMethod,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create deposit');
      }
      
      const depositData = await response.json();
      setDeposit(depositData);
      setLoading(false);
    } catch (err: any) {
      console.error('Error creating deposit:', err);
      setError(err.message || 'Failed to create deposit. Please try again.');
      setLoading(false);
    }
  };

  // Function to copy address to clipboard
  const copyToClipboard = () => {
    if (deposit) {
      navigator.clipboard.writeText(deposit.address);
      setCopied(true);
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  // Function to create wallet deep links
  const getWalletLink = (): string => {
    if (!deposit) return '#';
    
    if (deposit.paymentMethod === 'BITCOIN') {
      return `bitcoin:${deposit.address}?amount=${deposit.amount}`;
    } else {
      return `lightning:${deposit.address}`;
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-600 to-purple-700">
          <h2 className="text-xl font-bold text-white">Instant Recharge</h2>
          <p className="mt-1 text-sm text-blue-100">
            Deposit funds to your gaming account in seconds
          </p>
        </div>
        
        {gamesLoading ? (
          <div className="px-4 py-5 sm:p-6 flex justify-center">
            <div className="flex flex-col items-center">
              <svg
                className="animate-spin h-10 w-10 text-indigo-600 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-gray-500">Loading available games...</p>
            </div>
          </div>
        ) : error ? (
          <div className="px-4 py-5 sm:p-6">
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : !deposit ? (
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="game" className="block text-sm font-medium text-gray-700">
                  Select Game
                </label>
                <select
                  id="game"
                  name="game"
                  value={game}
                  onChange={(e) => setGame(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select a game</option>
                  {games.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Game Username / ID
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your in-game username or ID"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Make sure this exactly matches your username in the game
                </p>
              </div>
              
              <div>
                <label htmlFor="usdAmount" className="block text-sm font-medium text-gray-700">
                  Amount (USD)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="usdAmount"
                    id="usdAmount"
                    value={usdAmount}
                    onChange={handleUsdAmountChange}
                    className="block w-full pl-7 py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="10.00"
                    step="0.01"
                    min="5"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Minimum deposit: $5.00
                </p>
                
                <div className="mt-3 bg-gray-50 p-2 rounded-md">
                  <p className="text-xs text-gray-500">Equivalent: {amount} BTC</p>
                  <p className="text-xs text-gray-500">Rate: 1 BTC = ${btcPrice.toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <div className="mt-2 space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                  <div className="flex items-center">
                    <input
                      id="bitcoin"
                      name="paymentMethod"
                      type="radio"
                      checked={paymentMethod === 'BITCOIN'}
                      onChange={() => setPaymentMethod('BITCOIN')}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label htmlFor="bitcoin" className="ml-3 block text-sm font-medium text-gray-700">
                      Bitcoin
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="lightning"
                      name="paymentMethod"
                      type="radio"
                      checked={paymentMethod === 'LIGHTNING'}
                      onChange={() => setPaymentMethod('LIGHTNING')}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label htmlFor="lightning" className="ml-3 block text-sm font-medium text-gray-700">
                      Lightning Network
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700">
                    I agree to the terms
                  </label>
                  <p className="text-gray-500">
                    I understand that funds will be credited to my account instantly after payment confirmation.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : null}
                  Continue to Payment
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Payment Instructions</h3>
              <p className="mt-2 text-sm text-gray-500">
                Please send (${(parseFloat(deposit.amount.toString()) * btcPrice).toFixed(2)}) to the following address:
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-gray-800 break-all">
                  {deposit.address}
                </span>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="ml-3 inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
              <a
                href={getWalletLink()}
                className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Open in Wallet
              </a>
              <button
                type="button"
                onClick={() => setDeposit(null)}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Form
              </button>
            </div>
            
            <div className="mt-6 bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Fast Processing</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      Your deposit will be processed automatically and credited to your account within seconds after the network confirmation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 text-sm text-gray-500">
                  <p>
                    Deposit details have been saved. Your reference ID: <span className="font-mono">{deposit.id}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Main component that wraps DepositForm with Suspense
export default function DepositPage() {
  return (
    <AppLayout title="Instant Recharge - Lagoons Gaming">
      <Suspense fallback={
        <div className="max-w-lg mx-auto p-8 flex justify-center">
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-10 w-10 text-indigo-600 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-gray-500">Loading deposit form...</p>
          </div>
        </div>
      }>
        <DepositForm />
      </Suspense>
    </AppLayout>
  );
}