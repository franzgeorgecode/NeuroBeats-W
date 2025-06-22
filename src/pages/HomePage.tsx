import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, MoreHorizontal, TrendingUp, Music2, Headphones } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { NeonButton } from '../components/ui/NeonButton';
import { useDeezer } from '../hooks/useDeezer';
import { usePlayerStore } from '../stores/playerStore';
import { useToast } from '../hooks/useToast';

export const HomePage: React.FC = () => {
  const { useTopTracks, deezerService } = useDeezer();
  const { data: topTracksData, isLoading, error } = useTopTracks(20);
  const { setCurrentTrack, addToQueue, setIsPlaying } = usePlayerStore();
  const { showToast } = useToast();

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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-600 to-dark-700 pt-24 pb-32">
        <div className="container mx-auto px-6">
          <GlassCard className="p-8 text-center">
            <h2 className="text-2xl font-space font-bold text-white mb-4">
              Unable to load music
            </h2>
            <p className="text-gray-400 mb-6">
              Please check your internet connection and try again.
            </p>
            <NeonButton variant="primary" onClick={() => window.location.reload()}>
              Retry
            </NeonButton>
          </GlassCard>
        </div>
      </div>
    );
  }

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
              Top Tracks
            </h2>
          </div>

          {isLoading ? (
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
              {topTracksData?.data?.slice(0, 12).map((track, index) => (
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

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-space font-bold text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Search Music', color: 'from-neon-purple to-neon-blue' },
              { label: 'Top Charts', color: 'from-neon-blue to-neon-cyan' },
              { label: 'Genres', color: 'from-neon-cyan to-neon-green' },
              { label: 'Playlists', color: 'from-neon-green to-neon-pink' },
            ].map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              >
                <GlassCard 
                  hover 
                  className={`p-6 bg-gradient-to-br ${action.color} cursor-pointer`}
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