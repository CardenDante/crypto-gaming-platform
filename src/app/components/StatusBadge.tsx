import React from 'react';

type StatusType = 'pending' | 'completed' | 'rejected' | 'processing';
type TransactionType = 'deposit' | 'withdrawal';

interface StatusBadgeProps {
  status: StatusType;
  type?: TransactionType;
  size?: 'sm' | 'md';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type,
  size = 'sm',
  className = '',
}) => {
  // Status color mapping
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    processing: 'bg-blue-100 text-blue-800'
  };
  
  // Transaction type color mapping
  const typeColors = {
    deposit: 'bg-green-100 text-green-800',
    withdrawal: 'bg-blue-100 text-blue-800'
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };
  
  // Get the appropriate color based on status or type
  const colorClass = type ? typeColors[type] : statusColors[status];
  
  // Format the label (capitalize first letter)
  const label = type 
    ? type.charAt(0).toUpperCase() + type.slice(1)
    : status.charAt(0).toUpperCase() + status.slice(1);
  
  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClasses[size]} ${className}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;