'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface SystemConfig {
  [key: string]: string;
}

export default function AdminConfig() {
  const { data: session } = useSession();
  const [config, setConfig] = useState<SystemConfig>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Fetch system configuration
  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/config');
      
      if (!response.ok) {
        throw new Error('Failed to fetch system configuration');
      }
      
      const data = await response.json();
      setConfig(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching system configuration:', err);
      setError('Failed to fetch system configuration. Please try again later.');
      setLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    if (session?.user) {
      fetchConfig();
    }
  }, [session]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig({
      ...config,
      [name]: value,
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      const response = await fetch('/api/admin/config', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update system configuration');
      }
      
      setSuccess('System configuration updated successfully');
      setSaving(false);
    } catch (err) {
      console.error('Error updating system configuration:', err);
      setError('Failed to update system configuration. Please try again.');
      setSaving(false);
    }
  };
  
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            System Settings
          </h2>
        </div>
      </div>
      
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
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
      )}
      
      {success && (
        <div className="rounded-md bg-green-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">{success}</h3>
            </div>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
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
          <p className="text-gray-500">Loading system settings...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Payment Settings
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Configure Bitcoin and Lightning addresses for deposits and network fees
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="btc_address" className="block text-sm font-medium text-gray-700">
                    Bitcoin Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="btc_address"
                    id="btc_address"
                    value={config.btc_address || ''}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Bitcoin address for user deposits
                  </p>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="lightning_address" className="block text-sm font-medium text-gray-700">
                    Lightning Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lightning_address"
                    id="lightning_address"
                    value={config.lightning_address || ''}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Lightning Network address for user deposits
                  </p>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="network_fee" className="block text-sm font-medium text-gray-700">
                    Network Fee (BTC) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="network_fee"
                    id="network_fee"
                    value={config.network_fee || ''}
                    onChange={handleInputChange}
                    step="0.00000001"
                    min="0"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Fee deducted from withdrawal amount
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  saving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {saving ? (
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
                Save Settings
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}