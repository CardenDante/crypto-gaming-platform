'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

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

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'withdrawal'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'PENDING' | 'COMPLETED' | 'REJECTED'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Additional state for transaction update
  const [processingTransaction, setProcessingTransaction] = useState<string | null>(null);
  const [transactionNotes, setTransactionNotes] = useState('');
  const [transactionTxId, setTransactionTxId] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [updateStatus, setUpdateStatus] = useState<'COMPLETED' | 'REJECTED' | null>(null);
  
  // Fetch transactions
const fetchTransactions = async () => {
  try {
    setLoading(true);
    
    // Log the request URLs to help debugging
    console.log('Fetching deposits from:', '/api/deposits');
    console.log('Fetching withdrawals from:', '/api/withdrawals');
    
    // Fetch deposits
    const depositsRes = await fetch('/api/deposits');
    console.log('Deposits response status:', depositsRes.status);
    
    if (!depositsRes.ok) {
      const errorText = await depositsRes.text();
      console.error('Error fetching deposits:', errorText);
      throw new Error('Failed to fetch deposits');
    }
    
    const deposits = await depositsRes.json();
    console.log('Deposits data:', deposits);
    
    // Fetch withdrawals
    const withdrawalsRes = await fetch('/api/withdrawals');
    console.log('Withdrawals response status:', withdrawalsRes.status);
    
    if (!withdrawalsRes.ok) {
      const errorText = await withdrawalsRes.text();
      console.error('Error fetching withdrawals:', errorText);
      throw new Error('Failed to fetch withdrawals');
    }
    
    const withdrawals = await withdrawalsRes.json();
    console.log('Withdrawals data:', withdrawals);
    
    // Combine and format transactions
    const allTransactions: Transaction[] = [
      ...deposits.map((d: Omit<Transaction, 'type'>) => ({
      ...d,
      type: 'deposit',
      })),
      ...withdrawals.map((w: Omit<Transaction, 'type'>) => ({
      ...w,
      type: 'withdrawal',
      })),
    ];
    
    // Sort by date (newest first)
    allTransactions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    setTransactions(allTransactions);
    setLoading(false);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    setError('Failed to fetch transactions. Please try again later.');
    setLoading(false);
  }
};
  
  // Initial fetch
  useEffect(() => {
    if (session?.user) {
      fetchTransactions();
    }
  }, [session, filterStatus]);
  
  // Handle transaction update
  const handleUpdateTransaction = async () => {
    if (!selectedTransaction || !updateStatus) return;
    
    try {
      setProcessingTransaction(selectedTransaction.id);
      
      const response = await fetch('/api/admin/transaction', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedTransaction.id,
          type: selectedTransaction.type,
          status: updateStatus,
          txId: transactionTxId || undefined,
          notes: transactionNotes || undefined,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update transaction');
      }
      
      // Close modal and refresh transactions
      setShowUpdateModal(false);
      fetchTransactions();
    } catch (err) {
      console.error('Error updating transaction:', err);
      setError('Failed to update transaction. Please try again.');
    } finally {
      setProcessingTransaction(null);
    }
  };
  
  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter(tx => {
    // Filter by type
    if (filterType !== 'all' && tx.type !== filterType) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        tx.id.toLowerCase().includes(query) ||
        tx.username.toLowerCase().includes(query) ||
        tx.game.name.toLowerCase().includes(query) ||
        (tx.txId && tx.txId.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Transactions
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Frontend
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="md:flex md:items-center">
            <div className="md:flex-1">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Transaction Filters
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Filter and search transactions
              </p>
            </div>
            <div className="mt-4 md:mt-0 md:flex md:space-x-4">
              <div>
                <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  id="type-filter"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Types</option>
                  <option value="deposit">Deposits</option>
                  <option value="withdrawal">Withdrawals</option>
                </select>
              </div>
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status-filter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <div className="md:flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search username, game..."
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Transactions table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
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
              onClick={fetchTransactions}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Try Again
            </button>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-6 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Game
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Username
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
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
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.type === 'deposit'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.game.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.amount} BTC
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.status.charAt(0) + transaction.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setTransactionNotes(transaction.notes || '');
                          setTransactionTxId(transaction.txId || '');
                          setUpdateStatus(null);
                          setShowUpdateModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Details
                      </button>
                      {transaction.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setTransactionNotes(transaction.notes || '');
                              setTransactionTxId(transaction.txId || '');
                              setUpdateStatus('COMPLETED');
                              setShowUpdateModal(true);
                            }}
                            className="text-green-600 hover:text-green-900 mr-4"
                            disabled={processingTransaction === transaction.id}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setTransactionNotes(transaction.notes || '');
                              setTransactionTxId(transaction.txId || '');
                              setUpdateStatus('REJECTED');
                              setShowUpdateModal(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                            disabled={processingTransaction === transaction.id}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Transaction Update Modal */}
      {showUpdateModal && selectedTransaction && (
        <div className="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={() => setShowUpdateModal(false)}
            ></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {updateStatus
                        ? `${updateStatus === 'COMPLETED' ? 'Approve' : 'Reject'} ${
                            selectedTransaction.type.charAt(0).toUpperCase() + selectedTransaction.type.slice(1)
                          }`
                        : `Transaction Details`}
                    </h3>
                    
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <dl className="divide-y divide-gray-200">
                        <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                          <dt className="text-sm font-medium text-gray-500">Type</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {selectedTransaction.type.charAt(0).toUpperCase() + selectedTransaction.type.slice(1)}
                          </dd>
                        </div>
                        <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                          <dt className="text-sm font-medium text-gray-500">Game</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {selectedTransaction.game.name}
                          </dd>
                        </div>
                        <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                          <dt className="text-sm font-medium text-gray-500">Username</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {selectedTransaction.username}
                          </dd>
                        </div>
                        <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                          <dt className="text-sm font-medium text-gray-500">Amount</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {selectedTransaction.amount} BTC
                          </dd>
                        </div>
                        <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                          <dt className="text-sm font-medium text-gray-500">Date</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {new Date(selectedTransaction.createdAt).toLocaleString()}
                          </dd>
                        </div>
                        <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                          <dt className="text-sm font-medium text-gray-500">Status</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                selectedTransaction.status === 'COMPLETED'
                                  ? 'bg-green-100 text-green-800'
                                  : selectedTransaction.status === 'PENDING'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {selectedTransaction.status.charAt(0) + selectedTransaction.status.slice(1).toLowerCase()}
                            </span>
                          </dd>
                        </div>
                        {selectedTransaction.type === 'deposit' && selectedTransaction.address && (
                          <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                            <dt className="text-sm font-medium text-gray-500">Deposit Address</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <div className="truncate font-mono text-xs">
                                {selectedTransaction.address}
                              </div>
                            </dd>
                          </div>
                        )}
                        {selectedTransaction.type === 'withdrawal' && selectedTransaction.walletAddress && (
                          <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                            <dt className="text-sm font-medium text-gray-500">Withdrawal Address</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <div className="truncate font-mono text-xs">
                                {selectedTransaction.walletAddress}
                              </div>
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                    
                    <div className="mt-4">
                      <label htmlFor="txId" className="block text-sm font-medium text-gray-700">
                        Transaction ID
                      </label>
                      <input
                        type="text"
                        id="txId"
                        value={transactionTxId}
                        onChange={(e) => setTransactionTxId(e.target.value)}
                        placeholder="Blockchain transaction ID"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    
                    <div className="mt-4">
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                        Notes
                      </label>
                      <textarea
                        id="notes"
                        value={transactionNotes}
                        onChange={(e) => setTransactionNotes(e.target.value)}
                        rows={3}
                        placeholder="Admin notes about this transaction"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {updateStatus ? (
                  <>
                    <button
                      type="button"
                      onClick={handleUpdateTransaction}
                      disabled={processingTransaction === selectedTransaction.id}
                      className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                        updateStatus === 'COMPLETED'
                          ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                          : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                      } ${processingTransaction === selectedTransaction.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {processingTransaction === selectedTransaction.id ? (
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
                      {updateStatus === 'COMPLETED' ? 'Approve' : 'Reject'}
                    </button>
                  </>
                ) : null}
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}