'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  title = 'Crypto Gaming Payment System' 
}) => {
  const pathname = usePathname();
  
  const isActive = (route: string) => {
    if (route === '/' && pathname === '/') return true;
    if (route !== '/' && pathname?.startsWith(route)) return true;
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link 
                href="/" 
                className="flex-shrink-0 flex items-center text-white font-bold text-xl"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                LagoonsGaming
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <Link 
                href="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/') 
                    ? 'text-white bg-indigo-800' 
                    : 'text-indigo-100 hover:bg-indigo-700'
                }`}
              >
                Home
              </Link>
              <Link 
                href="/deposit" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/deposit') 
                    ? 'text-white bg-indigo-800' 
                    : 'text-indigo-100 hover:bg-indigo-700'
                }`}
              >
                Deposit
              </Link>
              <Link 
                href="/withdraw" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/withdraw') 
                    ? 'text-white bg-indigo-800' 
                    : 'text-indigo-100 hover:bg-indigo-700'
                }`}
              >
                Withdraw
              </Link>
              <Link 
                href="/dashboard" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/dashboard') 
                    ? 'text-white bg-indigo-800' 
                    : 'text-indigo-100 hover:bg-indigo-700'
                }`}
              >
                Dashboard
              </Link>
            </nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                type="button"
                className="mobile-menu-button inline-flex items-center justify-center p-2 rounded-md text-indigo-100 hover:text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
                onClick={() => {
                  const menu = document.getElementById('mobile-menu');
                  if (menu) {
                    menu.classList.toggle('hidden');
                  }
                }}
              >
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className="hidden md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') 
                  ? 'text-white bg-indigo-800' 
                  : 'text-indigo-100 hover:bg-indigo-700'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/deposit" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/deposit') 
                  ? 'text-white bg-indigo-800' 
                  : 'text-indigo-100 hover:bg-indigo-700'
              }`}
            >
              Deposit
            </Link>
            <Link 
              href="/withdraw" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/withdraw') 
                  ? 'text-white bg-indigo-800' 
                  : 'text-indigo-100 hover:bg-indigo-700'
              }`}
            >
              Withdraw
            </Link>
            <Link 
              href="/dashboard" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/dashboard') 
                  ? 'text-white bg-indigo-800' 
                  : 'text-indigo-100 hover:bg-indigo-700'
              }`}
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <p className="text-sm">© {new Date().getFullYear()} LagoonsGaming Payment System</p>
            </div>
            <div className="mt-4 md:mt-0 flex justify-center md:justify-end space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Terms of Service</span>
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Privacy Policy</span>
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Support</span>
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;