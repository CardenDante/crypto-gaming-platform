"use client";
import React, { useState } from 'react';
import Link from 'next/link';

// Mock transaction data
const MOCK_TRANSACTIONS = [
  {
    id: 'tx1',
    date: '2025-05-05T14:48:00',
    type: 'deposit',
    game: 'Orionstars',
    username: 'player123',
    amount: '0.0015',
    status: 'pending',
    address: 'bc1q87665mq57xhw3rtz2drjnnu8eyv4sljmjx93ch'
  },
  {
    id: 'tx2',
    date: '2025-05-04T10:22:00',
    type: 'deposit',
    game: 'Fish Table',
    username: 'gamer456',
    amount: '0.0025',
    status: 'pending',
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
    username: 'gamer888',
    amount: '0.0020',
    status: 'pending',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
  }
];

// Mock promotions data
const MOCK_PROMOTIONS = [
  {
    id: 'promo1',
    title: '50% Bonus on First Deposit',
    description: 'Get 50% extra on your first deposit up to 0.005 BTC',
    imageUrl: '/images/promo1.jpg',
    active: true
  },
  {
    id: 'promo2',
    title: 'Weekend Cashback',
    description: '10% cashback on all weekend play',
    imageUrl: '/images/promo2.jpg',
    active: false
  },
  {
    id: 'promo3',
    title: 'Refer a Friend',
    description: 'Earn 0.001 BTC for each friend you refer who makes a deposit',
    imageUrl: '/images/promo3.jpg',
    active: true
  }
];

// Admin page component
const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'promotions'>('transactions');
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [promotions, setPromotions] = useState(MOCK_PROMOTIONS);
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'withdrawal'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  
  // New promotion form state
  const [newPromotion, setNewPromotion] = useState({
    title: '',
    description: '',
    imageUrl: '',
    active: true
  });
  
  // Filter transactions
  const filteredTransactions = transactions.filter(tx => {
    // Filter by type
    if (filterType !== 'all' && tx.type !== filterType) return false;
    
    // Filter by status
    if (filterStatus !== 'all' && tx.status !== filterStatus) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        tx.id.toLowerCase().includes(query) ||
        tx.username.toLowerCase().includes(query) ||
        tx.game.toLowerCase().includes(query) ||
        tx.amount.includes(query)
      );
    }
    
    return true;
  });
  
  // Change transaction status
  const handleStatusChange = (id: string, newStatus: 'completed' | 'rejected' | 'pending') => {
    setTransactions(
      transactions.map(tx => 
        tx.id === id ? { ...tx, status: newStatus } : tx
      )
    );
  };
  
  // Toggle promotion active status
  const handleTogglePromotion = (id: string) => {
    setPromotions(
      promotions.map(promo => 
        promo.id === id ? { ...promo, active: !promo.active } : promo
      )
    );
  };
  
  // Add new promotion
  const handleAddPromotion = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new promotion with unique ID
    const newId = `promo${promotions.length + 1}`;
    setPromotions([
      ...promotions,
      { ...newPromotion, id: newId }
    ]);
    
    // Reset form
    setNewPromotion({
      title: '',
      description: '',
      imageUrl: '',
      active: true
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Site
          </Link>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`${
                activeTab === 'transactions'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Pending Transactions
            </button>
            <button
              onClick={() => setActiveTab('promotions')}
              className={`${
                activeTab === 'promotions'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ml-8`}
            >
              Manage Promotions
            </button>
          </nav>
        </div>
        
        {/* Transaction Management */}
        {activeTab === 'transactions' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex flex-wrap items-center justify-between sm:flex-nowrap">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Transaction Management
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Process pending deposits and withdrawals
                  </p>
                </div>
                <div className="ml-4 mt-4 flex-shrink-0 flex">
                  <div className="relative">
                    <select
                      id="type-filter"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as any)}
                      className="mr-2 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="all">All Types</option>
                      <option value="deposit">Deposits</option>
                      <option value="withdrawal">Withdrawals</option>
                    </select>
                  </div>
                  <div className="relative">
                    <select
                      id="status-filter"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="max-w-xs">
                  <label htmlFor="search" className="sr-only">Search</label>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search by username, game..."
                  />
                </div>
              </div>
            </div>
            
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery 
                    ? 'Try adjusting your search filters.'
                    : 'No pending transactions need your attention right now.'}
                </p>
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
                        User Info
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Address
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id}>
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{transaction.username}</div>
                          <div className="text-sm text-gray-500">{transaction.game}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.amount} BTC
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          <div className="truncate max-w-xs">
                            {transaction.address}
                          </div>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.status === 'pending' ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleStatusChange(transaction.id, 'completed')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusChange(transaction.id, 'rejected')}
                                className="text-red-600 hover:text-red-900"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(transaction.id, 'pending')}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Reset
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {/* Promotion Management */}
        {activeTab === 'promotions' && (
          <div className="space-y-6">
            {/* Current Promotions */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Current Promotions
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage promotions displayed on the platform
                </p>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {promotions.length === 0 ? (
                    <li className="px-4 py-12 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No promotions found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Get started by creating a new promotion.
                      </p>
                    </li>
                  ) : (
                    promotions.map((promo) => (
                      <li key={promo.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center text-white text-xs">
                              Promo
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{promo.title}</div>
                              <div className="text-sm text-gray-500">{promo.description}</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              promo.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            } mr-4`}>
                              {promo.active ? 'Active' : 'Inactive'}
                            </span>
                            <button
                              onClick={() => handleTogglePromotion(promo.id)}
                              className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                                promo.active
                                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                                  : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                              }`}
                            >
                              {promo.active ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
            
            {/* Add New Promotion */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Add New Promotion
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <form onSubmit={handleAddPromotion}>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="title"
                          value={newPromotion.title}
                          onChange={(e) => setNewPromotion({...newPromotion, title: e.target.value})}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                        Image URL
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="imageUrl"
                          value={newPromotion.imageUrl}
                          onChange={(e) => setNewPromotion({...newPromotion, imageUrl: e.target.value})}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Leave empty to use default promotion image
                      </p>
                    </div>
                    
                    <div className="sm:col-span-6">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="description"
                          rows={3}
                          value={newPromotion.description}
                          onChange={(e) => setNewPromotion({...newPromotion, description: e.target.value})}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-6">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="active"
                            name="active"
                            type="checkbox"
                            checked={newPromotion.active}
                            onChange={(e) => setNewPromotion({...newPromotion, active: e.target.checked})}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="active" className="font-medium text-gray-700">Active</label>
                          <p className="text-gray-500">Immediately display this promotion on the platform</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-5">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setNewPromotion({
                          title: '',
                          description: '',
                          imageUrl: '',
                          active: true
                        })}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Clear
                      </button>
                      <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Add Promotion
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;