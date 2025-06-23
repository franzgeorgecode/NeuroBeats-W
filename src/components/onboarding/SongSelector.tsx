import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Check, RefreshCw, Clock, Wifi, WifiOff } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { smartMusicService } from '../../services/smartMusicService';
import { useDeezer } from '../../hooks/useDeezer';
import { useToast } from '../../hooks/useToast';
import type { SelectedSong } from './OnboardingFlow';
import type { CachedSong } from '../../services/dailySongsCache';

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
  const [isLoading, setIsLoading] = useState(true);
  const [songs, setSongs] = useState<CachedSong[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cacheInfo, setCacheInfo] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { deezerService } = useDeezer();
  const { showToast } = useToast();

  // Configurar smart music service con Deezer
  useEffect(() => {
    if (deezerService) {
      smartMusicService.setDeezerService(deezerService);
    }
  }, [deezerService]);

  // Escuchar cambios de conectividad
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cargar canciones inteligentemente
  useEffect(() => {
    const loadSongs = async () => {
      if (selectedGenres.length === 0) {
        setSongs([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        // Obtener información del caché
        const info = smartMusicService.getCacheInfo();
        setCacheInfo(info);

        // Cargar canciones usando el smart service
        const loadedSongs = await smartMusicService.getSongsByGenres(selectedGenres);
        setSongs(loadedSongs);

        // Mostrar información sobre la fuente de los datos
        const updatedInfo = smartMusicService.getCacheInfo();
        if (updatedInfo.totalSongs > 0 && !updatedInfo.isExpired) {
          const lastUpdated = new Date(updatedInfo.lastUpdated!);
          const hoursAgo = Math.floor((Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60));
          showToast(
            `Showing ${loadedSongs.length} songs (cached ${hoursAgo}h ago)`, 
            'success'
          );
        } else if (loadedSongs.length > 0) {
          showToast(`Loaded ${loadedSongs.length} fresh songs`, 'success');
        } else {
          showToast('Using offline songs', 'info');
        }

      } catch (error) {
        console.error('Error loading songs:', error);
        showToast('Error loading songs, using offline mode', 'warning');
        setSongs([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSongs();
  }, [selectedGenres, showToast]);

  const handlePreviewPlay = (song: CachedSong) => {
    if (!audioRef.current) return;

    try {
      if (playingPreview === song.id) {
        audioRef.current.pause();
        setPlayingPreview(null);
      } else {
        // Reproducir preview (30 segundos máximo)
        if (song.preview_url && audioRef.current) {
          audioRef.current.src = song.preview_url;
          audioRef.current.play()
            .then(() => {
              setPlayingPreview(song.id);
            })
            .catch((error) => {
              console.warn('Audio preview error:', error);
              showToast('Audio preview not available', 'warning');
              setPlayingPreview(null);
            });
        } else {
          showToast('Audio preview not available', 'warning');
        }
      }
    } catch (error) {
      console.warn('Audio preview error:', error);
      setPlayingPreview(null);
    }
  };

  const refreshSongs = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    showToast('Refreshing songs from Deezer...', 'info');
    
    try {
      const success = await smartMusicService.forceUpdateCache(selectedGenres);
      
      if (success) {
        // Recargar canciones después de la actualización
        const refreshedSongs = await smartMusicService.getSongsByGenres(selectedGenres);
        setSongs(refreshedSongs);
        showToast(`Refreshed ${refreshedSongs.length} songs successfully!`, 'success');
      } else {
        showToast('Could not refresh from Deezer, using cached songs', 'warning');
      }
    } catch (error) {
      console.error('Error refreshing songs:', error);
      showToast('Error refreshing songs', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  const convertCachedToSelectedSong = (cachedSong: CachedSong): SelectedSong => {
    return {
      id: cachedSong.id,
      title: cachedSong.title,
      artist: cachedSong.artist,
      preview_url: cachedSong.preview_url,
      cover_url: cachedSong.cover_url,
      duration: cachedSong.duration,
    };
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-space font-bold text-white mb-4">
            Loading Top 5 Songs per Genre
          </h2>
          <p className="text-xl text-gray-300">
            Getting the best tracks from Deezer for your selected genres...
          </p>
          <p className="text-sm text-neon-purple mt-2">
            {selectedGenres.join(', ')}
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
        <div className="flex items-center justify-center space-x-4 mt-2">
          <p className="text-sm text-gray-400">
            {selectedGenres.length > 0 
              ? `Top 5 songs per genre: ${selectedGenres.join(', ')}`
              : 'Popular tracks for you'
            }
          </p>
          <div className="flex items-center space-x-2">
            {/* Indicador de conectividad */}
            <div className="flex items-center space-x-1">
              {isOnline ? (
                <Wifi className="w-3 h-3 text-green-400" />
              ) : (
                <WifiOff className="w-3 h-3 text-red-400" />
              )}
              <span className="text-xs text-gray-500">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            
            {/* Información del caché */}
            {cacheInfo && cacheInfo.lastUpdated && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-neon-purple" />
                <span className="text-xs text-gray-500">
                  {new Date(cacheInfo.lastUpdated).toLocaleDateString()}
                </span>
              </div>
            )}
            
            {/* Botón de refresh */}
            <motion.button
              onClick={refreshSongs}
              disabled={isRefreshing || !isOnline}
              className={`p-2 transition-colors ${
                isRefreshing || !isOnline
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-neon-purple hover:text-neon-pink'
              }`}
              whileHover={!isRefreshing && isOnline ? { scale: 1.1 } : {}}
              whileTap={!isRefreshing && isOnline ? { scale: 0.9 } : {}}
              title={isOnline ? 'Refresh songs from Deezer' : 'No internet connection'}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
      >
        {songs.map((cachedSong, index) => {
          const song = convertCachedToSelectedSong(cachedSong);
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
                        handlePreviewPlay(cachedSong);
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
                        {cachedSong.genre || 'Music'}
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

      {/* Cache Info */}
      {cacheInfo && cacheInfo.totalSongs > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <GlassCard className="p-4 max-w-md mx-auto bg-white/5">
            <div className="text-center">
              <h4 className="text-sm font-semibold text-white mb-2">Cache Status</h4>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                <div>
                  <p className="font-medium">Total Songs</p>
                  <p className="text-neon-purple">{cacheInfo.totalSongs}</p>
                </div>
                <div>
                  <p className="font-medium">Genres</p>
                  <p className="text-neon-purple">{cacheInfo.genresCount}</p>
                </div>
              </div>
              {cacheInfo.lastUpdated && (
                <p className="text-xs text-gray-500 mt-2">
                  Last updated: {new Date(cacheInfo.lastUpdated).toLocaleString()}
                </p>
              )}
              {cacheInfo.isExpired && (
                <p className="text-xs text-yellow-400 mt-1">
                  ⚠️ Cache expired - refresh recommended
                </p>
              )}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Help Text */}
      {selectedSongs.length === 0 && songs.length > 0 && (
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

      {/* No songs message */}
      {!isLoading && songs.length === 0 && selectedGenres.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6"
        >
          <GlassCard className="p-6 max-w-md mx-auto text-center">
            <p className="text-gray-400 mb-4">
              No songs available for the selected genres
            </p>
            <motion.button
              onClick={refreshSongs}
              disabled={!isOnline}
              className="px-4 py-2 bg-neon-purple/20 text-neon-purple rounded-lg hover:bg-neon-purple/30 transition-colors disabled:opacity-50"
            >
              {isOnline ? 'Try Refreshing' : 'Connect to Internet'}
            </motion.button>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
};