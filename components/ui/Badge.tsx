interface BadgeProps {
  children: React.ReactNode;
  variant: 'success' | 'warning' | 'error';
}

export default function Badge({ children, variant }: BadgeProps) {
  const variantClass = {
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error'
  }[variant];
  
  return (
    <span className={`badge ${variantClass}`}>
      {children}
    </span>
  );
}
