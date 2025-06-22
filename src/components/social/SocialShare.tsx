import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share2, 
  Twitter, 
  Facebook, 
  Instagram, 
  Copy, 
  Check,
  X,
  Music
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';
import { useToast } from '../../hooks/useToast';

interface SocialShareProps {
  isOpen: boolean;
  onClose: () => void;
  track?: {
    title: string;
    artist: string;
    cover_url?: string;
  };
  playlist?: {
    name: string;
    description: string;
    trackCount: number;
  };
}

export const SocialShare: React.FC<SocialShareProps> = ({
  isOpen,
  onClose,
  track,
  playlist,
}) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const getShareText = () => {
    if (track) {
      return `🎵 Currently listening to "${track.title}" by ${track.artist} on NeuroBeats! #NowPlaying #NeuroBeats`;
    }
    if (playlist) {
      return `🎶 Check out my playlist "${playlist.name}" with ${playlist.trackCount} amazing tracks on NeuroBeats! #Playlist #NeuroBeats`;
    }
    return '🎵 Discover amazing music on NeuroBeats - The future of music streaming! #NeuroBeats';
  };

  const getShareUrl = () => {
    return window.location.href;
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: track ? `${track.title} - ${track.artist}` : playlist?.name || 'NeuroBeats',
          text: getShareText(),
          url: getShareUrl(),
        });
        onClose();
      } catch (error) {
        // User cancelled or error occurred
      }
    }
  };

  const handleSocialShare = (platform: string) => {
    const text = encodeURIComponent(getShareText());
    const url = encodeURIComponent(getShareUrl());
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct URL sharing, copy to clipboard instead
        handleCopyLink();
        showToast('Link copied! Paste it in your Instagram story or post', 'info');
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      onClose();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      showToast('Link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      showToast('Failed to copy link', 'error');
    }
  };

  const socialPlatforms = [
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'from-blue-400 to-blue-600',
      action: () => handleSocialShare('twitter'),
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'from-blue-600 to-blue-800',
      action: () => handleSocialShare('facebook'),
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'from-pink-500 to-purple-600',
      action: () => handleSocialShare('instagram'),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full max-w-md"
            >
              <GlassCard className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-neon-gradient rounded-xl flex items-center justify-center">
                      <Share2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-space font-bold text-white">
                        Share
                      </h2>
                      <p className="text-gray-400 text-sm">
                        {track ? 'Share this track' : playlist ? 'Share this playlist' : 'Share NeuroBeats'}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Content Preview */}
                {(track || playlist) && (
                  <div className="mb-6 p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-blue rounded-lg overflow-hidden">
                        {track?.cover_url ? (
                          <img
                            src={track.cover_url}
                            alt={track.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Music className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">
                          {track?.title || playlist?.name}
                        </h3>
                        <p className="text-gray-400 text-sm truncate">
                          {track?.artist || playlist?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Native Share (if supported) */}
                {navigator.share && (
                  <div className="mb-4">
                    <NeonButton
                      variant="primary"
                      className="w-full"
                      onClick={handleNativeShare}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </NeonButton>
                  </div>
                )}

                {/* Social Platforms */}
                <div className="space-y-3 mb-4">
                  {socialPlatforms.map((platform) => {
                    const Icon = platform.icon;
                    
                    return (
                      <motion.button
                        key={platform.name}
                        className={`w-full flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r ${platform.color} hover:scale-105 transition-transform`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={platform.action}
                      >
                        <Icon className="w-5 h-5 text-white" />
                        <span className="text-white font-medium">
                          Share on {platform.name}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Copy Link */}
                <motion.button
                  className="w-full flex items-center justify-center space-x-2 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-white" />
                      <span className="text-white font-medium">Copy Link</span>
                    </>
                  )}
                </motion.button>
              </GlassCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};