import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Play, 
  Pause, 
  SkipForward, 
  Volume2, 
  Mic, 
  MicOff,
  Camera,
  CameraOff,
  Share2,
  Settings,
  Crown,
  Heart,
  MessageCircle,
  Zap,
  Radio,
  Headphones,
  Music,
  UserPlus,
  Copy,
  ExternalLink
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';

// Interfaces para sesiones colaborativas
interface User {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  isOnline: boolean;
  permissions: {
    canPlay: boolean;
    canSkip: boolean;
    canAddSongs: boolean;
    canKick: boolean;
  };
  status: 'listening' | 'dancing' | 'vibing' | 'afk';
  joinedAt: Date;
}

interface LiveMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  type: 'chat' | 'reaction' | 'system';
  timestamp: Date;
  reactions?: string[];
}

interface LiveSession {
  id: string;
  name: string;
  host: User;
  users: User[];
  currentTrack: {
    id: string;
    title: string;
    artist: string;
    duration: number;
    currentTime: number;
    cover: string;
  } | null;
  queue: Array<{
    id: string;
    title: string;
    artist: string;
    addedBy: string;
    votes: number;
  }>;
  isPlaying: boolean;
  maxUsers: number;
  isPublic: boolean;
  settings: {
    allowGuestControl: boolean;
    voteToSkip: boolean;
    skipThreshold: number;
    chatEnabled: boolean;
    reactionsEnabled: boolean;
  };
}

// Simulador de WebSocket para demo
class LiveSessionManager {
  private static sessions: Map<string, LiveSession> = new Map();
  private static currentUser: User | null = null;
  
  static createSession(name: string, hostUser: User): LiveSession {
    const sessionId = Math.random().toString(36).substring(2, 15);
    const session: LiveSession = {
      id: sessionId,
      name,
      host: { ...hostUser, isHost: true },
      users: [{ ...hostUser, isHost: true }],
      currentTrack: null,
      queue: [],
      isPlaying: false,
      maxUsers: 50,
      isPublic: true,
      settings: {
        allowGuestControl: false,
        voteToSkip: true,
        skipThreshold: 0.5,
        chatEnabled: true,
        reactionsEnabled: true
      }
    };
    
    this.sessions.set(sessionId, session);
    return session;
  }

  static joinSession(sessionId: string, user: User): LiveSession | null {
    const session = this.sessions.get(sessionId);
    if (session && session.users.length < session.maxUsers) {
      session.users.push({ ...user, isHost: false });
      this.currentUser = user;
      return session;
    }
    return null;
  }

  static leaveSession(sessionId: string, userId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.users = session.users.filter(u => u.id !== userId);
      if (session.users.length === 0) {
        this.sessions.delete(sessionId);
      }
    }
  }

  static updatePlayback(sessionId: string, isPlaying: boolean, currentTime: number): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.isPlaying = isPlaying;
      if (session.currentTrack) {
        session.currentTrack.currentTime = currentTime;
      }
    }
  }

  static addToQueue(sessionId: string, track: any, userId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.queue.push({
        id: track.id,
        title: track.title,
        artist: track.artist,
        addedBy: userId,
        votes: 0
      });
    }
  }

  static sendMessage(sessionId: string, message: LiveMessage): void {
    // En una implementación real, esto se enviaría a través de WebSocket
    console.log('Message sent:', message);
  }
}

