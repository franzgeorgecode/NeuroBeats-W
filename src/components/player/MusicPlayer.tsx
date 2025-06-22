import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Shuffle,
  Repeat,
  Heart,
  Share2,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  List,
  Volume2,
  VolumeX,
  Volume1
} from 'lucide-react';
import { usePlayerStore } from '../../stores/playerStore';
import { GlassCard } from '../ui/GlassCard';
import { AudioVisualizer } from './AudioVisualizer';
import { ProgressBar } from './ProgressBar';
import { useToast } from '../../hooks/useToast';

interface MusicPlayerProps {
  className?: string;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ className = '' }) => {
  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    duration,
    shuffle,
    repeat,
    queue,
    setIsPlaying,
    setVolume,
    setProgress,
    setDuration,
    nextTrack,
    previousTrack,
    toggleShuffle,
    toggleRepeat,
  } = usePlayerStore();

  const { showToast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextTrack();
      }
    };

    const handleError = (e: Event) => {
      console.error('Audio playback error:', e);
      setIsPlaying(false);
      showToast('Error playing audio', 'error');
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentTrack, repeat, nextTrack, setIsPlaying, setProgress, setDuration, showToast]);

  // Play/pause control
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((error) => {
        console.error('Playback failed:', error);
        setIsPlaying(false);
        showToast('Playback failed', 'error');
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, setIsPlaying, showToast]);

  // Volume control
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  // Track change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (currentTrack.audio_url) {
      audio.src = currentTrack.audio_url;
      audio.load();
      
      if (isPlaying) {
        audio.play().catch((error) => {
          console.error('Failed to play new track:', error);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrack, isPlaying, setIsPlaying]);

  const handleSeek = (time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
      setProgress(time);
    }
  };

  const handlePlayPause = () => {
    if (!currentTrack?.audio_url) {
      showToast('No preview available for this track', 'warning');
      return;
    }
    
    // Ensure audio is loaded before playing
    const audio = audioRef.current;
    if (audio && audio.readyState === 0) {
      audio.load();
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleShare = async () => {
    if (!currentTrack) return;
    
    try {
      await navigator.share({
        title: currentTrack.title,
        text: `Check out "${currentTrack.title}" by ${currentTrack.artist}`,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(
        `Check out "${currentTrack.title}" by ${currentTrack.artist} - ${window.location.href}`
      );
      showToast('Track details copied to clipboard!', 'success');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getVolumeIcon = () => {
    if (volume === 0) return VolumeX;
    if (volume < 0.5) return Volume1;
    return Volume2;
  };

  const VolumeIcon = getVolumeIcon();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          previousTrack();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextTrack();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, nextTrack, previousTrack]);

  if (!currentTrack) return null;

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" />

      {/* Mini Player */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            className={`fixed bottom-0 left-0 right-0 z-50 p-4 ${className}`}
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <GlassCard className="p-4">
              <div className="flex items-center justify-between">
                {/* Track Info */}
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-blue rounded-lg overflow-hidden">
                      {currentTrack.cover_url ? (
                        <img 
                          src={currentTrack.cover_url} 
                          alt={currentTrack.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-lg">♪</div>
                      )}
                    </div>
                    {isPlaying && (
                      <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                        <AudioVisualizer 
                          audioElement={audioRef.current}
                          isPlaying={isPlaying}
                          className="w-8 h-6"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-inter font-semibold truncate text-sm">
                      {currentTrack.title}
                    </h3>
                    <p className="text-gray-400 text-xs truncate">
                      {currentTrack.artist}
                    </p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-2">
                  <motion.button
                    className="p-2 text-white hover:text-neon-blue transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={previousTrack}
                  >
                    <SkipBack className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    className="w-10 h-10 bg-neon-gradient rounded-full flex items-center justify-center shadow-neon"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 text-white" />
                    ) : (
                      <Play className="w-4 h-4 text-white ml-0.5" />
                    )}
                  </motion.button>

                  <motion.button
                    className="p-2 text-white hover:text-neon-blue transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextTrack}
                  >
                    <SkipForward className="w-4 h-4" />
                  </motion.button>

                  {/* Volume Control */}
                  <div className="relative">
                    <motion.button
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                    >
                      <VolumeIcon className="w-4 h-4" />
                    </motion.button>
                    
                    <AnimatePresence>
                      {showVolumeSlider && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2"
                        >
                          <div className="bg-dark-300 p-3 rounded-lg shadow-lg">
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.01"
                              value={volume}
                              onChange={(e) => setVolume(parseFloat(e.target.value))}
                              className="w-20 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.button
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsExpanded(true)}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <ProgressBar
                  currentTime={currentTime}
                  duration={duration}
                  onSeek={handleSeek}
                />
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Player */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed inset-0 z-50 bg-dark-600"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <motion.button
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsExpanded(false)}
                >
                  <ChevronDown className="w-6 h-6" />
                </motion.button>
                
                <h2 className="text-white font-space font-bold">Now Playing</h2>
                
                <motion.button
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowQueue(!showQueue)}
                >
                  <List className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="flex-1 flex">
                {/* Main Player */}
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                  {/* Album Art */}
                  <motion.div
                    className="relative mb-8"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-80 h-80 bg-gradient-to-br from-neon-purple to-neon-blue rounded-3xl overflow-hidden shadow-2xl">
                      {currentTrack.cover_url ? (
                        <img 
                          src={currentTrack.cover_url} 
                          alt={currentTrack.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-6xl">♪</div>
                      )}
                    </div>
                    
                    {/* Visualizer Overlay */}
                    {isPlaying && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <AudioVisualizer 
                          audioElement={audioRef.current}
                          isPlaying={isPlaying}
                          className="h-16"
                        />
                      </div>
                    )}
                  </motion.div>

                  {/* Track Info */}
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-space font-bold text-white mb-2">
                      {currentTrack.title}
                    </h1>
                    <p className="text-xl text-gray-400 font-inter">
                      {currentTrack.artist}
                    </p>
                    {currentTrack.album && (
                      <p className="text-lg text-gray-500 font-inter mt-1">
                        {currentTrack.album}
                      </p>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="w-full max-w-md mb-8">
                    <ProgressBar
                      currentTime={currentTime}
                      duration={duration}
                      onSeek={handleSeek}
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex items-center space-x-8 mb-8">
                    <motion.button
                      className={`p-3 transition-colors ${
                        shuffle ? 'text-neon-green' : 'text-gray-400 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleShuffle}
                    >
                      <Shuffle className="w-6 h-6" />
                    </motion.button>

                    <motion.button
                      className="p-3 text-white hover:text-neon-blue transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={previousTrack}
                    >
                      <SkipBack className="w-8 h-8" />
                    </motion.button>

                    <motion.button
                      className="w-16 h-16 bg-neon-gradient rounded-full flex items-center justify-center shadow-neon hover:shadow-neon-strong transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? (
                        <Pause className="w-8 h-8 text-white" />
                      ) : (
                        <Play className="w-8 h-8 text-white ml-1" />
                      )}
                    </motion.button>

                    <motion.button
                      className="p-3 text-white hover:text-neon-blue transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={nextTrack}
                    >
                      <SkipForward className="w-8 h-8" />
                    </motion.button>

                    <motion.button
                      className={`p-3 transition-colors ${
                        repeat !== 'none' ? 'text-neon-green' : 'text-gray-400 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleRepeat}
                    >
                      <Repeat className="w-6 h-6" />
                    </motion.button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4">
                    <motion.button
                      className={`p-3 transition-colors ${
                        isLiked ? 'text-neon-pink' : 'text-gray-400 hover:text-neon-pink'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                    </motion.button>

                    <motion.button
                      className="p-3 text-gray-400 hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleShare}
                    >
                      <Share2 className="w-6 h-6" />
                    </motion.button>

                    <div className="relative">
                      <motion.button
                        className="p-3 text-gray-400 hover:text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                      >
                        <VolumeIcon className="w-6 h-6" />
                      </motion.button>
                      
                      <AnimatePresence>
                        {showVolumeSlider && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2"
                          >
                            <div className="bg-dark-300 p-3 rounded-lg shadow-lg">
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="w-32 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <motion.button
                      className="p-3 text-gray-400 hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MoreHorizontal className="w-6 h-6" />
                    </motion.button>
                  </div>
                </div>

                {/* Queue Sidebar */}
                <AnimatePresence>
                  {showQueue && (
                    <motion.div
                      className="w-80 border-l border-white/10 bg-dark-500/50"
                      initial={{ x: 320 }}
                      animate={{ x: 0 }}
                      exit={{ x: 320 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                      <div className="p-6">
                        <h3 className="text-white font-space font-bold mb-4">
                          Queue ({queue.length})
                        </h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {queue.map((track, index) => (
                            <div
                              key={`${track.id}-${index}`}
                              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                            >
                              <div className="w-10 h-10 bg-gradient-to-br from-neon-purple to-neon-blue rounded-lg overflow-hidden">
                                {track.cover_url ? (
                                  <img 
                                    src={track.cover_url} 
                                    alt={track.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-white text-sm">♪</div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">
                                  {track.title}
                                </p>
                                <p className="text-gray-400 text-xs truncate">
                                  {track.artist}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};