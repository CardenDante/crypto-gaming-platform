import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  headerBgColor?: string;
  headerTextColor?: string;
  footer?: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  headerBgColor = 'bg-white',
  headerTextColor = 'text-gray-900',
  footer,
  className = '',
}) => {
  return (
    <div className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}>
      {(title || subtitle) && (
        <div className={`px-4 py-5 sm:px-6 ${headerBgColor} border-b border-gray-200`}>
          {title && (
            <h3 className={`text-lg leading-6 font-medium ${headerTextColor}`}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div className="px-4 py-5 sm:p-6">
        {children}
      </div>
      
      {footer && (
        <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;