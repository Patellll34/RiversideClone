import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Studio from './components/Studio';
import AuthModal from './components/AuthModal';
import RoomModal from './components/RoomModal';

function App() {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [roomMode, setRoomMode] = useState<'create' | 'join'>('create');
  const [currentRoom, setCurrentRoom] = useState<any>(null);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const handleRoomCreated = (room: any) => {
    setCurrentRoom(room);
    setShowRoomModal(false);
  };

  const handleRoomJoined = (room: any) => {
    setCurrentRoom(room);
    setShowRoomModal(false);
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Routes>
          <Route 
            path="/" 
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LandingPage 
                  onShowAuth={(mode) => {
                    setAuthMode(mode);
                    setShowAuthModal(true);
                  }}
                />
              )
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? (
                <Dashboard 
                  onShowRoomModal={(mode) => {
                    setRoomMode(mode);
                    setShowRoomModal(true);
                  }}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/studio/:roomId" 
            element={
              user && currentRoom ? (
                <Studio 
                  room={currentRoom}
                  onLeaveRoom={handleLeaveRoom}
                />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
        </Routes>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
          onModeChange={setAuthMode}
        />

        <RoomModal
          isOpen={showRoomModal}
          onClose={() => setShowRoomModal(false)}
          mode={roomMode}
          onRoomCreated={handleRoomCreated}
          onRoomJoined={handleRoomJoined}
        />
      </div>
    </Router>
  );
}

export default App;