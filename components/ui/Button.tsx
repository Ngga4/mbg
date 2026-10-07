import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export default function Button({ 
  children, 
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props 
}: ButtonProps) {
  const baseClass = 'glass-input font-medium transition-all focus-ring disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClass = {
    primary: 'bg-[var(--accent-primary)] text-white hover:bg-opacity-90 border-[var(--accent-primary)]',
    secondary: 'border-[var(--glass-border-hover)] hover:border-[var(--accent-primary)]',
    ghost: 'border-transparent hover:bg-[var(--glass-bg-hover)]'
  }[variant];
  
  const sizeClass = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3'
  }[size];
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button 
      className={`${baseClass} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