export const LiveSession: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<LiveSession | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userStatus, setUserStatus] = useState<User['status']>('listening');
  const [showSettings, setShowSettings] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simular usuario actual
  const currentUser: User = {
    id: 'user-1',
    name: 'You',
    avatar: '👤',
    isHost: false,
    isOnline: true,
    permissions: {
      canPlay: false,
      canSkip: false,
      canAddSongs: true,
      canKick: false
    },
    status: userStatus,
    joinedAt: new Date()
  };

  useEffect(() => {
    // Simular creación de sesión
    if (!currentSession) {
      const session = LiveSessionManager.createSession('NeuroBeats Live Session', {
        ...currentUser,
        isHost: true,
        permissions: {
          canPlay: true,
          canSkip: true,
          canAddSongs: true,
          canKick: true
        }
      });
      setCurrentSession(session);
      setIsHost(true);

      // Simular usuarios uniéndose
      setTimeout(() => {
        const users = [
          { id: 'user-2', name: 'Alex', avatar: '🎵', status: 'vibing' as const },
          { id: 'user-3', name: 'Sam', avatar: '🎧', status: 'dancing' as const },
          { id: 'user-4', name: 'Jordan', avatar: '🎤', status: 'listening' as const }
        ];

        const updatedSession = { ...session };
        users.forEach(user => {
          updatedSession.users.push({
            ...user,
            isHost: false,
            isOnline: true,
            permissions: {
              canPlay: false,
              canSkip: session.settings.allowGuestControl,
              canAddSongs: true,
              canKick: false
            },
            joinedAt: new Date()
          });
        });

        setCurrentSession(updatedSession);

        // Simular mensajes
        const welcomeMessages: LiveMessage[] = [
          {
            id: '1',
            userId: 'system',
            username: 'System',
            message: 'Welcome to the live session! 🎉',
            type: 'system',
            timestamp: new Date()
          },
          {
            id: '2',
            userId: 'user-2',
            username: 'Alex',
            message: 'Hey everyone! Ready to discover some amazing music? 🎵',
            type: 'chat',
            timestamp: new Date()
          },
          {
            id: '3',
            userId: 'user-3',
            username: 'Sam',
            message: 'This AI analysis feature is incredible! 🤖',
            type: 'chat',
            timestamp: new Date()
          }
        ];

        setMessages(welcomeMessages);
      }, 2000);
    }

    // Auto-scroll chat
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && currentSession) {
      const message: LiveMessage = {
        id: Date.now().toString(),
        userId: currentUser.id,
        username: currentUser.name,
        message: newMessage.trim(),
        type: 'chat',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      LiveSessionManager.sendMessage(currentSession.id, message);
    }
  };

  const handleReaction = (emoji: string) => {
    if (currentSession) {
      const reaction: LiveMessage = {
        id: Date.now().toString(),
        userId: currentUser.id,
        username: currentUser.name,
        message: emoji,
        type: 'reaction',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, reaction]);
    }
  };

  const copySessionLink = () => {
    const link = `https://neurobeatsw.netlify.app/live/${currentSession?.id}`;
    navigator.clipboard.writeText(link);
    
    // Mostrar toast de confirmación
    const toast: LiveMessage = {
      id: Date.now().toString(),
      userId: 'system',
      username: 'System',
      message: 'Session link copied to clipboard! 📋',
      type: 'system',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, toast]);
  };

  if (!currentSession) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Users className="w-6 h-6 text-white" />
          </motion.div>
          <p className="text-white">Creating live session...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Main Session Area */}
      <div className="lg:col-span-2 space-y-6">
        {/* Session Header */}
        <GlassCard className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Radio className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-space font-bold text-white">{currentSession.name}</h2>
                <p className="text-gray-300 flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{currentSession.users.length} listeners</span>
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span>Live</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <NeonButton
                variant="ghost"
                size="sm"
                onClick={copySessionLink}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </NeonButton>

              {isHost && (
                <NeonButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                >
                  <Settings className="w-4 h-4" />
                </NeonButton>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Current Track */}
        <GlassCard className="p-6">
          <div className="text-center">
            {currentSession.currentTrack ? (
              <div className="space-y-4">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mx-auto flex items-center justify-center">
                  <Music className="w-16 h-16 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{currentSession.currentTrack.title}</h3>
                  <p className="text-gray-400">{currentSession.currentTrack.artist}</p>
                </div>
                
                {/* Playback Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <NeonButton variant="ghost" size="sm">
                    <SkipForward className="w-5 h-5 rotate-180" />
                  </NeonButton>
                  
                  <NeonButton
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      const newPlaying = !currentSession.isPlaying;
                      setCurrentSession(prev => prev ? { ...prev, isPlaying: newPlaying } : null);
                    }}
                  >
                    {currentSession.isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-1" />
                    )}
                  </NeonButton>
                  
                  <NeonButton variant="ghost" size="sm">
                    <SkipForward className="w-5 h-5" />
                  </NeonButton>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: '45%' }}
                      initial={{ width: 0 }}
                      animate={{ width: '45%' }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>1:23</span>
                    <span>3:45</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12">
                <div className="w-32 h-32 bg-white/10 rounded-xl mx-auto flex items-center justify-center mb-4">
                  <Music className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No track playing</h3>
                <p className="text-gray-400 mb-4">Add songs to the queue to get started</p>
                <NeonButton variant="primary">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Track
                </NeonButton>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Quick Reactions */}
        <GlassCard className="p-4">
          <h3 className="text-white font-medium mb-3">Quick Reactions</h3>
          <div className="flex space-x-2">
            {['🔥', '💯', '🎵', '🚀', '⚡', '💜', '🌟', '🎉'].map(emoji => (
              <motion.button
                key={emoji}
                className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-xl transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleReaction(emoji)}
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Users List */}
        <GlassCard className="p-4">
          <h3 className="text-white font-medium mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Listeners ({currentSession.users.length})
          </h3>
          
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {currentSession.users.map(user => (
              <motion.div
                key={user.id}
                className="flex items-center space-x-3 p-2 rounded-lg bg-white/5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="text-2xl">{user.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{user.name}</span>
                    {user.isHost && <Crown className="w-4 h-4 text-yellow-400" />}
                  </div>
                  <p className="text-xs text-gray-400 capitalize">{user.status}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
              </motion.div>
            ))}
          </div>

          <NeonButton variant="secondary" className="w-full mt-4" size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Friends
          </NeonButton>
        </GlassCard>

        {/* Live Chat */}
        <GlassCard className="p-4 flex flex-col h-96">
          <h3 className="text-white font-medium mb-4 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Live Chat
          </h3>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-2 mb-4">
            {messages.map(message => (
              <motion.div
                key={message.id}
                className={`${
                  message.type === 'system' 
                    ? 'text-center p-2 bg-blue-500/10 rounded-lg border border-blue-500/20' 
                    : message.type === 'reaction'
                    ? 'text-center p-1'
                    : 'p-2 bg-white/5 rounded-lg'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {message.type === 'reaction' ? (
                  <div className="text-center">
                    <span className="text-2xl">{message.message}</span>
                    <p className="text-xs text-gray-400">{message.username}</p>
                  </div>
                ) : (
                  <div>
                    {message.type !== 'system' && (
                      <p className="text-xs text-gray-400 mb-1">{message.username}</p>
                    )}
                    <p className={`text-sm ${
                      message.type === 'system' ? 'text-blue-300' : 'text-white'
                    }`}>
                      {message.message}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 p-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm"
            />
            <NeonButton
              variant="primary"
              size="sm"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <Share2 className="w-4 h-4" />
            </NeonButton>
          </div>
        </GlassCard>

        {/* Audio/Video Controls */}
        <GlassCard className="p-4">
          <h3 className="text-white font-medium mb-4">Media Controls</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Microphone</span>
              <motion.button
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  isAudioEnabled ? 'bg-green-500' : 'bg-red-500'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              >
                {isAudioEnabled ? (
                  <Mic className="w-5 h-5 text-white" />
                ) : (
                  <MicOff className="w-5 h-5 text-white" />
                )}
              </motion.button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300">Camera</span>
              <motion.button
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  isVideoEnabled ? 'bg-green-500' : 'bg-gray-600'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsVideoEnabled(!isVideoEnabled)}
              >
                {isVideoEnabled ? (
                  <Camera className="w-5 h-5 text-white" />
                ) : (
                  <CameraOff className="w-5 h-5 text-white" />
                )}
              </motion.button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300">Status</span>
              <select
                value={userStatus}
                onChange={(e) => setUserStatus(e.target.value as User['status'])}
                className="p-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
              >
                <option value="listening" className="bg-dark-600">🎧 Listening</option>
                <option value="dancing" className="bg-dark-600">💃 Dancing</option>
                <option value="vibing" className="bg-dark-600">🎵 Vibing</option>
                <option value="afk" className="bg-dark-600">💤 AFK</option>
              </select>
            </div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};