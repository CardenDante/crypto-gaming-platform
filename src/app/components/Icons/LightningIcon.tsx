import React from 'react';

interface LightningIconProps {
  size?: number;
  color?: string;
  className?: string;
}

const LightningIcon: React.FC<LightningIconProps> = ({
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
      className={`feather feather-zap ${className}`}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
};

export default LightningIcon;