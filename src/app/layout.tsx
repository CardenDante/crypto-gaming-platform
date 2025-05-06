// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import NextAuthSessionProvider from '@/providers/SessionProvider';

export const metadata: Metadata = {
  title: 'Crypto Gaming Payment System',
  description: 'Deposit and withdraw cryptocurrency for your favorite games',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextAuthSessionProvider>
          {children}
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}