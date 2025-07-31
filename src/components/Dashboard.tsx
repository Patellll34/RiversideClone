import React, { useState } from 'react';
import { Plus, Play, Users, Settings, LogOut, Clock, Calendar, Mic, Video, MoreVertical } from 'lucide-react';

interface DashboardProps {
  user: string;
  onLogout: () => void;
  onStartRecording: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onStartRecording }) => {
  const [activeTab, setActiveTab] = useState<'recordings' | 'scheduled'>('recordings');

  const mockRecordings = [
    {
      id: 1,
      title: "Tech Talk with Sarah Chen",
      duration: "1h 23m",
      date: "2024-01-15",
      type: "video",
      participants: 2,
      status: "completed"
    },
    {
      id: 2,
      title: "Marketing Strategy Deep Dive",
      duration: "45m",
      date: "2024-01-12",
      type: "audio",
      participants: 3,
      status: "completed"
    },
    {
      id: 3,
      title: "Product Launch Discussion",
      duration: "2h 15m",
      date: "2024-01-10",
      type: "video",
      participants: 4,
      status: "processing"
    }
  ];

  const mockScheduled = [
    {
      id: 1,
      title: "Weekly Team Standup",
      date: "2024-01-18",
      time: "10:00 AM",
      participants: ["John", "Sarah", "Mike"]
    },
    {
      id: 2,
      title: "Client Interview Session",
      date: "2024-01-20",
      time: "2:00 PM",
      participants: ["Alex", "Client"]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Riverside</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {user}</span>
              <button className="text-gray-300 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={onLogout}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Your Studio</h1>
            <p className="text-gray-300">Manage your recordings and create new content</p>
          </div>
          
          <div className="flex gap-3 mt-4 md:mt-0">
            <button className="flex items-center px-4 py-2 border border-white/30 hover:border-white/50 text-white rounded-lg transition-all hover:bg-white/10">
              <Users className="w-4 h-4 mr-2" />
              Invite Guest
            </button>
            <button 
              onClick={onStartRecording}
              className="flex items-center px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all transform hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Recording
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Recordings</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Duration</p>
                <p className="text-2xl font-bold text-white">18h 45m</p>
              </div>
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">This Month</p>
                <p className="text-2xl font-bold text-white">5 sessions</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-white/5 backdrop-blur-sm rounded-lg p-1 border border-white/10 w-fit">
          <button
            onClick={() => setActiveTab('recordings')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              activeTab === 'recordings'
                ? 'bg-white/20 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Recent Recordings
          </button>
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              activeTab === 'scheduled'
                ? 'bg-white/20 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Scheduled Sessions
          </button>
        </div>

        {/* Content */}
        {activeTab === 'recordings' && (
          <div className="space-y-4">
            {mockRecordings.map((recording) => (
              <div key={recording.id} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      recording.type === 'video' ? 'bg-purple-500/20' : 'bg-cyan-500/20'
                    }`}>
                      {recording.type === 'video' ? (
                        <Video className={`w-6 h-6 ${recording.type === 'video' ? 'text-purple-400' : 'text-cyan-400'}`} />
                      ) : (
                        <Mic className={`w-6 h-6 ${recording.type === 'video' ? 'text-purple-400' : 'text-cyan-400'}`} />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{recording.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{recording.duration}</span>
                        <span>•</span>
                        <span>{recording.date}</span>
                        <span>•</span>
                        <span>{recording.participants} participants</span>
                        <span>•</span>
                        <span className={`capitalize ${
                          recording.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          {recording.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Play className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'scheduled' && (
          <div className="space-y-4">
            {mockScheduled.map((session) => (
              <div key={session.id} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{session.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{session.date}</span>
                      <span>•</span>
                      <span>{session.time}</span>
                      <span>•</span>
                      <span>{session.participants.join(', ')}</span>
                    </div>
                  </div>
                  
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                    Join Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;