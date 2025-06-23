import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, MoreHorizontal, TrendingUp, Music2, Headphones, Settings } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { NeonButton } from '../components/ui/NeonButton';
import { PreferencesCard } from '../components/user/PreferencesCard';
import { useDeezer } from '../hooks/useDeezer';
import { usePlayerStore } from '../stores/playerStore';
import { useAppStore } from '../stores/appStore';
import { useToast } from '../hooks/useToast';
import { getAllSongs } from '../data/mockSongs';

export const HomePage: React.FC = () => {
  const { useTopTracks, deezerService } = useDeezer();
  const { data: topTracksData, isLoading, error } = useTopTracks(20);
  const { setCurrentTrack, addToQueue, setIsPlaying } = usePlayerStore();
  const { setCurrentPage } = useAppStore();
  const { showToast } = useToast();
  const [fallbackTracks, setFallbackTracks] = useState<any[]>([]);

  // Si hay error, usar datos mockeados
  useEffect(() => {
    if (error) {
      const mockSongs = getAllSongs();
      const deezerFormatTracks = mockSongs.map(song => ({
        id: song.id,
        title: song.title,
        duration: song.duration,
        preview: song.preview_url,
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

  // Determinar qué datos usar
  const tracksToShow = error ? fallbackTracks : topTracksData?.data;
  const isLoadingState = isLoading && !error;

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
              {error ? 'Popular Tracks' : 'Top Tracks'}
            </h2>
            {error && (
              <span className="ml-3 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                Offline Mode
              </span>
            )}
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tracksToShow?.slice(0, 12).map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <GlassCard hover className="p-6 group">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-neon-purple to-neon-blue rounded-xl overflow-hidden">
                          <img
                            src={track.album.cover_medium}
                            alt={track.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <motion.button
                          className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handlePlayTrack(track)}
                        >
                          <Play className="w-6 h-6 text-white" />
                        </motion.button>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-inter font-semibold truncate">
                          {track.title}
                        </h3>
                        <p className="text-gray-400 text-sm truncate">
                          {track.artist.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {formatDuration(track.duration)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <motion.button
                          className="p-2 text-gray-400 hover:text-neon-pink transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Heart className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAddToQueue(track)}
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
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
                AI Recommendations
              </h2>
            </div>
            <NeonButton
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage('ai-playlist')}
            >
              Generate Playlist
            </NeonButton>
          </div>

          <GlassCard className="p-6 bg-gradient-to-r from-neon-purple/10 to-neon-blue/10 border border-neon-purple/20">
            <div className="text-center">
              <div className="w-16 h-16 bg-neon-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Music2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-space font-bold text-white mb-2">
                Get Personalized Recommendations
              </h3>
              <p className="text-gray-300 mb-4">
                Our AI analyzes your music taste and creates the perfect playlist just for you
              </p>
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {['Based on your genres', 'Mood-aware', 'Time-appropriate', 'New discoveries'].map((feature) => (
                  <span key={feature} className="px-3 py-1 bg-neon-purple/20 text-neon-purple rounded-full text-sm">
                    {feature}
                  </span>
                ))}
              </div>
              <NeonButton
                variant="primary"
                onClick={() => setCurrentPage('ai-playlist')}
              >
                <span className="mr-2">✨</span>
                Create AI Playlist
              </NeonButton>
            </div>
          </GlassCard>
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