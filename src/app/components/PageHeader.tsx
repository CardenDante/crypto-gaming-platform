import React, { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  gradient?: boolean;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  gradient = false,
  className = '',
}) => {
  const baseClasses = 'px-4 py-5 sm:px-6 flex flex-wrap justify-between items-center';
  const bgClasses = gradient 
    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
    : 'bg-white text-gray-900';
  
  return (
    <div className={`${baseClasses} ${bgClasses} ${className}`}>
      <div>
        <h1 className={`text-xl font-bold ${gradient ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h1>
        {subtitle && (
          <p className={`mt-1 text-sm ${gradient ? 'text-indigo-100' : 'text-gray-500'}`}>
            {subtitle}
          </p>
        )}
      </div>
      
      {actions && (
        <div className="mt-4 sm:mt-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;