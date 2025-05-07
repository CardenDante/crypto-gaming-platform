'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../components/AppLayout';

// Types
interface Game {
  id: string;
  name: string;
  slug: string;
  active: boolean;
}

interface Withdrawal {
  id: string;
  gameId: string;
  game: Game;
  username: string;
  amount: number;
  netAmount: number;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  walletType: 'BITCOIN' | 'LIGHTNING';
  walletAddress: string;
  txId?: string;
  notes?: string;
  createdAt: string;
}

export default function WithdrawPage() {
  const router = useRouter();
  
  // States
  const [games, setGames] = useState<Game[]>([]);
  const [game, setGame] = useState('');
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [usdAmount, setUsdAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [walletType, setWalletType] = useState<'BITCOIN' | 'LIGHTNING'>('BITCOIN');
  
  const [loading, setLoading] = useState(false);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [error, setError] = useState('');
  const [withdrawal, setWithdrawal] = useState<Withdrawal | null>(null);
  const [networkFee, setNetworkFee] = useState<number>(0.0001);
  
  // Current Bitcoin price in USD (would come from an API in a real app)
 const [btcPrice, setBtcPrice] = useState(94182); // Example price: $60,000 per BTC
  
  // Fetch available games and network fee
  useEffect(() => {
    const fetchGamesAndConfig = async () => {
      try {
        setGamesLoading(true);
        
        // Fetch games
        const gamesResponse = await fetch('/api/admin/games');
        
        if (!gamesResponse.ok) {
          throw new Error('Failed to fetch games');
        }
        
        const gamesData = await gamesResponse.json();
        // Filter only active games
        const activeGames = gamesData.filter((game: Game) => game.active);
        setGames(activeGames);
        
        // Fetch system config for network fee
        const configResponse = await fetch('/api/admin/config');
        
        if (configResponse.ok) {
          const configData = await configResponse.json();
          if (configData.network_fee) {
            setNetworkFee(parseFloat(configData.network_fee));
          }
        }
        
        setGamesLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load available games. Please try again later.');
        setGamesLoading(false);
      }
    };
    
    fetchGamesAndConfig();
  }, []);
  
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
  
  // Calculate the USD equivalent of network fee
  const networkFeeUsd = (networkFee * btcPrice).toFixed(2);
  
  // Calculate the amount that will be received after fees (in BTC)
  const receiveAmount = () => {
    if (!amount) return '0';
    
    const amountVal = parseFloat(amount);
    if (isNaN(amountVal)) return '0';
    
    const received = Math.max(0, amountVal - networkFee);
    return received.toFixed(8);
  };
  
  // Calculate the USD value that will be received after fees
  const receiveAmountUsd = () => {
    const btcReceived = parseFloat(receiveAmount());
    return (btcReceived * btcPrice).toFixed(2);
  };
  
  // Handle withdrawal form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      // Validate inputs
      if (!game || !username || !amount || !walletAddress) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }
      
      const amountFloat = parseFloat(amount);
      if (isNaN(amountFloat) || amountFloat <= 0) {
        setError('Please enter a valid amount');
        setLoading(false);
        return;
      }
      
      if (amountFloat <= networkFee) {
        setError(`Amount must be greater than the network fee of ${networkFee} BTC ($${networkFeeUsd})`);
        setLoading(false);
        return;
      }
      
      // Create withdrawal request
      const response = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: game,
          username,
          amount,
          walletType,
          walletAddress,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create withdrawal request');
      }
      
      const withdrawalData = await response.json();
      setWithdrawal(withdrawalData);
      setLoading(false);
    } catch (err: any) {
      console.error('Error creating withdrawal:', err);
      setError(err.message || 'Failed to create withdrawal request. Please try again.');
      setLoading(false);
    }
  };
  
  return (
    <AppLayout title="Fast Cashout - Lagoons Gaming">
      <div className="max-w-lg mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-600 to-purple-700">
            <h2 className="text-xl font-bold text-white">Fast Cashout</h2>
            <p className="mt-1 text-sm text-blue-100">
              Withdraw your winnings in minutes
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
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : !withdrawal ? (
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
                      min={(networkFee * btcPrice + 0.01).toFixed(2)}
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Minimum withdrawal: ${(networkFee * btcPrice + 5).toFixed(2)}
                  </p>
                  
                  <div className="mt-3 bg-gray-50 p-2 rounded-md">
                    <p className="text-xs text-gray-500">Equivalent: {amount} BTC</p>
                    <p className="text-xs text-gray-500">Rate: 1 BTC = ${btcPrice.toLocaleString()}</p>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700">
                      Your Bitcoin Wallet Address
                    </label>
                    <div className="flex items-center">
                      <input
                        id="isLightning"
                        name="isLightning"
                        type="checkbox"
                        checked={walletType === 'LIGHTNING'}
                        onChange={(e) => setWalletType(e.target.checked ? 'LIGHTNING' : 'BITCOIN')}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                      <label htmlFor="isLightning" className="ml-2 block text-xs font-medium text-gray-700">
                        Lightning Address
                      </label>
                    </div>
                  </div>
                  <input
                    type="text"
                    name="walletAddress"
                    id="walletAddress"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
                    placeholder={walletType === 'LIGHTNING' ? "user@wallet.com or lnbc1..." : "bc1q..."}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {walletType === 'LIGHTNING' 
                      ? "Enter your Lightning payment address or LNURL" 
                      : "Double check your Bitcoin address before submitting"}
                  </p>
                </div>
                
                {/* <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700">Withdrawal Summary</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Requested amount:</span>
                      <span className="text-sm font-medium">${usdAmount || '0'} / {amount || '0'} BTC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Network fee:</span>
                      <span className="text-sm font-medium">${networkFeeUsd} / {networkFee} BTC</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between">
                      <span className="text-sm font-medium text-gray-700">You will receive:</span>
                      <span className="text-sm font-bold">${receiveAmountUsd()} / {receiveAmount()} BTC</span>
                    </div>
                  </div>
                </div> */}
                
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
                      I confirm this request
                    </label>
                    <p className="text-gray-500">
                      I understand that my funds will be sent to my wallet within 15 minutes after approval.
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
                    Submit Withdrawal Request
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="px-4 py-5 sm:p-6 space-y-6">
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Withdrawal Request Received</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        Your withdrawal request has been successfully submitted. Funds will be sent to your wallet instantly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Withdrawal Details</h3>
                <div className="mt-5 border-t border-gray-200">
                  <dl className="divide-y divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Game</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {withdrawal.game.name}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Username</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{withdrawal.username}</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Amount</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        ${(withdrawal.amount * btcPrice).toFixed(2)} / {withdrawal.amount} BTC
                      </dd>
                    </div>
                    {/* <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">After Fees</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        ${(withdrawal.netAmount * btcPrice).toFixed(2)} / {withdrawal.netAmount} BTC
                      </dd>
                    </div> */}
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Wallet Address</dt>
                      <dd className="mt-1 text-sm font-mono text-gray-900 sm:mt-0 sm:col-span-2 break-all">
                        {withdrawal.walletAddress}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1 sm:mt-0 sm:col-span-2">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Processing
                        </span>
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Reference ID</dt>
                      <dd className="mt-1 text-sm font-mono text-gray-900 sm:mt-0 sm:col-span-2">
                        {withdrawal.id}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-5">
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setWithdrawal(null)}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Make Another Withdrawal
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
              
              <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Fast Processing</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Your withdrawal will be processed automatically within 15 minutes. You'll receive a confirmation email when your funds are sent.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}