import React, { useEffect, useRef, useState } from 'react';
import { Video, VideoOff, Mic, MicOff, Monitor, Phone, Settings, Users, Volume2, VolumeX } from 'lucide-react';
import { useWebRTC } from '../hooks/useWebRTC';

interface VideoCallProps {
  roomId: string;
  participants: any[];
  onEndCall: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ roomId, participants, onEndCall }) => {
  const {
    localStream,
    remoteStreams,
    mediaState,
    localVideoRef,
    getLocalStream,
    toggleVideo,
    toggleAudio,
    startScreenShare,
    stopScreenShare,
  } = useWebRTC();

  const [volume, setVolume] = useState(75);
  const [showSettings, setShowSettings] = useState(false);
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  useEffect(() => {
    // Initialize local stream
    getLocalStream({ video: true, audio: true });
  }, [getLocalStream]);

  useEffect(() => {
    // Update remote video elements
    remoteStreams.forEach((stream, peerId) => {
      const videoElement = remoteVideoRefs.current.get(peerId);
      if (videoElement) {
        videoElement.srcObject = stream;
      }
    });
  }, [remoteStreams]);

  const handleScreenShare = () => {
    if (mediaState.screen) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Video Grid */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
          
          {/* Local Video */}
          <div className="relative bg-slate-800/50 rounded-2xl overflow-hidden border border-white/10 group">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            
            {!mediaState.video && (
              <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <VideoOff className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-white font-medium">You</p>
                </div>
              </div>
            )}
            
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
              <span className="text-white text-sm font-medium">You</span>
            </div>
            
            {!mediaState.audio && (
              <div className="absolute top-4 left-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <MicOff className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </div>

          {/* Remote Videos */}
          {Array.from(remoteStreams.entries()).map(([peerId, stream]) => (
            <div key={peerId} className="relative bg-slate-800/50 rounded-2xl overflow-hidden border border-white/10 group">
              <video
                ref={(el) => {
                  if (el) {
                    remoteVideoRefs.current.set(peerId, el);
                    el.srcObject = stream;
                  }
                }}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                <span className="text-white text-sm font-medium">Guest {peerId.slice(0, 4)}</span>
              </div>
            </div>
          ))}

          {/* Empty Slots */}
          {participants.length < 4 && (
            <div className="relative bg-slate-800/30 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center">
              <div className="text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">Waiting for guests...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-black/30 backdrop-blur-md border-t border-white/10 p-4">
        <div className="flex items-center justify-center space-x-4">
          
          {/* Audio Toggle */}
          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full transition-all ${
              mediaState.audio
                ? 'bg-white/20 hover:bg-white/30 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {mediaState.audio ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </button>

          {/* Video Toggle */}
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition-all ${
              mediaState.video
                ? 'bg-white/20 hover:bg-white/30 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {mediaState.video ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={handleScreenShare}
            className={`p-4 rounded-full transition-all ${
              mediaState.screen
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            <Monitor className="w-6 h-6" />
          </button>

          {/* Volume Control */}
          <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
            <VolumeX className="w-5 h-5 text-white" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 h-2 bg-white/30 rounded-lg appearance-none cursor-pointer"
            />
            <Volume2 className="w-5 h-5 text-white" />
          </div>

          {/* Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-4 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all"
          >
            <Settings className="w-6 h-6" />
          </button>

          {/* End Call */}
          <button
            onClick={onEndCall}
            className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all"
          >
            <Phone className="w-6 h-6" />
          </button>
        </div>

        {/* Participants Count */}
        <div className="flex items-center justify-center mt-4">
          <div className="bg-white/10 rounded-full px-4 py-2 flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-300" />
            <span className="text-gray-300 text-sm">
              {participants.length} participant{participants.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;