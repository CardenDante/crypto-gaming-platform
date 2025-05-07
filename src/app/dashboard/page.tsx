import React from 'react';
import DashboardClient from './page-client';

export const metadata = {
  title: 'Dashboard - Skywinners Gaming',
  description: 'View your transaction history and account balance',
};

export default function DashboardPage() {
  return <DashboardClient />;
}