import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';

function AppContent() {
  const [showAuth, setShowAuth] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  if (showAuth) {
    return <AuthPage onBack={() => setShowAuth(false)} />;
  }

  return <LandingPage onGetStarted={() => setShowAuth(true)} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
