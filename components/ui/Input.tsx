import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ 
  label, 
  error, 
  className = '',
  ...props 
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <input 
        className={`glass-input w-full ${error ? 'border-[var(--status-error)]' : ''} ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-[var(--status-error)]">{error}</span>
      )}
    </div>
  );
}
