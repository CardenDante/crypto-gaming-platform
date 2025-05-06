import React, { ReactNode } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  error,
  hint,
  required = false,
  children,
  className = '',
}) => {
  return (
    <div className={className}>
      <div className="flex justify-between">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>
      
      <div className="mt-1">
        {children}
      </div>
      
      {hint && !error && (
        <p className="mt-1 text-xs text-gray-500">
          {hint}
        </p>
      )}
      
      {error && (
        <p className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;