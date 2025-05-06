// Updated GamesPage with ModalWrapper integration
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ModalWrapper from '@/app/components/ModalWrapper';

interface Game {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function GamesPage() {
  const { data: session } = useSession();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', active: true });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (session?.user) fetchGames();
  }, [session]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/games');
      if (!response.ok) throw new Error('Failed to fetch games');
      const data = await response.json();
      setGames(data);
    } catch (err) {
      setError('Failed to fetch games. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProcessing(true);
      const url = '/api/admin/games';
      const method = editingGame ? 'PATCH' : 'POST';
      const payload = editingGame ? { id: editingGame.id, ...formData } : formData;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Error saving game');
      fetchGames();
      setShowModal(false);
      setEditingGame(null);
      setFormData({ name: '', slug: '', active: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Games Management</h2>
        <button
          onClick={() => {
            setEditingGame(null);
            setFormData({ name: '', slug: '', active: true });
            setShowModal(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Add New Game
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <div className="rounded-md bg-red-50 p-4 mb-4 text-red-700">{error}</div>
      ) : (
        <ul className="divide-y divide-gray-200 bg-white shadow rounded-md">
          {games.map((game) => (
            <li key={game.id} className="p-4 flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-gray-900">{game.name}</div>
                <div className="text-sm text-gray-500">{game.slug}</div>
                <span className={`inline-block text-xs font-semibold mt-1 ${game.active ? 'text-green-700' : 'text-gray-500'}`}>
                  {game.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <button
                onClick={() => {
                  setEditingGame(game);
                  setFormData({ name: game.name, slug: game.slug, active: game.active });
                  setShowModal(true);
                }}
                className="text-indigo-600 hover:text-indigo-900 text-sm"
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Modal via Portal */}
      {showModal && (
        <ModalWrapper onBackdropClick={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <h3 className="text-lg font-semibold mb-4">{editingGame ? 'Edit Game' : 'Add Game'}</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full border px-3 py-2 rounded shadow-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                className="w-full border px-3 py-2 rounded shadow-sm"
              />
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label className="text-sm">Active</label>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded"
                disabled={processing}
              >
                {processing ? 'Saving...' : editingGame ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}
    </div>
  );
}
