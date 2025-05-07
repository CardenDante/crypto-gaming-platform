import React from 'react';
import DepositClient from './page-client';

export const metadata = {
  title: 'Deposit - Lagoons Gaming',
  description: 'Make a Bitcoin or Lightning Network deposit to your gaming account',
};

export default function DepositPage() {
  return <DepositClient />;
}