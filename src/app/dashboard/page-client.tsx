'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AppLayout from '../components/AppLayout';

// Types
interface Game {
  id: string;
  name: string;
  slug: string;
}

interface Transaction {
  id: string;
  gameId: string;
  game: Game;
  username: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  createdAt: string;
  type: 'deposit' | 'withdrawal';
  walletAddress?: string;
  address?: string;
  txId?: string;
  notes?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  
  // States
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'deposits' | 'withdrawals'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Deposit and withdrawal total state
  const [stats, setStats] = useState({
    totalDeposits: 0,
    totalWithdrawals: 0,
    balance: 0,
  });
  
  // Fetch transactions (deposits and withdrawals)
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        
        // Fetch deposits
        const depositsRes = await fetch('/api/deposits');
        
        if (!depositsRes.ok) {
          throw new Error('Failed to fetch deposits');
        }
        
        const deposits = await depositsRes.json();
        
        // Fetch withdrawals
        const withdrawalsRes = await fetch('/api/withdrawals');
        
        if (!withdrawalsRes.ok) {
          throw new Error('Failed to fetch withdrawals');
        }
        
        const withdrawals = await withdrawalsRes.json();
        
        // Combine and format transactions
        const allTransactions = [
          ...deposits.map((d: any) => ({
            ...d,
            type: 'deposit' as const,
          })),
          ...withdrawals.map((w: any) => ({
            ...w,
            type: 'withdrawal' as const,
          })),
        ];
        
        // Sort by date (newest first)
        allTransactions.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setTransactions(allTransactions);
        calculateTotals(allTransactions);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to fetch transactions. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);
  
  // Calculate totals for deposits and withdrawals
  const calculateTotals = (transactions: Transaction[]) => {
    let totalDeposits = 0;
    let totalWithdrawals = 0;
    
    transactions.forEach(tx => {
      if (tx.type === 'deposit' && tx.status === 'COMPLETED') {
        totalDeposits += tx.amount;
      } else if (tx.type === 'withdrawal' && tx.status === 'COMPLETED') {
        totalWithdrawals += tx.amount;
      }
    });
    
    setStats({
      totalDeposits,
      totalWithdrawals,
      balance: totalDeposits - totalWithdrawals,
    });
  };
  
  // Filter transactions based on activeTab and search query
  const filteredTransactions = transactions.filter(tx => {
    // Filter by type
    if (activeTab === 'deposits' && tx.type !== 'deposit') return false;
    if (activeTab === 'withdrawals' && tx.type !== 'withdrawal') return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        tx.id.toLowerCase().includes(query) ||
        tx.username.toLowerCase().includes(query) ||
        tx.game.name.toLowerCase().includes(query) ||
        (tx.status || '').toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  return (
    <AppLayout title="Dashboard - Lagoons Gaming">
      <div className="space-y-6">
        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Deposits
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats.totalDeposits.toFixed(8)} BTC
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link href="/deposit" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Make a deposit <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" transform="rotate(45 12 12)" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Withdrawals
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats.totalWithdrawals.toFixed(8)} BTC
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link href="/withdraw" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Request a withdrawal <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Current Balance
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats.balance.toFixed(8)} BTC
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <span className="font-medium text-gray-500">
                  Updated {new Date().toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
         */}

        {/* Transaction History */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-white border-b border-gray-200">
            <div className="flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Transaction History
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Track all your deposits and withdrawals here.
                </p>
              </div>
              <div className="flex-shrink-0 mt-4 sm:mt-0">
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="search"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm border-gray-300"
                    placeholder="Search transactions"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-6 border-b border-gray-200">
              <div className="flex">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'all'
                      ? 'text-indigo-700 border-b-2 border-indigo-500'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  All Transactions
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('deposits')}
                  className={`ml-8 px-4 py-2 text-sm font-medium ${
                    activeTab === 'deposits'
                      ? 'text-indigo-700 border-b-2 border-indigo-500'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Deposits
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('withdrawals')}
                  className={`ml-8 px-4 py-2 text-sm font-medium ${
                    activeTab === 'withdrawals'
                      ? 'text-indigo-700 border-b-2 border-indigo-500'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Withdrawals
                </button>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <svg
                className="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4"
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
              <p className="text-gray-500">Loading transactions...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <div className="rounded-md bg-red-50 p-4 mb-4">
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
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Try Again
              </button>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? 'Try adjusting your search query.' : 'Get started by making a deposit.'}
              </p>
              {!searchQuery && (
                <div className="mt-6">
                  <Link
                    href="/deposit"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Make a Deposit
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Game
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.type === 'deposit' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.game.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.amount} BTC
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'COMPLETED' 
                            ? 'bg-green-100 text-green-800' 
                            : transaction.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status.charAt(0) + transaction.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {transaction.id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}