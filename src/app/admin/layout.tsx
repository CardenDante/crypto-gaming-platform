'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [status, router, pathname]);
  
  // Don't show admin layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-10 w-10 text-indigo-600 mb-4"
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
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }
  
  // Check if authenticated
  if (status !== 'authenticated') {
    return null;
  }
  
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/admin" className="text-white font-bold text-xl">
                  Admin Dashboard
                </Link>
              </div>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              <Link
                href="/admin"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin') && !isActive('/admin/games') && !isActive('/admin/promotions') && !isActive('/admin/config') && !isActive('/admin/users')
                    ? 'bg-indigo-800 text-white'
                    : 'text-indigo-100 hover:bg-indigo-600'
                }`}
              >
                Transactions
              </Link>
              <Link
                href="/admin/games"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/games')
                    ? 'bg-indigo-800 text-white'
                    : 'text-indigo-100 hover:bg-indigo-600'
                }`}
              >
                Games
              </Link>
              <Link
                href="/admin/promotions"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/promotions')
                    ? 'bg-indigo-800 text-white'
                    : 'text-indigo-100 hover:bg-indigo-600'
                }`}
              >
                Promotions
              </Link>
              <Link
                href="/admin/config"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/config')
                    ? 'bg-indigo-800 text-white'
                    : 'text-indigo-100 hover:bg-indigo-600'
                }`}
              >
                Settings
              </Link>
              <Link
                href="/admin/users"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/users')
                    ? 'bg-indigo-800 text-white'
                    : 'text-indigo-100 hover:bg-indigo-600'
                }`}
              >
                Users
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-indigo-100 hover:text-white text-sm font-medium"
              >
                View Site
              </Link>
              
              <div className="hidden md:block">
                <button
                  onClick={() => {
                    // Sign out
                    router.push('/api/auth/signout');
                  }}
                  className="px-3 py-2 rounded-md text-sm font-medium text-indigo-100 hover:bg-indigo-600"
                >
                  Sign Out
                </button>
              </div>
              
              {/* Mobile menu button */}
              <div className="md:hidden -mr-2">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-indigo-100 hover:text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <span className="sr-only">Open main menu</span>
                  <svg
                    className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  <svg
                    className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/admin"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/admin') && !isActive('/admin/games') && !isActive('/admin/promotions') && !isActive('/admin/config') && !isActive('/admin/users')
                  ? 'bg-indigo-800 text-white'
                  : 'text-indigo-100 hover:bg-indigo-600'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Transactions
            </Link>
            <Link
              href="/admin/games"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/admin/games')
                  ? 'bg-indigo-800 text-white'
                  : 'text-indigo-100 hover:bg-indigo-600'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Games
            </Link>
            <Link
              href="/admin/promotions"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/admin/promotions')
                  ? 'bg-indigo-800 text-white'
                  : 'text-indigo-100 hover:bg-indigo-600'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Promotions
            </Link>
            <Link
              href="/admin/config"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/admin/config')
                  ? 'bg-indigo-800 text-white'
                  : 'text-indigo-100 hover:bg-indigo-600'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Settings
            </Link>
            <Link
              href="/admin/users"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/admin/users')
                  ? 'bg-indigo-800 text-white'
                  : 'text-indigo-100 hover:bg-indigo-600'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Users
            </Link>
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-indigo-100 hover:bg-indigo-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              View Site
            </Link>
            <button
              onClick={() => {
                // Sign out
                router.push('/api/auth/signout');
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-indigo-100 hover:bg-indigo-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      
      {/* Main content */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}