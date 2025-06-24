import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, MoreHorizontal, TrendingUp, Music2, Headphones, Settings } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { SongCard } from '../components/ui/SongCard';
import { NeonButton } from '../components/ui/NeonButton';
import { PreferencesCard } from '../components/user/PreferencesCard';
import { useDeezer } from '../hooks/useDeezer';
import { usePlayerStore } from '../stores/playerStore';
import { useAppStore } from '../stores/appStore';
import { useToast } from '../hooks/useToast';
import { getAllSongs } from '../data/mockSongs';
import { getTop3Tracks, convertToResponseFormat } from '../data/guaranteedTracks';

export const HomePage: React.FC = () => {
  const { useTopTracks, deezerService } = useDeezer();
  const { data: topTracksData, isLoading, error } = useTopTracks(6); // 6 tracks: 2 por género máximo
  const { setCurrentTrack, addToQueue, setIsPlaying } = usePlayerStore();
  const { setCurrentPage } = useAppStore();
  const { showToast } = useToast();
  const [fallbackTracks, setFallbackTracks] = useState<any[]>([]);
  const [guaranteedTracks, setGuaranteedTracks] = useState<any[]>([]);

  // SIEMPRE cargar tracks garantizados al inicio
  useEffect(() => {
    const loadGuaranteedTracks = () => {
      const guaranteed = getTop3Tracks();
      setGuaranteedTracks(guaranteed);
    };
    
    loadGuaranteedTracks();
  }, []);

  // Si hay error, usar datos mockeados adicionales
  useEffect(() => {
    if (error) {
      const mockSongs = getAllSongs();
      const deezerFormatTracks = mockSongs.map(song => ({
        id: song.id,
        title: song.title,
        duration: song.duration,
        preview: song.preview_url || song.audio_url,
        artist: { name: song.artist },
        album: { 
          cover_medium: song.cover_url,
          cover_big: song.cover_url,
          title: `${song.title} - Single`
        }
      }));
      setFallbackTracks(deezerFormatTracks);
    }
  }, [error]);

  const handlePlayTrack = (deezerTrack: any) => {
    try {
      const track = deezerService.convertToTrack(deezerTrack);
      setCurrentTrack(track);
      setIsPlaying(true);
      showToast(`Now playing: ${track.title}`, 'success');
    } catch (error) {
      showToast('Error playing track', 'error');
    }
  };

  const handleAddToQueue = (deezerTrack: any) => {
    try {
      const track = deezerService.convertToTrack(deezerTrack);
      addToQueue(track);
      showToast(`Added "${track.title}" to queue`, 'success');
    } catch (error) {
      showToast('Error adding to queue', 'error');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // SISTEMA PRIORIZADO: API REAL PRIMERO, FALLBACK SOLO SI FALLA
  let tracksToShow = [];
  let isLoadingState = false;
  let dataSource = '';
  
  // PRIORIDAD 1: Datos de la API de Deezer (SIEMPRE PRIMERO)
  if (topTracksData?.data && topTracksData.data.length > 0) {
    tracksToShow = topTracksData.data;
    dataSource = 'Deezer API';
    console.log('🎵 Using Deezer API data:', tracksToShow.length, 'tracks');
  }
  // PRIORIDAD 2: Tracks garantizados si API falla
  else if (guaranteedTracks.length > 0 && !isLoading) {
    tracksToShow = guaranteedTracks;
    dataSource = 'Guaranteed';
    console.log('🔄 Using guaranteed fallback:', tracksToShow.length, 'tracks');
  }
  // PRIORIDAD 3: Fallback adicional si hay error
  else if (fallbackTracks.length > 0) {
    tracksToShow = fallbackTracks;
    dataSource = 'Mock Data';
    console.log('📦 Using mock fallback:', tracksToShow.length, 'tracks');
  }
  // ESTADO DE CARGA: Solo mientras esperamos la API
  else if (isLoading) {
    isLoadingState = true;
    console.log('⏳ Loading from Deezer API...');
  }
  
  const hasValidTracks = tracksToShow && tracksToShow.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-600 to-dark-700 pt-24 pb-32">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="p-8 bg-neon-gradient">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-space font-bold text-white mb-4">
                  Welcome to the Future of Music
                </h1>
                <p className="text-xl text-white/80 mb-6">
                  Discover millions of tracks powered by Deezer
                </p>
                <div className="flex items-center space-x-6 text-white/90">
                  <div className="flex items-center space-x-2">
                    <Music2 className="w-5 h-5" />
                    <span className="font-inter">Millions of Songs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Headphones className="w-5 h-5" />
                    <span className="font-inter">High Quality Audio</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-inter">Trending Charts</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-white/20 rounded-full animate-pulse-slow" />
              </div>
            </div>
          </GlassCard>
        </motion.section>

        {/* Top Tracks Section */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center mb-6">
            <TrendingUp className="w-6 h-6 text-neon-purple mr-3" />
            <h2 className="text-2xl font-space font-bold text-white">
              Top Tracks by Genre
            </h2>
            <span className={`ml-3 text-xs px-2 py-1 rounded-full ${
              dataSource === 'Deezer API' ? 'bg-green-500/20 text-green-400' :
              dataSource === 'Guaranteed' ? 'bg-blue-500/20 text-blue-400' :
              'bg-yellow-500/20 text-yellow-400'
            }`}>
              {dataSource || 'Loading...'}
            </span>
          </div>

          {isLoadingState ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <GlassCard key={index} className="p-6 animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-600 rounded-xl" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-600 rounded mb-2" />
                      <div className="h-3 bg-gray-700 rounded w-2/3" />
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : hasValidTracks ? (
            <div className="space-y-2">
              {tracksToShow.slice(0, 6).map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                >
                  <SongCard
                    song={{
                      id: track.id,
                      title: track.title,
                      artist: track.artist?.name || track.artist,
                      album: track.album?.title || track.album || `${track.title} - Single`,
                      artistId: track.artist?.id || track.artistId,
                      albumId: track.album?.id || track.albumId,
                      duration: track.duration,
                      cover_url: track.album?.cover_xl || track.album?.cover_big || track.album?.cover_medium || track.album?.cover || track.cover_url,
                      audio_url: track.preview || track.audio_url,
                      plays_count: track.rank || track.plays_count,
                    }}
                    variant="compact"
                    showIndex
                    index={index}
                    onPlay={() => handlePlayTrack(track)}
                    onAddToQueue={() => handleAddToQueue(track)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No tracks available</h3>
              <p className="text-gray-400 mb-4">Unable to load tracks at the moment</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-neon-purple hover:bg-neon-purple/80 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </motion.section>

        {/* AI Recommendations */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-neon-gradient rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h2 className="text-2xl font-space font-bold text-white">
                AI Powered Playlists
              </h2>
            </div>
            <NeonButton
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage('ai-playlist')}
            >
              Generate New Playlist
            </NeonButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Generator Card */}
            <GlassCard className="p-6 bg-gradient-to-r from-neon-purple/10 to-neon-blue/10 border border-neon-purple/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-neon-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-space font-bold text-white mb-2">
                  Create Your Perfect Playlist
                </h3>
                <p className="text-gray-300 mb-4">
                  AI analyzes your taste and creates personalized playlists
                </p>
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {['Smart recommendations', 'Mood-aware', 'Time-appropriate', 'New discoveries'].map((feature) => (
                    <span key={feature} className="px-3 py-1 bg-neon-purple/20 text-neon-purple rounded-full text-sm">
                      {feature}
                    </span>
                  ))}
                </div>
                <NeonButton
                  variant="primary"
                  onClick={() => setCurrentPage('ai-playlist')}
                  className="w-full"
                >
                  <span className="mr-2">✨</span>
                  Generate AI Playlist
                </NeonButton>
              </div>
            </GlassCard>

            {/* Quick AI Suggestions */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-space font-bold text-white mb-4">
                Quick AI Suggestions
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Discover Weekly', description: 'New tracks based on your taste', mood: 'discovery' },
                  { name: 'Focus Flow', description: 'Concentration music for work', mood: 'focus' },
                  { name: 'Energetic Vibes', description: 'High-energy tracks to pump you up', mood: 'energetic' },
                  { name: 'Chill Sessions', description: 'Relaxing music for unwinding', mood: 'chill' }
                ].map((suggestion, index) => (
                  <motion.button
                    key={suggestion.name}
                    className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentPage('ai-playlist')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">{suggestion.name}</h4>
                        <p className="text-gray-400 text-sm">{suggestion.description}</p>
                      </div>
                      <div className="w-2 h-2 bg-neon-gradient rounded-full"></div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </GlassCard>
          </div>
        </motion.section>

        {/* User Preferences Section */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center mb-6">
            <Settings className="w-6 h-6 text-neon-purple mr-3" />
            <h2 className="text-2xl font-space font-bold text-white">
              Your Profile
            </h2>
          </div>
          <PreferencesCard />
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-space font-bold text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Search Music', color: 'from-neon-purple to-neon-blue', action: () => setCurrentPage('search') },
              { label: 'Top Charts', color: 'from-neon-blue to-neon-cyan', action: () => setCurrentPage('trending') },
              { label: 'Genres', color: 'from-neon-cyan to-neon-green', action: () => setCurrentPage('genres') },
              { label: 'Discover', color: 'from-neon-green to-neon-pink', action: () => setCurrentPage('discover') },
            ].map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              >
                <GlassCard 
                  hover 
                  className={`p-6 bg-gradient-to-br ${action.color} cursor-pointer`}
                  onClick={action.action}
                >
                  <h3 className="text-white font-inter font-semibold text-center">
                    {action.label}
                  </h3>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};