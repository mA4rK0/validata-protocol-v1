import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import { ThemeProvider } from './components/ThemeProvider';
import { RequireRole } from './components/RequireRole';
import { useAuth } from './hooks/useAuth';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { RoleSelection } from './components/RoleSelection';
import { ClientDashboard } from './pages/ClientDashboard';
import { LabelerDashboard } from './pages/LabelerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

const AppContent: React.FC = () => {
  const { authState } = useAuth();

  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0E2A] via-[#0A0E2A] to-[#1a1f4a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00FFB2]/30 border-t-[#00FFB2] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Connecting to Internet Identity...</p>
        </div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/select-role" element={<RoleSelection />} />
        <Route path="/login/:role" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  if (!authState.user?.role) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/select-role" element={<RoleSelection />} />
        <Route path="/login/:role" element={<LoginPage />} />
        <Route path="*" element={<RoleSelection />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/dashboard/${authState.user.role}`} replace />} />
      <Route 
        path="/dashboard/client" 
        element={
          <RequireRole allowed={['client']}>
            <ClientDashboard />
          </RequireRole>
        } 
      />
      <Route 
        path="/dashboard/labeler" 
        element={
          <RequireRole allowed={['labeler']}>
            <LabelerDashboard />
          </RequireRole>
        } 
      />
      <Route 
        path="/dashboard/admin" 
        element={
          <RequireRole allowed={['admin']}>
            <AdminDashboard />
          </RequireRole>
        } 
      />
      <Route path="/select-role" element={<RoleSelection />} />
      <Route path="*" element={<Navigate to={`/dashboard/${authState.user.role}`} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;