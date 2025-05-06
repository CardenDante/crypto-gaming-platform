import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from '../layout';

// Supported games data
const GAMES = [
  { id: 'orionstars', name: 'Orionstars' },
  { id: 'fishtable', name: 'Fish Table' },
  { id: 'luckytiger', name: 'Lucky Tiger' },
  { id: 'goldendragon', name: 'Golden Dragon' }
];

// Bitcoin/Lightning addresses would be configured in your environment variables
// In a real application, you would generate unique addresses or use a payment processor
const PAYMENT_ADDRESSES = {
  bitcoin: 'bc1q87665mq57xhw3rtz2drjnnu8eyv4sljmjx93ch',
  lightning: 'lnbc1500n1p0n...[shortened]...xphz6a'
};

const DepositPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Form state
  const [game, setGame] = useState('');
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bitcoin' | 'lightning'>('bitcoin');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Get game from URL params if available
  useEffect(() => {
    const gameParam = searchParams.get('game');
    if (gameParam) {
      setGame(gameParam);
    }
  }, [searchParams]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, you would:
    // 1. Create a deposit record in your database
    // 2. Either generate a unique address or create a payment intent with a provider
    
    // For this demo, we just show the static address
    setIsSubmitted(true);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(PAYMENT_ADDRESSES[paymentMethod]);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  // Function to create wallet deep links
  const getWalletLink = (): string => {
    if (paymentMethod === 'bitcoin') {
      return `bitcoin:${PAYMENT_ADDRESSES.bitcoin}?amount=${amount}`;
    } else {
      return `lightning:${PAYMENT_ADDRESSES.lightning}`;
    }
  };
  
  return (
    <Layout title="Deposit - Crypto Gaming Payment System">
      <div className="max-w-lg mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-600 to-purple-600">
            <h2 className="text-xl font-bold text-white">Make a Deposit</h2>
            <p className="mt-1 text-sm text-indigo-100">
              Deposit Bitcoin to your gaming account
            </p>
          </div>
          
          {!isSubmitted ? (
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
                    {GAMES.map((g) => (
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
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Amount (BTC)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      name="amount"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="0.001"
                      step="0.00000001"
                      min="0.00000001"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">BTC</span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Minimum deposit: 0.0001 BTC
                  </p>
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
                        checked={paymentMethod === 'bitcoin'}
                        onChange={() => setPaymentMethod('bitcoin')}
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
                        checked={paymentMethod === 'lightning'}
                        onChange={() => setPaymentMethod('lightning')}
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
                      I understand that deposits are manually processed and may take some time.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
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
                  Please send {amount} BTC to the following address:
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-gray-800 break-all">
                    {PAYMENT_ADDRESSES[paymentMethod]}
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
                  onClick={() => setIsSubmitted(false)}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back to Form
                </button>
              </div>
              
              <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Important notice</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Your deposit will be processed manually after confirmation. Please allow some time for it to be credited to your account.
                        If you have any issues, please contact support with your transaction details.
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
                      Deposit details have been saved. Your reference ID: <span className="font-mono">{Math.random().toString(36).substr(2, 10).toUpperCase()}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DepositPage;