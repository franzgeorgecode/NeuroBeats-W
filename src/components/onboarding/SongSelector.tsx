import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Check, Music } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { getSongsByGenres, type MockSong } from '../../data/mockSongs';
import type { SelectedSong } from './OnboardingFlow';

interface SongSelectorProps {
  selectedGenres: string[];
  selectedSongs: SelectedSong[];
  onSongToggle: (song: SelectedSong) => void;
}

export const SongSelector: React.FC<SongSelectorProps> = ({
  selectedGenres,
  selectedSongs,
  onSongToggle,
}) => {
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Usar useMemo para evitar re-renders innecesarios
  const availableSongs = useMemo(() => {
    const songs = getSongsByGenres(selectedGenres);
    return songs.slice(0, 15); // Limitar a 15 canciones máximo
  }, [selectedGenres]);

  // Simular loading inicial solo una vez
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000); // 1 segundo de loading para simular carga

    return () => clearTimeout(timer);
  }, []); // Solo se ejecuta una vez al montar

  const handlePreviewPlay = (song: SelectedSong) => {
    if (!audioRef.current) return;

    try {
      if (playingPreview === song.id) {
        audioRef.current.pause();
        setPlayingPreview(null);
      } else {
        // Para el demo, no reproducimos audio real
        setPlayingPreview(song.id);
        // Simular que el audio termina después de 30 segundos
        setTimeout(() => {
          setPlayingPreview(null);
        }, 30000);
      }
    } catch (error) {
      console.warn('Audio preview error:', error);
      setPlayingPreview(null);
    }
  };

  const convertToSelectedSong = (mockSong: MockSong): SelectedSong => {
    return {
      id: mockSong.id,
      title: mockSong.title,
      artist: mockSong.artist,
      preview_url: mockSong.preview_url,
      cover_url: mockSong.cover_url,
      duration: mockSong.duration,
    };
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Loading state
  if (isInitialLoading) {
    return (
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-space font-bold text-white mb-4">
            Curating Your Perfect Songs
          </h2>
          <p className="text-xl text-gray-300">
            Finding the best tracks based on your preferences...
          </p>
        </motion.div>

        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-neon-purple rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-3 h-3 bg-neon-pink rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <audio
        ref={audioRef}
        onEnded={() => setPlayingPreview(null)}
        onError={() => setPlayingPreview(null)}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-4xl font-space font-bold text-white mb-4">
          Choose Your Favorite Songs
        </h2>
        <p className="text-xl text-gray-300 mb-2">
          Select up to 5 songs to personalize your experience
        </p>
        <p className="text-lg text-neon-purple font-medium">
          {selectedSongs.length}/5 songs selected
        </p>
        <p className="text-sm text-gray-400 mt-2">
          {selectedGenres.length > 0 
            ? `Curated for: ${selectedGenres.join(', ')}`
            : 'Popular tracks for you'
          }
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
      >
        {availableSongs.map((mockSong, index) => {
          const song = convertToSelectedSong(mockSong);
          const isSelected = selectedSongs.some(s => s.id === song.id);
          const isPlaying = playingPreview === song.id;
          const canSelect = selectedSongs.length < 5 || isSelected;
          
          return (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: canSelect ? 1.02 : 1 }}
              whileTap={{ scale: canSelect ? 0.98 : 1 }}
            >
              <GlassCard
                className={`
                  p-4 cursor-pointer transition-all duration-300 relative overflow-hidden group
                  ${isSelected 
                    ? 'ring-2 ring-neon-purple shadow-neon bg-neon-gradient' 
                    : canSelect 
                      ? 'hover:ring-1 hover:ring-white/30' 
                      : 'opacity-50 cursor-not-allowed'
                  }
                `}
                onClick={() => canSelect && onSongToggle(song)}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center z-10"
                  >
                    <Check className="w-4 h-4 text-neon-purple" />
                  </motion.div>
                )}

                <div className="flex items-center space-x-4">
                  {/* Album Art with Play Button */}
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-neon-purple to-neon-blue rounded-xl overflow-hidden">
                      <img
                        src={song.cover_url}
                        alt={song.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback si la imagen no carga
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center">
                              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                              </svg>
                            </div>
                          `;
                        }}
                      />
                    </div>

                    {/* Preview Play Button */}
                    <motion.button
                      className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewPlay(song);
                      }}
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 text-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white" />
                      )}
                    </motion.button>

                    {/* Playing indicator */}
                    {isPlaying && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-neon-green rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>

                  {/* Song Info */}
                  <div className="flex-1 min-w-0 text-left">
                    <h3 className="text-white font-inter font-semibold truncate text-sm">
                      {song.title}
                    </h3>
                    <p className="text-gray-400 text-xs truncate">
                      {song.artist}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-gray-500 text-xs">
                        {formatDuration(song.duration)}
                      </p>
                      <span className="text-xs bg-neon-purple/20 text-neon-purple px-2 py-1 rounded-full">
                        {mockSong.genre}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Selected Songs Preview */}
      <AnimatePresence>
        {selectedSongs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="mt-8"
          >
            <GlassCard className="p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-space font-bold text-white mb-4">
                Your Selected Songs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedSongs.map((song, index) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-neon-purple to-neon-blue rounded-lg overflow-hidden">
                      <img
                        src={song.cover_url}
                        alt={song.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center">
                              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                              </svg>
                            </div>
                          `;
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {song.title}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        {song.artist}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Message */}
      {selectedSongs.length === 5 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <div className="flex items-center justify-center space-x-2 text-neon-green">
            <Check className="w-5 h-5" />
            <span className="font-inter font-medium">Perfect! You're ready to complete your setup</span>
          </div>
        </motion.div>
      )}

      {/* Help Text */}
      {selectedSongs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6"
        >
          <p className="text-gray-500 text-sm">
            Select songs you love or skip this step to continue with default recommendations
          </p>
        </motion.div>
      )}
    </div>
  );
};