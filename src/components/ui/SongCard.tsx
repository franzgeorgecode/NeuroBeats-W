import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  Heart, 
  MoreHorizontal, 
  Plus,
  Share2,
  Download,
  Music
} from 'lucide-react';
import { usePlayerStore } from '../../stores/playerStore';
import { GlassCard } from './GlassCard';

interface SongCardProps {
  song: {
    id: string;
    title: string;
    artist: string;
    album?: string;
    artistId?: string;
    albumId?: string;
    duration: number;
    cover_url?: string;
    audio_url: string;
    plays_count?: number;
  };
  index?: number;
  showIndex?: boolean;
  variant?: 'default' | 'compact' | 'list';
  onPlay?: (song: any) => void;
  onAddToQueue?: (song: any) => void;
  onLike?: (song: any) => void;
  className?: string;
}

export const SongCard: React.FC<SongCardProps> = ({
  song,
  index,
  showIndex = false,
  variant = 'default',
  onPlay,
  onAddToQueue,
  onLike,
  className = '',
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const { currentTrack, isPlaying, setCurrentTrack, setIsPlaying } = usePlayerStore();
  const navigate = useNavigate();

  const isCurrentTrack = currentTrack?.id === song.id;
  const isCurrentlyPlaying = isCurrentTrack && isPlaying;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPlays = (plays: number) => {
    if (plays >= 1000000) {
      return `${(plays / 1000000).toFixed(1)}M`;
    } else if (plays >= 1000) {
      return `${(plays / 1000).toFixed(1)}K`;
    }
    return plays.toString();
  };

  const handlePlay = () => {
    if (isCurrentTrack) {
      setIsPlaying(!isPlaying);
    } else {
      const track = {
        id: song.id,
        title: song.title,
        artist: song.artist,
        album: song.album || '',
        duration: song.duration,
        cover_url: song.cover_url,
        audio_url: song.audio_url,
        genre: '',
        release_date: '',
        plays_count: song.plays_count || 0,
        likes_count: 0,
        created_at: new Date().toISOString(),
      };
      setCurrentTrack(track);
      setIsPlaying(true);
    }
    onPlay?.(song);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(song);
  };

  const handleAddToQueue = () => {
    onAddToQueue?.(song);
  };

  if (variant === 'compact') {
    return (
      <motion.div
        className={`group relative ${className}`}
        whileHover={{ scale: 1.02 }}
        onHoverStart={() => setShowActions(true)}
        onHoverEnd={() => setShowActions(false)}
      >
        <GlassCard className="p-4">
          <div className="flex items-center space-x-3">
            {showIndex && (
              <div className="w-6 text-center">
                <span className="text-gray-400 text-sm font-mono">
                  {(index! + 1).toString().padStart(2, '0')}
                </span>
              </div>
            )}

            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-blue rounded-lg overflow-hidden">
                {song.cover_url ? (
                  <img
                    src={song.cover_url}
                    alt={song.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              
              <motion.button
                className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePlay}
              >
                {isCurrentlyPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white ml-0.5" />
                )}
              </motion.button>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className={`font-medium truncate ${
                isCurrentTrack ? 'text-neon-purple' : 'text-white'
              }`}>
                {song.title}
              </h3>
              <p
                className="text-gray-400 text-sm truncate cursor-pointer hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  if (song.artistId) navigate(`/artist/${song.artistId}`);
                }}
              >
                {song.artist}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">
                {formatDuration(song.duration)}
              </span>
              
              <motion.button
                className={`p-2 transition-colors ${
                  isLiked ? 'text-neon-pink' : 'text-gray-400 hover:text-neon-pink'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </motion.button>

              <motion.button
                className="p-2 text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToQueue}
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    );
  }

  if (variant === 'list') {
    return (
      <motion.div
        className={`group ${className}`}
        whileHover={{ x: 4 }}
        onHoverStart={() => setShowActions(true)}
        onHoverEnd={() => setShowActions(false)}
      >
        <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
          {showIndex && (
            <div className="w-8 text-center">
              <span className="text-gray-400 text-sm font-mono">
                {(index! + 1).toString().padStart(2, '0')}
              </span>
            </div>
          )}

          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-neon-purple to-neon-blue rounded-lg overflow-hidden">
              {song.cover_url ? (
                <img
                  src={song.cover_url}
                  alt={song.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            
            <motion.button
              className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePlay}
            >
              {isCurrentlyPlaying ? (
                <Pause className="w-4 h-4 text-white" />
              ) : (
                <Play className="w-4 h-4 text-white ml-0.5" />
              )}
            </motion.button>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={`font-medium truncate ${
              isCurrentTrack ? 'text-neon-purple' : 'text-white'
            }`}>
              {song.title}
            </h3>
            <div className="text-gray-400 text-sm truncate">
              <span
                className={song.artistId ? "cursor-pointer hover:underline" : ""}
                onClick={(e) => {
                  if (song.artistId) {
                    e.stopPropagation();
                    navigate(`/artist/${song.artistId}`);
                  }
                }}
              >
                {song.artist}
              </span>
              {song.album && (
                <span
                  className={song.albumId ? "cursor-pointer hover:underline" : ""}
                  onClick={(e) => {
                    if (song.albumId) {
                      e.stopPropagation();
                      navigate(`/album/${song.albumId}`);
                    }
                  }}
                >
                  {` • ${song.album}`}
                </span>
              )}
            </div>
          </div>

          {song.plays_count && (
            <div className="text-gray-400 text-sm">
              {formatPlays(song.plays_count)}
            </div>
          )}

          <div className="text-gray-400 text-sm">
            {formatDuration(song.duration)}
          </div>

          <div className="flex items-center space-x-1">
            <motion.button
              className={`p-2 transition-colors ${
                isLiked ? 'text-neon-pink' : 'text-gray-400 hover:text-neon-pink'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </motion.button>

            <motion.button
              className="p-2 text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MoreHorizontal className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default card variant
  return (
    <motion.div
      className={`group relative ${className}`}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
    >
      <GlassCard className="p-6">
        <div className="relative mb-4">
          <div className="w-full aspect-square bg-gradient-to-br from-neon-purple to-neon-blue rounded-xl overflow-hidden">
            {song.cover_url ? (
              <img
                src={song.cover_url}
                alt={song.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music className="w-12 h-12 text-white" />
              </div>
            )}
          </div>

          {/* Play Button Overlay */}
          <motion.button
            className="absolute bottom-4 right-4 w-12 h-12 bg-neon-gradient rounded-full flex items-center justify-center shadow-neon opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePlay}
          >
            {isCurrentlyPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-0.5" />
            )}
          </motion.button>

          {/* Quick Actions */}
          <motion.div
            className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ y: -10 }}
            animate={{ y: showActions ? 0 : -10 }}
          >
            <motion.button
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
                isLiked 
                  ? 'bg-neon-pink text-white' 
                  : 'bg-black/30 text-gray-300 hover:text-neon-pink'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </motion.button>

            <motion.button
              className="w-8 h-8 bg-black/30 rounded-full flex items-center justify-center backdrop-blur-sm text-gray-300 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToQueue}
            >
              <Plus className="w-4 h-4" />
            </motion.button>

            <motion.button
              className="w-8 h-8 bg-black/30 rounded-full flex items-center justify-center backdrop-blur-sm text-gray-300 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MoreHorizontal className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>

        <div className="text-center">
          <h3 className={`font-semibold mb-1 truncate ${
            isCurrentTrack ? 'text-neon-purple' : 'text-white'
          }`}>
            {song.title}
          </h3>
          <p
            className="text-gray-400 text-sm truncate mb-2 cursor-pointer hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              if (song.artistId) navigate(`/artist/${song.artistId}`);
            }}
          >
            {song.artist}
          </p>
          {song.album && (
            <p
              className="text-gray-500 text-xs truncate mb-2 cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                if (song.albumId) navigate(`/album/${song.albumId}`);
              }}
            >
              {song.album}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{formatDuration(song.duration)}</span>
            {song.plays_count && (
              <span>{formatPlays(song.plays_count)} plays</span>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};