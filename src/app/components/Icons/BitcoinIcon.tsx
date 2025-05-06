import React from 'react';

interface BitcoinIconProps {
  size?: number;
  color?: string;
  className?: string;
}

const BitcoinIcon: React.FC<BitcoinIconProps> = ({
  size = 24,
  color = 'currentColor',
  className = '',
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`feather feather-bitcoin ${className}`}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12h6M9 8h6M9 16h6" />
      <path d="M11 8v8M13 8v8" />
      <path d="M14 10c0-1.1-.9-2-2-2H9" />
      <path d="M14 14c0 1.1-.9 2-2 2H9" />
    </svg>
  );
};

export default BitcoinIcon;