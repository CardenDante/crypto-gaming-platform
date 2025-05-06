import React, { useState } from 'react';
import Layout from '../layout';

// Mock transaction data
const MOCK_TRANSACTIONS = [
  {
    id: 'tx1',
    date: '2025-05-05T14:48:00',
    type: 'deposit',
    game: 'Orionstars',
    username: 'player123',
    amount: '0.0015',
    status: 'completed',
    address: 'bc1q87665mq57xhw3rtz2drjnnu8eyv4sljmjx93ch'
  },
  {
    id: 'tx2',
    date: '2025-05-04T10:22:00',
    type: 'deposit',
    game: 'Fish Table',
    username: 'player123',
    amount: '0.0025',
    status: 'completed',
    address: 'bc1q87665mq57xhw3rtz2drjnnu8eyv4sljmjx93ch'
  },
  {
    id: 'tx3',
    date: '2025-05-03T18:15:00',
    type: 'withdrawal',
    game: 'Orionstars',
    username: 'player123',
    amount: '0.0010',
    status: 'pending',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
  },
  {
    id: 'tx4',
    date: '2025-05-01T09:30:00',
    type: 'withdrawal',
    game: 'Lucky Tiger',
    username: 'player123',
    amount: '0.0020',
    status: 'completed',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
  }
];

const DashboardPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'deposits' | 'withdrawals'>('all');
  const [query, setQuery] = useState('');
  
  // Filter transactions based on selected tab and search query
  const filteredTransactions = MOCK_TRANSACTIONS.filter(tx => {
    // Filter by type if not "all"
    if (selectedTab === 'deposits' && tx.type !== 'deposit') return false;
    if (selectedTab === 'withdrawals' && tx.type !== 'withdrawal') return false;
    
    // Filter by search query
    if (query) {
      const queryLower = query.toLowerCase();
      return (
        tx.id.toLowerCase().includes(queryLower) ||
        tx.game.toLowerCase().includes(queryLower) ||
        tx.username.toLowerCase().includes(queryLower) ||
        tx.amount.includes(queryLower) ||
        tx.status.toLowerCase().includes(queryLower)
      );
    }
    
    return true;
  });
  
  // Calculate totals
  const calculateTotals = () => {
    let totalDeposits = 0;
    let totalWithdrawals = 0;
    
    MOCK_TRANSACTIONS.forEach(tx => {
      const amount = parseFloat(tx.amount);
      if (tx.type === 'deposit' && tx.status === 'completed') {
        totalDeposits += amount;
      } else if (tx.type === 'withdrawal' && tx.status === 'completed') {
        totalWithdrawals += amount;
      }
    });
    
    return {
      deposits: totalDeposits.toFixed(8),
      withdrawals: totalWithdrawals.toFixed(8),
      balance: (totalDeposits - totalWithdrawals).toFixed(8)
    };
  };
  
  const totals = calculateTotals();
  
  return (
    <Layout title="Dashboard - Crypto Gaming Payment System">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
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
                        {totals.deposits} BTC
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <a href="/deposit" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Make a deposit <span aria-hidden="true">&rarr;</span>
                </a>
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
                        {totals.withdrawals} BTC
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <a href="/withdraw" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Request a withdrawal <span aria-hidden="true">&rarr;</span>
                </a>
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
                        {totals.balance} BTC
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
        
        {/* Transaction History */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-white border-b border-gray-200">
            <div className="flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Transaction History
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  View all your deposits and withdrawals
                </p>
              </div>
              <div className="flex-shrink-0 mt-4 sm:mt-0">
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="search"
                    id="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
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
                  onClick={() => setSelectedTab('all')}
                  className={`px-4 py-2 text-sm font-medium ${
                    selectedTab === 'all'
                      ? 'text-indigo-700 border-b-2 border-indigo-500'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  All Transactions
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTab('deposits')}
                  className={`ml-8 px-4 py-2 text-sm font-medium ${
                    selectedTab === 'deposits'
                      ? 'text-indigo-700 border-b-2 border-indigo-500'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Deposits
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTab('withdrawals')}
                  className={`ml-8 px-4 py-2 text-sm font-medium ${
                    selectedTab === 'withdrawals'
                      ? 'text-indigo-700 border-b-2 border-indigo-500'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Withdrawals
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {query ? 'Try adjusting your search query.' : 'Get started by making a deposit.'}
                </p>
                {!query && (
                  <div className="mt-6">
                    <a
                      href="/deposit"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Make a Deposit
                    </a>
                  </div>
                )}
              </div>
            ) : (
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
                        {new Date(transaction.date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.type === 'deposit' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.game}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.amount} BTC
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : transaction.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {transaction.id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {filteredTransactions.length > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </a>
                <a
                  href="#"
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </a>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTransactions.length}</span> of{' '}
                    <span className="font-medium">{filteredTransactions.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <a
                      href="#"
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      aria-current="page"
                      className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      1
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;