import React from 'react';
import { Target, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Logo, TextLogo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

export const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'client' as const,
      title: 'Client',
      subtitle: 'Data Requester',
      description: 'Upload datasets and create labeling tasks for the community',
      icon: Target,
      color: 'from-[#00FFB2] to-[#00FFB2]/80',
      features: [
        'Upload datasets (CSV, JSON)',
        'Create custom labeling tasks',
        'Track progress in real-time',
        'Manage escrow & payments',
        'Download verified results',
      ],
    },
    {
      id: 'labeler' as const,
      title: 'Labeler',
      subtitle: 'Task Worker',
      description: 'Earn ICP tokens by contributing high-quality data labels',
      icon: Target,
      color: 'from-[#9B5DE5] to-[#9B5DE5]/80',
      features: [
        'Browse task marketplace',
        'Earn ICP for quality work',
        'Build reputation & level up',
        'Stake tokens for better tasks',
        'Instant reward claims',
      ],
    },
  ];

  const handleRoleSelect = async (roleId: 'client' | 'labeler' | 'admin') => {
    navigate(`/login/${roleId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-[#0A0E2A] dark:via-[#0A0E2A] dark:to-[#1a1f4a] flex items-center justify-center p-4 transition-colors duration-300">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <div className="flex flex-col items-center justify-center mb-6">
            <Logo size="lg" className="mb-2" />
            <div style={{ display: 'none' }}>
              <TextLogo size="lg" />
            </div>
            <p className="text-[#00FFB2] text-sm">Web3 AI Data Platform</p>
          </div>
        </div>

        <h2 className="text-4xl font-bold text-[#0A0E2A] dark:text-white mb-4 text-center" style={{ fontFamily: 'Sora, sans-serif' }}>
          Choose Your Role
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg max-w-2xl mx-auto text-center mb-12">
          Select your role to access the appropriate dashboard and start your journey.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                className="bg-white dark:bg-[#1a1f4a] rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${role.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0A0E2A] dark:text-white mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
                    {role.title}
                  </h3>
                  <p className="text-[#9B5DE5] font-medium text-sm">{role.subtitle}</p>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-center mb-6 leading-relaxed">
                  {role.description}
                </p>

                <div className="space-y-3 mb-8">
                  {role.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#00FFB2] rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleRoleSelect(role.id)}
                  className="w-full bg-[#00FFB2] text-[#0A0E2A] py-3 rounded-2xl font-semibold hover:bg-[#00FFB2]/90 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Select {role.title} Role</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};