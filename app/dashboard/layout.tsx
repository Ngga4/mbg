import { ReactNode } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Gradient orbs */}
      <div className="gradient-orb gradient-orb-1"></div>
      <div className="gradient-orb gradient-orb-2"></div>
      
      <DashboardSidebar />
      
      <div className="ml-64">
        {children}
      </div>
    </div>
  );
}
