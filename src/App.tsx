import { useState } from 'react';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import LandingPage from './components/LandingPage';

function AppContent() {
  const { user, loading } = useAuth();
  const [showAuthPage, setShowAuthPage] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (!showAuthPage) {
      return <LandingPage onGetStarted={() => setShowAuthPage(true)} />;
    }
    return <AuthPage onBack={() => setShowAuthPage(false)} />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
