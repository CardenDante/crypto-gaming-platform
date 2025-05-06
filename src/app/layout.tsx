import type { Metadata } from 'next';
import './globals.css';

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
        {children}
      </body>
    </html>
  );
}