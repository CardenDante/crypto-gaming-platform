'use client';

import React from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitLabel?: string;
  submitColor?: 'green' | 'red' | 'indigo';
  isProcessing?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = 'Submit',
  submitColor = 'indigo',
  isProcessing = false,
}: ModalProps) {
  // Don't render anything if not open or if running on server
  if (!isOpen || typeof window === 'undefined') {
    return null;
  }

  // Define button color class based on submitColor prop
  let buttonColorClass = 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500';
  if (submitColor === 'green') {
    buttonColorClass = 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
  } else if (submitColor === 'red') {
    buttonColorClass = 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
  }

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto">
      {/* Backdrop with click handler */}
      <div 
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={!isProcessing ? onClose : undefined}
        aria-hidden="true"
      ></div>
      
      {/* Modal content container */}
      <div className="relative z-10 bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full mx-4">
        {/* Header */}
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {title}
          </h3>
          
          {/* Modal content */}
          <div className="mt-3">
            {children}
          </div>
        </div>
        
        {/* Footer with action buttons */}
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          {onSubmit && (
            <button
              type="button"
              onClick={onSubmit}
              disabled={isProcessing}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${buttonColorClass} text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                isProcessing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isProcessing && (
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
              )}
              {submitLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className={`mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}