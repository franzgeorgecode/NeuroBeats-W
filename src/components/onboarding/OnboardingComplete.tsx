import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Music, Heart, TrendingUp, CheckCircle } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';
import { useAppStore } from '../../stores/appStore';
import type { SelectedSong } from './OnboardingFlow';

interface OnboardingCompleteProps {
  selectedGenres: string[];
  selectedSongs: SelectedSong[];
}

export const OnboardingComplete: React.FC<OnboardingCompleteProps> = ({
  selectedGenres,
  selectedSongs,
}) => {
  const { setCurrentPage } = useAppStore();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    setCurrentPage('home');
  };

  return (
    <div className="text-center relative">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-neon-gradient rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: -10,
                rotate: 0,
              }}
              animate={{
                y: window.innerHeight + 10,
                rotate: 360,
              }}
              transition={{
                duration: 3,
                delay: Math.random() * 2,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="w-24 h-24 bg-neon-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-neon">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-5xl font-space font-bold text-white mb-4">
          Welcome to NeuroBeats!
        </h1>
        
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Your music profile has been created successfully. Get ready to discover 
          amazing tracks tailored just for you!
        </p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8"
      >
        {/* Genres Summary */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-neon-purple to-neon-blue rounded-xl flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-space font-bold text-white mb-3">
            Your Favorite Genres
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {selectedGenres.map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 bg-neon-gradient rounded-full text-white text-sm font-inter"
              >
                {genre}
              </span>
            ))}
          </div>
        </GlassCard>

        {/* Songs Summary */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-neon-pink to-neon-purple rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-space font-bold text-white mb-3">
            Your Selected Songs
          </h3>
          <div className="space-y-2">
            {selectedSongs.slice(0, 3).map((song) => (
              <div key={song.id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-neon-purple to-neon-blue rounded-lg overflow-hidden">
                  {song.cover_url ? (
                    <img
                      src={song.cover_url}
                      alt={song.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white text-sm font-medium truncate">
                    {song.title}
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    {song.artist}
                  </p>
                </div>
              </div>
            ))}
            {selectedSongs.length > 3 && (
              <p className="text-gray-400 text-xs">
                +{selectedSongs.length - 3} more songs
              </p>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Features Preview */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-space font-bold text-white mb-6">
          What's Next?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            {
              icon: TrendingUp,
              title: 'Discover Music',
              description: 'Explore trending tracks and personalized recommendations',
              color: 'from-neon-purple to-neon-blue',
            },
            {
              icon: Heart,
              title: 'Create Playlists',
              description: 'Build your own collections and save favorite songs',
              color: 'from-neon-blue to-neon-cyan',
            },
            {
              icon: Sparkles,
              title: 'AI Recommendations',
              description: 'Get smart suggestions based on your listening habits',
              color: 'from-neon-cyan to-neon-green',
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              >
                <GlassCard className="p-4 h-full">
                  <div className={`w-10 h-10 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-3 mx-auto`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-space font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Get Started Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <NeonButton
          variant="primary"
          size="lg"
          onClick={handleGetStarted}
          className="px-12 py-4 text-xl"
        >
          <Sparkles className="w-6 h-6 mr-3" />
          Start Exploring Music
        </NeonButton>
      </motion.div>
    </div>
  );
};