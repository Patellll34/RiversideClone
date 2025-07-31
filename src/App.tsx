import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Studio from './components/Studio';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'studio'>('landing');
  const [user, setUser] = useState<string | null>(null);

  const handleLogin = (username: string) => {
    setUser(username);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
  };

  const handleStartRecording = () => {
    setCurrentView('studio');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {currentView === 'landing' && (
        <LandingPage onLogin={handleLogin} />
      )}
      {currentView === 'dashboard' && user && (
        <Dashboard 
          user={user} 
          onLogout={handleLogout}
          onStartRecording={handleStartRecording}
        />
      )}
      {currentView === 'studio' && (
        <Studio onBackToDashboard={handleBackToDashboard} />
      )}
    </div>
  );
}

export default App;