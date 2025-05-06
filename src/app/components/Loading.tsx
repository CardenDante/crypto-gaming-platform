import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  text?: string;
  fullPage?: boolean;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  color = 'primary',
  text,
  fullPage = false,
  className = '',
}) => {
  // Size mappings
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  // Color mappings
  const colorMap = {
    primary: 'text-indigo-600',
    white: 'text-white',
    gray: 'text-gray-500'
  };
  
  // Create the spinner
  const spinner = (
    <svg
      className={`animate-spin ${sizeMap[size]} ${colorMap[color]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
  
  // Full page loading spinner
  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="flex flex-col items-center">
          {spinner}
          {text && <p className="mt-4 text-gray-600">{text}</p>}
        </div>
      </div>
    );
  }
  
  // Regular spinner with optional text
  return (
    <div className="flex items-center">
      {spinner}
      {text && <span className="ml-3 text-sm text-gray-500">{text}</span>}
    </div>
  );
};

export default Loading;