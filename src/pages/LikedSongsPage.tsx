import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Music, Download, Shuffle, Play } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { SongCard } from '../components/ui/SongCard';
import { NeonButton } from '../components/ui/NeonButton';
import { usePlayerStore } from '../stores/playerStore';
import { useToast } from '../hooks/useToast';

export const LikedSongsPage: React.FC = () => {
  const { likedSongs, setCurrentTrack, setIsPlaying, addToQueue } = usePlayerStore();
  const { showToast } = useToast();
  const [sortBy, setSortBy] = useState<'recent' | 'title' | 'artist'>('recent');

  const handlePlayTrack = (song: any) => {
    try {
      setCurrentTrack(song);
      setIsPlaying(true);
      showToast(`Now playing: ${song.title}`, 'success');
    } catch (error) {
      showToast('Error playing track', 'error');
    }
  };

  const handleAddToQueue = (song: any) => {
    try {
      addToQueue(song);
      showToast(`Added "${song.title}" to queue`, 'success');
    } catch (error) {
      showToast('Error adding to queue', 'error');
    }
  };

  const handlePlayAll = () => {
    if (likedSongs.length === 0) return;
    
    try {
      setCurrentTrack(likedSongs[0]);
      setIsPlaying(true);
      
      // Add remaining songs to queue
      likedSongs.slice(1).forEach(song => addToQueue(song));
      showToast(`Playing ${likedSongs.length} liked songs`, 'success');
    } catch (error) {
      showToast('Error playing playlist', 'error');
    }
  };

  const handleShuffle = () => {
    if (likedSongs.length === 0) return;
    
    try {
      const shuffled = [...likedSongs].sort(() => Math.random() - 0.5);
      setCurrentTrack(shuffled[0]);
      setIsPlaying(true);
      
      // Add remaining shuffled songs to queue
      shuffled.slice(1).forEach(song => addToQueue(song));
      showToast(`Shuffling ${likedSongs.length} liked songs`, 'success');
    } catch (error) {
      showToast('Error shuffling playlist', 'error');
    }
  };

  const sortedSongs = [...likedSongs].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'artist':
        return a.artist.localeCompare(b.artist);
      case 'recent':
      default:
        return 0; // Keep original order for "recent"
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-600 to-dark-700 pt-24 pb-32">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="p-8 bg-gradient-to-r from-neon-pink/20 to-neon-purple/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-neon-pink to-neon-purple rounded-2xl flex items-center justify-center mr-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-space font-bold text-white mb-2">
                      Liked Songs
                    </h1>
                    <p className="text-xl text-white/80">
                      {likedSongs.length} songs you've liked
                    </p>
                  </div>
                </div>
                
                {likedSongs.length > 0 && (
                  <div className="flex items-center space-x-4">
                    <NeonButton
                      variant="primary"
                      onClick={handlePlayAll}
                      className="flex items-center space-x-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>Play All</span>
                    </NeonButton>
                    
                    <NeonButton
                      variant="secondary"
                      onClick={handleShuffle}
                      className="flex items-center space-x-2"
                    >
                      <Shuffle className="w-4 h-4" />
                      <span>Shuffle</span>
                    </NeonButton>
                  </div>
                )}
              </div>
              
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-gradient-to-r from-neon-pink/30 to-neon-purple/30 rounded-full animate-pulse-slow" />
              </div>
            </div>
          </GlassCard>
        </motion.section>

        {/* Controls */}
        {likedSongs.length > 0 && (
          <motion.section
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <GlassCard className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-white font-medium">Sort by:</span>
                  {[
                    { value: 'recent', label: 'Recently Added' },
                    { value: 'title', label: 'Title' },
                    { value: 'artist', label: 'Artist' },
                  ].map((option) => (
                    <motion.button
                      key={option.value}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        sortBy === option.value
                          ? 'bg-neon-gradient text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSortBy(option.value as any)}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
                
                <div className="text-gray-400 text-sm">
                  Total duration: {Math.floor(likedSongs.reduce((acc, song) => acc + (song.duration || 0), 0) / 60)} minutes
                </div>
              </div>
            </GlassCard>
          </motion.section>
        )}

        {/* Songs List */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {likedSongs.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-space font-bold text-white mb-2">
                No Liked Songs Yet
              </h3>
              <p className="text-gray-400 mb-6">
                Start liking songs to build your personal collection
              </p>
              <div className="flex items-center justify-center space-x-4 text-gray-500">
                <div className="flex items-center space-x-2">
                  <Music className="w-4 h-4" />
                  <span className="text-sm">Discover new music</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">Like your favorites</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Access them here</span>
                </div>
              </div>
            </GlassCard>
          ) : (
            <div className="space-y-2">
              {sortedSongs.map((song, index) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                >
                  <SongCard
                    song={song}
                    variant="list"
                    index={index}
                    showIndex
                    onPlay={() => handlePlayTrack(song)}
                    onAddToQueue={() => handleAddToQueue(song)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
};