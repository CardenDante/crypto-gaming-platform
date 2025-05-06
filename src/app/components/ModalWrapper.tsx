'use client';

import React from 'react';
import { createPortal } from 'react-dom';

interface ModalWrapperProps {
  children: React.ReactNode;
  onBackdropClick?: () => void;
}

export default function ModalWrapper({ children, onBackdropClick }: ModalWrapperProps) {
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onBackdropClick}
        role="button"
        aria-label="Close modal"
      ></div>

      <div className="relative z-10 bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        {children}
      </div>
    </div>,
    document.body
  );
}
