import React from 'react';
import { useTheme } from '../hooks/useTheme';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const { theme } = useTheme();
  
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-20'
  };

  const logoSrc = theme === 'dark' ? '/logo-dark.png' : '/logo-light.png';

  return (
    <img
      src={logoSrc}
      alt="Validata Logo"
      className={`${sizeClasses[size]} w-auto object-contain ${className}`}
      onError={(e) => {
        // Fallback to text logo if image fails to load
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const fallback = target.nextElementSibling as HTMLElement;
        if (fallback) {
          fallback.style.display = 'block';
        }
      }}
    />
  );
};

// Fallback text logo component
export const TextLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-[#00FFB2] rounded-lg flex items-center justify-center">
        <span className="text-[#0A0E2A] font-bold text-sm">V</span>
      </div>
      <span className={`font-bold text-[#0A0E2A] dark:text-white ${sizeClasses[size]}`} style={{ fontFamily: 'Sora, sans-serif' }}>
        Validata
      </span>
    </div>
  );
};