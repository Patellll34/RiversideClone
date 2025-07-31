import React, { useState, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, Monitor, Users, Settings, Phone, SwordIcon as Record, Square, Volume2, VolumeX, Camera, ArrowLeft, Share2, MoreHorizontal } from 'lucide-react';

interface StudioProps {
  onBackToDashboard: () => void;
}

const Studio: React.FC<StudioProps> = ({ onBackToDashboard }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [volume, setVolume] = useState(75);
  
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

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setRecordingTime(0);
    } else {
      setIsRecording(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Top Navigation */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onBackToDashboard}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">Recording Studio</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full max-h-[calc(100vh-120px)]">
          
          {/* Video Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              
              {/* Host Video */}
              <div className="relative bg-slate-800/50 rounded-2xl overflow-hidden border border-white/10 group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 flex items-center justify-center">
                  {videoEnabled ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <Camera className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <VideoOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">Camera Off</p>
                    </div>
                  )}
                </div>
                
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-white text-sm font-medium">You</span>
                </div>
                
                <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-white" />
                  </button>
                </div>
                
                {!audioEnabled && (
                  <div className="absolute top-4 left-4">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <MicOff className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Guest Video */}
              <div className="relative bg-slate-800/50 rounded-2xl overflow-hidden border border-white/10 group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-purple-600/20 flex items-center justify-center">
                  <div className="text-center">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg font-medium">Waiting for guest...</p>
                    <p className="text-gray-500 text-sm mt-2">Share the room link to invite guests</p>
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-white text-sm font-medium">Guest</span>
                </div>
              </div>

              {/* Screen Share Area (when active) */}
              {screenShare && (
                <div className="md:col-span-2 relative bg-slate-800/50 rounded-2xl overflow-hidden border border-white/10 min-h-[300px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 flex items-center justify-center">
                    <div className="text-center">
                      <Monitor className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                      <p className="text-white text-lg font-medium">Screen Share Active</p>
                      <p className="text-gray-400 text-sm mt-2">Your screen is being shared</p>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                    <span className="text-white text-sm font-medium">Screen Share</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Control Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 h-full">
              <h3 className="text-lg font-semibold text-white mb-6">Controls</h3>
              
              {/* Recording Controls */}
              <div className="space-y-4 mb-8">
                <button
                  onClick={toggleRecording}
                  className={`w-full flex items-center justify-center space-x-2 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 ${
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

              {/* Media Controls */}
              <div className="space-y-3 mb-8">
                <button
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    videoEnabled ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500/20 hover:bg-red-500/30'
                  }`}
                >
                  {videoEnabled ? (
                    <Video className="w-5 h-5 text-white" />
                  ) : (
                    <VideoOff className="w-5 h-5 text-red-400" />
                  )}
                  <span className="text-white">Camera</span>
                </button>

                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    audioEnabled ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500/20 hover:bg-red-500/30'
                  }`}
                >
                  {audioEnabled ? (
                    <Mic className="w-5 h-5 text-white" />
                  ) : (
                    <MicOff className="w-5 h-5 text-red-400" />
                  )}
                  <span className="text-white">Microphone</span>
                </button>

                <button
                  onClick={() => setScreenShare(!screenShare)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    screenShare ? 'bg-blue-500/20 hover:bg-blue-500/30' : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <Monitor className={`w-5 h-5 ${screenShare ? 'text-blue-400' : 'text-white'}`} />
                  <span className="text-white">Share Screen</span>
                </button>
              </div>

              {/* Volume Control */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm">Volume</span>
                  <span className="text-gray-400 text-sm">{volume}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <VolumeX className="w-4 h-4 text-gray-400" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                  <Volume2 className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Session Info */}
              <div className="space-y-3">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Session Quality</p>
                  <p className="text-white text-sm">4K • 48kHz</p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Participants</p>
                  <p className="text-white text-sm">1 of 10</p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Local Recording</p>
                  <p className="text-green-400 text-sm">● Active</p>
                </div>
              </div>

              {/* End Session */}
              <button className="w-full mt-6 flex items-center justify-center space-x-2 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors">
                <Phone className="w-4 h-4" />
                <span>End Session</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio;