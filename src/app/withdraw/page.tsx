import React from 'react';
import WithdrawClient from './page-client';

export const metadata = {
  title: 'Withdraw - Crypto Gaming Payment System',
  description: 'Withdraw your funds to your Bitcoin or Lightning Network wallet',
};

export default function WithdrawPage() {
  return <WithdrawClient />;
}