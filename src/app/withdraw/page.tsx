import React, { useState } from 'react';
import Layout from '../layout';

// Supported games data
const GAMES = [
  { id: 'orionstars', name: 'Orionstars' },
  { id: 'fishtable', name: 'Fish Table' },
  { id: 'luckytiger', name: 'Lucky Tiger' },
  { id: 'goldendragon', name: 'Golden Dragon' }
];

// Mock transaction fee
const TX_FEE = 0.0001;

const WithdrawPage: React.FC = () => {
  // Form state
  const [game, setGame] = useState('');
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLightning, setIsLightning] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, you would:
    // 1. Create a withdrawal record in your database
    // 2. Process the withdrawal or queue it for manual review
    
    // For this demo, we just show a confirmation
    setIsSubmitted(true);
  };
  
  // Calculate the amount that will be received after fees
  const receiveAmount = () => {
    if (!amount) return '0';
    
    const amountVal = parseFloat(amount);
    if (isNaN(amountVal)) return '0';
    
    const received = Math.max(0, amountVal - TX_FEE);
    return received.toFixed(8);
  };
  
  return (
    <Layout title="Withdraw - Crypto Gaming Payment System">
      <div className="max-w-lg mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-purple-600 to-indigo-600">
            <h2 className="text-xl font-bold text-white">Request Withdrawal</h2>
            <p className="mt-1 text-sm text-indigo-100">
              Withdraw your funds to your Bitcoin wallet
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
                      min="0.00025"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">BTC</span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Minimum withdrawal: 0.00025 BTC
                  </p>
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
                        checked={isLightning}
                        onChange={(e) => setIsLightning(e.target.checked)}
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
                    placeholder={isLightning ? "user@wallet.com or lnbc1..." : "bc1q..."}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {isLightning 
                      ? "Enter your Lightning payment address or LNURL" 
                      : "Double check your Bitcoin address before submitting"}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700">Withdrawal Summary</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Requested amount:</span>
                      <span className="text-sm font-medium">{amount || '0'} BTC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Network fee:</span>
                      <span className="text-sm font-medium">{TX_FEE} BTC</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between">
                      <span className="text-sm font-medium text-gray-700">You will receive:</span>
                      <span className="text-sm font-bold">{receiveAmount()} BTC</span>
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
                      I confirm this request
                    </label>
                    <p className="text-gray-500">
                      I understand that withdrawals are manually processed and may take up to 24 hours.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
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
                        Your withdrawal request has been successfully submitted. Our team will process it as soon as possible.
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
                        {GAMES.find(g => g.id === game)?.name || game}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Username</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{username}</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Amount</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{amount} BTC</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">After Fees</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{receiveAmount()} BTC</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Wallet Address</dt>
                      <dd className="mt-1 text-sm font-mono text-gray-900 sm:mt-0 sm:col-span-2 break-all">
                        {walletAddress}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1 sm:mt-0 sm:col-span-2">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Reference ID</dt>
                      <dd className="mt-1 text-sm font-mono text-gray-900 sm:mt-0 sm:col-span-2">
                        {Math.random().toString(36).substr(2, 10).toUpperCase()}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-5">
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Make Another Withdrawal
                  </button>
                  <button
                    type="button"
                    onClick={() => window.location.href = '/dashboard'}
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
                    <h3 className="text-sm font-medium text-blue-800">Processing Time</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Withdrawals are processed manually within 24 hours during business days. You'll be notified when your withdrawal is complete.
                      </p>
                    </div>
                  </div>
                </div>
              </div>