import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Heart, 
  MoreHorizontal, 
  Music,
  Users,
  Clock
} from 'lucide-react';
import { GlassCard } from './GlassCard';

interface PlaylistCardProps {
  playlist: {
    id: string;
    title: string;
    description?: string;
    creator?: string;
    trackCount: number;
    duration?: number;
    coverUrl?: string;
    covers?: string[]; // For multi-cover display
    isPublic?: boolean;
    followers?: number;
  };
  variant?: 'default' | 'compact';
  onPlay?: (playlist: any) => void;
  onLike?: (playlist: any) => void;
  className?: string;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  variant = 'default',
  onPlay,
  onLike,
  className = '',
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    onPlay?.(playlist);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(playlist);
  };

  const renderCover = () => {
    if (playlist.covers && playlist.covers.length > 1) {
      // Multi-cover grid (2x2)
      return (
        <div className="w-full h-full grid grid-cols-2 gap-0.5">
          {playlist.covers.slice(0, 4).map((cover, index) => (
            <div key={index} className="bg-gradient-to-br from-neon-purple to-neon-blue overflow-hidden">
              {cover ? (
                <img
                  src={cover}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    // Single cover
    return (
      <div className="w-full h-full bg-gradient-to-br from-neon-purple to-neon-blue">
        {playlist.coverUrl ? (
          <img
            src={playlist.coverUrl}
            alt={playlist.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music className="w-12 h-12 text-white" />
          </div>
        )}
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <motion.div
        className={`group ${className}`}
        whileHover={{ scale: 1.02 }}
      >
        <GlassCard className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-xl overflow-hidden">
                {renderCover()}
              </div>
              
              <motion.button
                className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePlay}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-0.5" />
                )}
              </motion.button>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold truncate">
                {playlist.title}
              </h3>
              {playlist.creator && (
                <p className="text-gray-400 text-sm truncate">
                  by {playlist.creator}
                </p>
              )}
              <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                <span>{playlist.trackCount} tracks</span>
                {playlist.duration && (
                  <span>{formatDuration(playlist.duration)}</span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
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
        </GlassCard>
      </motion.div>
    );
  }

  // Default card variant
  return (
    <motion.div
      className={`group ${className}`}
      whileHover={{ scale: 1.02 }}
    >
      <GlassCard className="p-6">
        <div className="relative mb-4">
          <div className="w-full aspect-square rounded-xl overflow-hidden">
            {renderCover()}
          </div>

          {/* Play Button Overlay */}
          <motion.button
            className="absolute bottom-4 right-4 w-12 h-12 bg-neon-gradient rounded-full flex items-center justify-center shadow-neon opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePlay}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-0.5" />
            )}
          </motion.button>

          {/* Quick Actions */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
            >
              <MoreHorizontal className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Public/Private Indicator */}
          {playlist.isPublic !== undefined && (
            <div className="absolute top-4 left-4">
              <div className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                playlist.isPublic 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-gray-500/20 text-gray-400'
              }`}>
                {playlist.isPublic ? 'Public' : 'Private'}
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-white font-semibold mb-1 truncate">
            {playlist.title}
          </h3>
          
          {playlist.description && (
            <p className="text-gray-400 text-sm mb-2 line-clamp-2">
              {playlist.description}
            </p>
          )}
          
          {playlist.creator && (
            <p className="text-gray-400 text-sm mb-2">
              by {playlist.creator}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Music className="w-3 h-3" />
                <span>{playlist.trackCount}</span>
              </div>
              
              {playlist.duration && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatDuration(playlist.duration)}</span>
                </div>
              )}
            </div>

            {playlist.followers && (
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{formatFollowers(playlist.followers)}</span>
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};