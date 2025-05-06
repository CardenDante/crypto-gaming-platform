import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  // Base button classes
  const baseClasses = 'inline-flex items-center justify-center border font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Variant styles
  const variantClasses = {
    primary: 'border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'border-transparent text-white bg-gray-600 hover:bg-gray-700 focus:ring-gray-500',
    success: 'border-transparent text-white bg-green-600 hover:bg-green-700 focus:ring-green-500',
    danger: 'border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
    outline: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500'
  };
  
  // Size styles
  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  // Disabled styles
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  // Width styles
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Icon spacing
  const iconSpacing = icon && children ? 'space-x-2' : '';
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${widthClasses} ${iconSpacing} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  );
};

export default Button;