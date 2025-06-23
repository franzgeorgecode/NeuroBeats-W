import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioPreviewProps {
  audioUrl: string;
  trackTitle?: string;
  onPlay?: () => void;
  onPause?: () => void;
  className?: string;
  variant?: 'button' | 'inline';
  size?: 'sm' | 'md' | 'lg';
}

export const AudioPreview: React.FC<AudioPreviewProps> = ({
  audioUrl,
  trackTitle = 'Audio Preview',
  onPlay,
  onPause,
  className = '',
  variant = 'button',
  size = 'md',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30); // Deezer previews are 30 seconds
  const [volume, setVolume] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 30);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onPause?.();
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleError = (e: any) => {
      setIsLoading(false);
      setIsPlaying(false);
      console.warn('Audio preview failed to load:', audioUrl, e.target?.error);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl, onPause]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        onPause?.();
      } else {
        // Reset to beginning if at the end
        if (currentTime >= duration - 1) {
          audio.currentTime = 0;
          setCurrentTime(0);
        }
        
        // Ensure audio is loaded before playing
        if (audio.readyState < 2) {
          setIsLoading(true);
          await new Promise((resolve) => {
            const handleCanPlay = () => {
              audio.removeEventListener('canplay', handleCanPlay);
              resolve(void 0);
            };
            audio.addEventListener('canplay', handleCanPlay);
          });
          setIsLoading(false);
        }
        
        await audio.play();
        setIsPlaying(true);
        onPlay?.();
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const buttonSizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  };

  if (variant === 'button') {
    return (
      <>
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
        />
        
        <motion.button
          className={`${buttonSizeClasses[size]} text-gray-400 hover:text-neon-purple transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={togglePlayback}
          disabled={isLoading || !audioUrl}
          title={`${isPlaying ? 'Pause' : 'Play'} preview - ${trackTitle}`}
        >
          {isLoading ? (
            <div className={`${sizeClasses[size]} border-2 border-current border-t-transparent rounded-full animate-spin`} />
          ) : isPlaying ? (
            <Pause className={sizeClasses[size]} />
          ) : (
            <Play className={sizeClasses[size]} />
          )}
        </motion.button>
      </>
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
      />
      
      {/* Play/Pause Button */}
      <motion.button
        className={`${buttonSizeClasses[size]} text-gray-400 hover:text-neon-purple transition-colors disabled:opacity-50`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlayback}
        disabled={isLoading || !audioUrl}
      >
        {isLoading ? (
          <div className={`${sizeClasses[size]} border-2 border-current border-t-transparent rounded-full animate-spin`} />
        ) : isPlaying ? (
          <Pause className={sizeClasses[size]} />
        ) : (
          <Play className={sizeClasses[size]} />
        )}
      </motion.button>

      {/* Progress Bar */}
      <div className="flex-1 min-w-0">
        <div
          className="w-full h-1 bg-gray-600 rounded-full cursor-pointer overflow-hidden"
          onClick={handleSeek}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-neon-purple to-neon-pink rounded-full"
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        
        {/* Time Display */}
        <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-2">
        <Volume2 className="w-4 h-4 text-gray-400" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-16 h-1 bg-gray-600 rounded-full appearance-none slider"
        />
      </div>
    </div>
  );
};

export default AudioPreview;