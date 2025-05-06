// components/Modal.tsx
import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  processing?: boolean;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  primaryActionColor?: 'indigo' | 'green' | 'red';
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  processing = false,
  primaryActionLabel,
  onPrimaryAction,
  primaryActionColor = 'indigo',
}: ModalProps) {
  if (!isOpen) return null;

  // Prevent click on modal content from closing the modal
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const colorClasses = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    green: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    red: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <div 
      className="fixed inset-0 overflow-y-auto z-50" 
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={() => !processing && onClose()}
        ></div>

        {/* This element is to trick the browser into centering the modal contents. */}
        <span 
          className="hidden sm:inline-block sm:align-middle sm:h-screen" 
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal panel */}
        <div 
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          onClick={handleContentClick}
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              {title}
            </h3>
            <div className="mt-2">
              {children}
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {onPrimaryAction && (
              <button
                type="button"
                disabled={processing}
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                  colorClasses[primaryActionColor]
                } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={onPrimaryAction}
              >
                {processing && (
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
                {primaryActionLabel}
              </button>
            )}
            <button
              type="button"
              disabled={processing}
              className={`mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${
                processing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}