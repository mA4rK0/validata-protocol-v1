import React from 'react';
import { Database, Shield, Zap, ArrowRight, Users, Target, TrendingUp, Award, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo, TextLogo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../hooks/useTheme';

export const LandingPage: React.FC = () => {
  const { theme } = useTheme();

  const features = [
    {
      icon: Database,
      title: 'Decentralized Data Labeling',
      description: 'Secure, transparent data processing on the Internet Computer blockchain',
    },
    {
      icon: Shield,
      title: 'Cryptographic Verification',
      description: 'Every label is verified and stored immutably on-chain with full transparency',
    },
    {
      icon: Zap,
      title: 'Instant ICP Rewards',
      description: 'Get paid instantly in ICP tokens for quality contributions and accurate labeling',
    },
    {
      icon: TrendingUp,
      title: 'AI-Powered Quality Control',
      description: 'Advanced algorithms ensure high-quality datasets for machine learning models',
    },
  ];

  const stats = [
    { label: 'Active Labelers', value: '1,247', icon: Users },
    { label: 'Labels Created', value: '45,230', icon: Target },
    { label: 'ICP Distributed', value: '892.4', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-[#0A0E2A] dark:via-[#0A0E2A] dark:to-[#1a1f4a] transition-colors duration-300">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Logo */}
            <div className="flex flex-col items-center justify-center mb-8">
              <Logo size="xl" className="mb-4" />
              <div style={{ display: 'none' }}>
                <TextLogo size="xl" />
              </div>
              <p className="text-[#00FFB2] text-lg mt-2">Web3 AI Data Platform</p>
            </div>

            {/* Main Heading */}
            <h2 className="text-5xl md:text-6xl font-bold text-[#0A0E2A] dark:text-white mb-6 leading-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
              The Future of
              <br />
              <span className="text-[#00FFB2]">AI Data Labeling</span>
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join the decentralized revolution in AI training data. Earn ICP tokens while contributing 
              to the next generation of blockchain and AI technologies on the Internet Computer.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to="/select-role"
                className="bg-[#00FFB2] text-[#0A0E2A] px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-[#00FFB2]/90 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="border-2 border-[#00FFB2] text-[#00FFB2] px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-[#00FFB2]/10 transition-all duration-200">
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white dark:bg-white/10 dark:backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-white/20 shadow-lg dark:shadow-none">
                    <Icon className="w-8 h-8 text-[#00FFB2] mx-auto mb-3" />
                    <div className="text-3xl font-bold text-[#0A0E2A] dark:text-white mb-1">{stat.value}</div>
                    <div className="text-gray-600 dark:text-gray-300 text-sm">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-100 dark:bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-[#0A0E2A] dark:text-white mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
              Why Choose Validata?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Experience the next generation of data labeling with blockchain security and AI precision
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white dark:bg-white/10 dark:backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/15 transition-all duration-300 shadow-lg dark:shadow-none">
                  <div className="w-12 h-12 bg-[#00FFB2]/20 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#00FFB2]" />
                  </div>
                  <h4 className="text-lg font-semibold text-[#0A0E2A] dark:text-white mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-[#0A0E2A] dark:text-white mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
              How It Works
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Simple steps to start earning or get your data labeled
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* For Clients */}
            <div className="bg-white dark:bg-white/10 dark:backdrop-blur-sm rounded-3xl p-8 border border-gray-200 dark:border-white/20 shadow-lg dark:shadow-none">
              <div className="flex items-center space-x-3 mb-6">
                <Database className="w-8 h-8 text-[#00FFB2]" />
                <h4 className="text-2xl font-bold text-[#0A0E2A] dark:text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
                  For Data Requesters
                </h4>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#00FFB2] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#0A0E2A] text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h5 className="text-[#0A0E2A] dark:text-white font-medium mb-1">Upload Your Dataset</h5>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Upload CSV or JSON files with your unlabeled data</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#00FFB2] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#0A0E2A] text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h5 className="text-[#0A0E2A] dark:text-white font-medium mb-1">Create Labeling Task</h5>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Define instructions and set rewards for labelers</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#00FFB2] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#0A0E2A] text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h5 className="text-[#0A0E2A] dark:text-white font-medium mb-1">Get Quality Results</h5>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Download verified, high-quality labeled datasets</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Labelers */}
            <div className="bg-white dark:bg-white/10 dark:backdrop-blur-sm rounded-3xl p-8 border border-gray-200 dark:border-white/20 shadow-lg dark:shadow-none">
              <div className="flex items-center space-x-3 mb-6">
                <Target className="w-8 h-8 text-[#9B5DE5]" />
                <h4 className="text-2xl font-bold text-[#0A0E2A] dark:text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
                  For Task Workers
                </h4>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#9B5DE5] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h5 className="text-[#0A0E2A] dark:text-white font-medium mb-1">Browse Tasks</h5>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Find tasks that match your skills and interests</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#9B5DE5] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h5 className="text-[#0A0E2A] dark:text-white font-medium mb-1">Complete Labeling</h5>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Label data according to provided instructions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#9B5DE5] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h5 className="text-[#0A0E2A] dark:text-white font-medium mb-1">Earn ICP Rewards</h5>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Get paid instantly for quality work</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gray-100 dark:bg-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-[#0A0E2A] dark:text-white mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
            Ready to Get Started?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
            Choose your role and join the future of AI data labeling
          </p>
          
          <Link
            to="/select-role"
            className="inline-flex items-center bg-[#00FFB2] text-[#0A0E2A] px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-[#00FFB2]/90 transition-all duration-200 space-x-2"
          >
            <span>Choose Your Role</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};