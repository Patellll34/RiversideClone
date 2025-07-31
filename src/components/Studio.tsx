import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, VideoOff, Mic, MicOff, Monitor, Users, Settings, Phone, Square, Volume2, VolumeX, Camera, ArrowLeft, Share2, MoreHorizontal, SwordIcon as Record, Copy, Check } from 'lucide-react';
import { useRoom } from '../hooks/useRoom';
import VideoCall from './VideoCall';

interface StudioProps {
  room: any;
  onLeaveRoom: () => void;
}

const Studio: React.FC<StudioProps> = ({ room, onLeaveRoom }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentRecording, setCurrentRecording] = useState<any>(null);
  const [showRoomCode, setShowRoomCode] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const navigate = useNavigate();
  const { participants, startRecording, stopRecording, leaveRoom } = useRoom();
  const recordingRef = useRef<any>(null);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

const toggleRecording = async () => {
  if (isRecording) {
    try {
      if (currentRecording) {
        await stopRecording(currentRecording.id, recordingTime);
      }
      setIsRecording(false);
      setRecordingTime(0);
      setCurrentRecording(null);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  } else {
    try {
      const recording = await startRecording(`${room.name} - ${new Date().toLocaleString()}`);
      setCurrentRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }
};


  const handleLeaveRoom = async () => {
    if (isRecording && currentRecording) {
      await stopRecording(currentRecording.id, recordingTime);
    }
    await leaveRoom();
    onLeaveRoom();
    navigate('/dashboard');
  };

  const copyRoomCode = async () => {
    await navigator.clipboard.writeText(room.room_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Top Navigation */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLeaveRoom}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">{room.name}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowRoomCode(!showRoomCode)}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
            >
              <span className="text-white text-sm font-mono">{room.room_code}</span>
              <button onClick={copyRoomCode} className="text-gray-300 hover:text-white">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </button>
            
            {isRecording && (
              <div className="flex items-center space-x-2 bg-red-500/20 px-4 py-2 rounded-lg">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-white font-mono">{formatTime(recordingTime)}</span>
              </div>
            )}
            
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Share2 className="w-5 h-5 text-gray-300" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="h-full max-h-[calc(100vh-120px)] bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
          <VideoCall
            roomId={room.id}
            participants={participants}
            onEndCall={handleLeaveRoom}
          />
        </div>
      </div>

      {/* Recording Controls Overlay */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <button
          onClick={toggleRecording}
          className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
            isRecording
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white'
          }`}
        >
          {isRecording ? (
            <>
              <Square className="w-5 h-5" />
              <span>Stop Recording</span>
            </>
          ) : (
            <>
              <Record className="w-5 h-5" />
              <span>Start Recording</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Studio;