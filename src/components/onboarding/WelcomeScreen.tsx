import React from 'react';
import { motion } from 'framer-motion';
import { Music, Headphones, Sparkles, Zap, Heart, TrendingUp } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

export const WelcomeScreen: React.FC = () => {
  const features = [
    {
      icon: Music,
      title: 'Millions of Songs',
      description: 'Access to a vast library of music from around the world',
      color: 'from-neon-purple to-neon-blue',
    },
    {
      icon: Headphones,
      title: 'High Quality Audio',
      description: 'Crystal clear sound with premium audio quality',
      color: 'from-neon-blue to-neon-cyan',
    },
    {
      icon: Zap,
      title: 'AI Recommendations',
      description: 'Personalized music suggestions powered by AI',
      color: 'from-neon-cyan to-neon-green',
    },
    {
      icon: Heart,
      title: 'Your Favorites',
      description: 'Create playlists and save your favorite tracks',
      color: 'from-neon-green to-neon-pink',
    },
    {
      icon: TrendingUp,
      title: 'Trending Charts',
      description: 'Stay updated with the latest trending music',
      color: 'from-neon-pink to-neon-purple',
    },
    {
      icon: Sparkles,
      title: 'Immersive Experience',
      description: 'Beautiful visualizations and smooth animations',
      color: 'from-neon-purple to-neon-blue',
    },
  ];

  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <div className="w-24 h-24 bg-neon-gradient rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-neon">
          <Music className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-5xl font-space font-bold text-white mb-4">
          Welcome to NeuroBeats
        </h1>
        
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Experience the future of music with AI-powered recommendations, 
          immersive visualizations, and a vast library of high-quality tracks.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            >
              <GlassCard className="p-6 h-full hover:scale-105 transition-transform duration-300">
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-lg font-space font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-12"
      >
        <p className="text-gray-400 text-lg">
          Let's personalize your music experience in just a few steps
        </p>
      </motion.div>
    </div>
  );
};