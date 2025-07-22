import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface RequireRoleProps {
  children: React.ReactNode;
  allowed: ('client' | 'labeler' | 'admin')[];
}

export const RequireRole: React.FC<RequireRoleProps> = ({ children, allowed }) => {
  const { authState } = useAuth();

  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-[#0A0E2A] dark:via-[#0A0E2A] dark:to-[#1a1f4a] flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00FFB2]/30 border-t-[#00FFB2] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#0A0E2A] dark:text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!authState.user?.role) {
    return <Navigate to="/select-role" replace />;
  }

  if (!allowed.includes(authState.user.role)) {
    return <Navigate to={`/dashboard/${authState.user.role}`} replace />;
  }

  return <>{children}</>;
};