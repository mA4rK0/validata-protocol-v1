import React from 'react';
import { Shield, Zap, ArrowRight, Target, Database } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useParams, Navigate } from 'react-router-dom';
import { Logo, TextLogo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

export const LoginPage: React.FC = () => {
  const { login, authState } = useAuth();
  const { role } = useParams<{ role: 'client' | 'labeler' | 'admin' }>();

  // Redirect if already authenticated and has role
  if (authState.isAuthenticated && authState.user?.role) {
    return <Navigate to={`/dashboard/${authState.user.role}`} replace />;
  }

  const handleLogin = async () => {
    await login(role);
  };

  const getRoleInfo = () => {
    switch (role) {
      case 'client':
        return {
          title: 'Client Portal',
          subtitle: 'Upload datasets and manage labeling tasks',
          icon: Target,
          color: 'text-[#00FFB2]',
        };
      case 'labeler':
        return {
          title: 'Labeler Portal',
          subtitle: 'Earn rewards by labeling data',
          icon: Target,
          color: 'text-[#9B5DE5]',
        };
      case 'admin':
        return {
          title: 'Admin Portal',
          subtitle: 'Manage platform operations',
          icon: Shield,
          color: 'text-orange-500',
        };
    }
  };

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo?.icon;

  const features = [
    {
      icon: Database,
      title: 'Decentralized Data Labeling',
      description: 'Secure, transparent data processing on the Internet Computer',
    },
    {
      icon: Shield,
      title: 'Cryptographic Verification',
      description: 'Every label is verified and stored immutably on-chain',
    },
    {
      icon: Zap,
      title: 'Instant ICP Rewards',
      description: 'Get paid instantly in ICP tokens for quality contributions',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-[#0A0E2A] dark:via-[#0A0E2A] dark:to-[#1a1f4a] flex items-center justify-center p-4 transition-colors duration-300">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding */}
        <div className="text-[#0A0E2A] dark:text-white space-y-8">
          <div className="flex flex-col items-start">
            <Logo size="lg" className="mb-2" />
            <div style={{ display: 'none' }}>
              <TextLogo size="lg" />
            </div>
            <p className="text-[#00FFB2] text-sm">Web3 AI Data Platform</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold leading-tight text-[#0A0E2A] dark:text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
              {role && roleInfo ? (
                <>
                  Welcome to
                  <br />
                  <span className={roleInfo.color}>{roleInfo.title}</span>
                </>
              ) : (
                <>
                  The Future of
                  <br />
                  <span className="text-[#00FFB2]">AI Data Labeling</span>
                </>
              )}
            </h2>
            {role && roleInfo ? (
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                {roleInfo.subtitle}. Connect with Internet Identity to access your dashboard.
              </p>
            ) : (
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                Join the decentralized revolution in AI training data. Earn ICP tokens while contributing 
                to the next generation of blockchain and AI technologies.
              </p>
            )}
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#00FFB2]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0A0E2A] dark:text-white mb-1">{feature.title}</h3>
                    <p className="text-gray-700 dark:text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side - Login */}
        <div className="bg-white dark:bg-[#1a1f4a] rounded-3xl p-8 shadow-2xl transition-colors duration-300">
          {role && roleInfo && (
            <div className="text-center mb-6">
              <div className={`w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                {RoleIcon && <RoleIcon className={`w-8 h-8 ${roleInfo.color}`} />}
              </div>
              <h3 className="text-xl font-bold text-[#0A0E2A] dark:text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
                {roleInfo.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{roleInfo.subtitle}</p>
            </div>
          )}

          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-[#0A0E2A] dark:text-white mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
              {role ? `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}` : 'Welcome to Validata'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Connect with Internet Identity to get started
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#00FFB2]/10 to-[#9B5DE5]/10 p-6 rounded-2xl border border-[#00FFB2]/20">
              <div className="flex items-center space-x-3 mb-3">
                <Shield className="w-6 h-6 text-[#00FFB2]" />
                <span className="font-semibold text-[#0A0E2A] dark:text-white">Secure Authentication</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Internet Identity provides secure, anonymous authentication without passwords or personal data.
              </p>
            </div>

            <button
              onClick={handleLogin}
              disabled={authState.isLoading}
              className="w-full bg-[#00FFB2] text-[#0A0E2A] py-4 rounded-2xl font-semibold text-lg hover:bg-[#00FFB2]/90 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authState.isLoading ? (
                <div className="w-6 h-6 border-2 border-[#0A0E2A]/30 border-t-[#0A0E2A] rounded-full animate-spin" />
              ) : (
                <>
                  <span>Connect with Internet Identity</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By connecting, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[#00FFB2]">1,247</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Active Labelers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#9B5DE5]">45,230</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Labels Created</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#0A0E2A] dark:text-white">892.4</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">ICP Distributed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};