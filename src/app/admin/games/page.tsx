// src/app/admin/games/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Game {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function GamesPage() {
  const { data: session, status } = useSession();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state for adding/editing games
  const [showModal, setShowModal] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    active: true,
  });
  const [processing, setProcessing] = useState(false);
  
  // Fetch games
  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/games');
      
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      
      const data = await response.json();
      setGames(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching games:', err);
      setError('Failed to fetch games. Please try again later.');
      setLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    if (session?.user) {
      fetchGames();
    }
  }, [session]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setProcessing(true);
      
      const url = '/api/admin/games';
      const method = editingGame ? 'PATCH' : 'POST';
      const payload = editingGame 
        ? { id: editingGame.id, ...formData }
        : formData;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${editingGame ? 'update' : 'create'} game`);
      }
      
      // Refresh games list
      await fetchGames();
      
      // Close modal and reset form
      setShowModal(false);
      setEditingGame(null);
      setFormData({
        name: '',
        slug: '',
        active: true,
      });
    } catch (err: any) {
      console.error('Error saving game:', err);
      setError(err.message || `Failed to ${editingGame ? 'update' : 'create'} game`);
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Games Management
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={() => {
              setEditingGame(null);
              setFormData({
                name: '',
                slug: '',
                active: true,
              });
              setShowModal(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add New Game
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Display games list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="p-6 text-center">
            <div className="flex justify-center">
              <div className="animate-spin h-10 w-10 text-indigo-600 rounded-full border-4 border-t-transparent border-indigo-600"></div>
            </div>
            <p className="mt-2 text-gray-700">Loading games...</p>
          </div>
        ) : games.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No games found.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {games.map((game) => (
              <li key={game.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{game.name}</h3>
                  <p className="text-sm text-gray-500">Slug: {game.slug}</p>
                </div>
                <div className="flex items-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${game.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {game.active ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    className="ml-4 text-indigo-600 hover:text-indigo-900"
                    onClick={() => {
                      setEditingGame(game);
                      setFormData({
                        name: game.name,
                        slug: game.slug,
                        active: game.active,
                      });
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Add/Edit Game Modal */}
      {showModal && (
        <div className="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={() => !processing && setShowModal(false)}
            ></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {editingGame ? 'Edit Game' : 'Add New Game'}
                    </h3>
                    
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                          Slug <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="slug"
                          name="slug"
                          value={formData.slug}
                          onChange={handleInputChange}
                          required
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Unique identifier for the game. Use only lowercase letters, numbers, and hyphens.
                        </p>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="active"
                            name="active"
                            type="checkbox"
                            checked={formData.active}
                            onChange={handleCheckboxChange}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="active" className="font-medium text-gray-700">Active</label>
                          <p className="text-gray-500">Game will be available for deposits and withdrawals</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={processing}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm ${
                      processing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {processing ? 'Processing...' : editingGame ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    disabled={processing}
                    className={`mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${
                      processing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}