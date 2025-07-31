import React, { useState } from 'react';
import { X, Plus, Users, Copy, Check } from 'lucide-react';
import { useRoom } from '../hooks/useRoom';

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'join';
  onRoomCreated?: (room: any) => void;
  onRoomJoined?: (room: any) => void;
}

const RoomModal: React.FC<RoomModalProps> = ({ 
  isOpen, 
  onClose, 
  mode, 
  onRoomCreated, 
  onRoomJoined 
}) => {
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdRoom, setCreatedRoom] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const { createRoom, joinRoom } = useRoom();

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const room = await createRoom(roomName, roomDescription);
      setCreatedRoom(room);
      onRoomCreated?.(room);
    } catch (err: any) {
      setError(err.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const room = await joinRoom(roomCode.toUpperCase());
      onRoomJoined?.(room);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to join room');
    } finally {
      setLoading(false);
    }
  };

  const copyRoomCode = async () => {
    if (createdRoom?.room_code) {
      await navigator.clipboard.writeText(createdRoom.room_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setRoomName('');
    setRoomDescription('');
    setRoomCode('');
    setCreatedRoom(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl p-8 border border-white/10 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {mode === 'create' ? 'Create Room' : 'Join Room'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {createdRoom ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Room Created!</h3>
            <p className="text-gray-300 mb-6">Share this code with your guests:</p>
            
            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-mono font-bold text-white tracking-wider">
                  {createdRoom.room_code}
                </span>
                <button
                  onClick={copyRoomCode}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all"
            >
              Start Recording
            </button>
          </div>
        ) : (
          <form onSubmit={mode === 'create' ? handleCreateRoom : handleJoinRoom} className="space-y-4">
            {mode === 'create' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Room Name
                  </label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Enter room name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={roomDescription}
                    onChange={(e) => setRoomDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    placeholder="Describe your recording session"
                    rows={3}
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Room Code
                </label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors text-center text-lg font-mono tracking-wider"
                  placeholder="ENTER CODE"
                  required
                  maxLength={6}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all flex items-center justify-center"
            >
              {loading ? (
                'Please wait...'
              ) : (
                <>
                  {mode === 'create' ? <Plus className="w-5 h-5 mr-2" /> : <Users className="w-5 h-5 mr-2" />}
                  {mode === 'create' ? 'Create Room' : 'Join Room'}
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RoomModal;