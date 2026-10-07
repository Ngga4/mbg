import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
  onClick?: () => void;
}

export default function GlassCard({ 
  children, 
  className = '', 
  elevated = false,
  onClick 
}: GlassCardProps) {
  const baseClass = elevated ? 'glass-card glass-card-elevated' : 'glass-card';
  const clickable = onClick ? 'cursor-pointer' : '';
  
  return (
    <div 
      className={`${baseClass} ${clickable} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
