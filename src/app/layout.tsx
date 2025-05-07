// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import NextAuthSessionProvider from '@/providers/SessionProvider';
import WhatsAppButton from './components/WhatsAppButton';

export const metadata: Metadata = {
  title: 'Lagoons Gaming',
  description: 'Deposit and withdraw money for your favorite games',
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
        <WhatsAppButton phoneNumber={'254796280700'} message='I am ready to play, How do I deposit?'/>
      </body>
    </html>
  );
}