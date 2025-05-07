'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Modal from '@/app/components/Modal'; // Import the portal-based Modal component

interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPromotions() {
  const { data: session } = useSession();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for add/edit promotion
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    active: true,
  });
  const [processing, setProcessing] = useState(false);
  
  // Fetch promotions
  const fetchPromotions = async () => {
    try {
      setLoading(true);
      console.log('Fetching promotions from:', '/api/admin/promotions');
      const response = await fetch('/api/admin/promotions');
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching promotions:', errorText);
        throw new Error(`Failed to fetch promotions: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Promotions data:', data);
      setPromotions(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching promotions:', err);
      setError('Failed to fetch promotions. Please try again later.');
      setLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    if (session?.user) {
      fetchPromotions();
    }
  }, [session]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
  
  // Handle add/edit promotion
  const handleSubmit = async () => {
    try {
      setProcessing(true);
      
      // Validate required fields
      if (!formData.title || !formData.description) {
        alert('Please fill in all required fields');
        setProcessing(false);
        return;
      }
      
      // Prepare payload
      const payload: Partial<Promotion> = {
        ...formData,
        imageUrl: formData.imageUrl || null,
      };
      
      // Create or update promotion
      const url = '/api/admin/promotions';
      const method = editingPromotion ? 'PATCH' : 'POST';
      
      // Add ID to payload if editing
      if (editingPromotion) {
        payload.id = editingPromotion.id;
      }
      
      console.log(`Sending ${method} request to ${url} with payload:`, payload);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      console.log('API Response Status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        throw new Error(`Failed to ${editingPromotion ? 'update' : 'create'} promotion: ${response.status} ${errorText}`);
      }
      
      // Close modal and refresh promotions
      setShowModal(false);
      resetForm();
      fetchPromotions();
    } catch (err) {
      console.error('Error saving promotion:', err);
      setError(`Failed to ${editingPromotion ? 'update' : 'create'} promotion. Please try again.`);
    } finally {
      setProcessing(false);
    }
  };
  
  // Toggle promotion active status
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      setLoading(true);
      console.log(`Toggling promotion status for ID ${id} from ${currentStatus} to ${!currentStatus}`);
      
      const response = await fetch('/api/admin/promotions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          active: !currentStatus,
        }),
      });
      
      console.log('API Response Status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        throw new Error(`Failed to toggle promotion status: ${response.status} ${errorText}`);
      }
      
      // Refresh promotions
      fetchPromotions();
    } catch (err) {
      console.error('Error toggling promotion status:', err);
      setError('Failed to update promotion status. Please try again.');
      setLoading(false);
    }
  };
  
  // Delete promotion
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promotion?')) {
      return;
    }
    
    try {
      setLoading(true);
      console.log(`Deleting promotion with ID ${id}`);
      
      const response = await fetch(`/api/admin/promotions?id=${id}`, {
        method: 'DELETE',
      });
      
      console.log('API Response Status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        throw new Error(`Failed to delete promotion: ${response.status} ${errorText}`);
      }
      
      // Refresh promotions
      fetchPromotions();
    } catch (err) {
      console.error('Error deleting promotion:', err);
      setError('Failed to delete promotion. Please try again.');
      setLoading(false);
    }
  };
  
  // Open modal for adding a new promotion
  const openAddModal = () => {
    setEditingPromotion(null);
    resetForm();
    setShowModal(true);
  };
  
  // Open modal for editing an existing promotion
  const openEditModal = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      title: promotion.title,
      description: promotion.description,
      imageUrl: promotion.imageUrl || '',
      active: promotion.active,
    });
    setShowModal(true);
  };
  
  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      active: true,
    });
    setEditingPromotion(null);
  };
  
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Promotions
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add New Promotion
          </button>
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
              <div className="mt-2">
                <button
                  onClick={() => {
                    setError('');
                    fetchPromotions();
                  }}
                  className="text-sm text-red-800 underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Promotions list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
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
            <p className="text-gray-500">Loading promotions...</p>
          </div>
        ) : promotions.length === 0 ? (
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No promotions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new promotion.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={openAddModal}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add New Promotion
              </button>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {promotions.map((promotion) => (
              <li key={promotion.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center text-white text-xs">
                      {promotion.imageUrl ? (
                        <img
                          src={promotion.imageUrl}
                          alt={promotion.title}
                          className="h-12 w-12 object-cover rounded"
                        />
                      ) : (
                        'Promo'
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{promotion.title}</div>
                      <div className="text-sm text-gray-500">{promotion.description}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Created: {new Date(promotion.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        promotion.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {promotion.active ? 'Active' : 'Inactive'}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(promotion.id, promotion.active)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        {promotion.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(promotion)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(promotion.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Modal using React Portal */}
      <Modal
        isOpen={showModal}
        onClose={() => !processing && setShowModal(false)}
        title={editingPromotion ? 'Edit Promotion' : 'Add New Promotion'}
        onSubmit={handleSubmit}
        submitLabel={editingPromotion ? 'Update' : 'Create'}
        isProcessing={processing}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              id="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="text"
              name="imageUrl"
              id="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="https://example.com/image.jpg"
            />
            <p className="mt-1 text-xs text-gray-500">
              Optional. Leave empty to use default promotion image.
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
              <p className="text-gray-500">Make this promotion visible on the platform</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}