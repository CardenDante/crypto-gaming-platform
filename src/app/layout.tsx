import type { Metadata } from 'next';
import './globals.css';
import NextAuthSessionProvider from '@/providers/SessionProvider';

export const metadata: Metadata = {
  title: 'Skywinners Gaming',
  description: 'Deposit and withdraw money for your favorite games',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="overflow-x-hidden max-w-full">
        <NextAuthSessionProvider>
          {children}
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}