import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Music, 
  Clock, 
  Sun, 
  Moon, 
  Coffee,
  Sunset,
  Dumbbell,
  Brain,
  Heart,
  Volume2,
  Settings,
  Wand2
} from 'lucide-react';
import { useAIPlaylist } from '../../hooks/useAIPlaylist';
import { AIPlaylistRequest } from '../../services/aiPlaylistService';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';

interface AIPlaylistGeneratorProps {
  onPlaylistGenerated: (playlist: any) => void;
  className?: string;
}

const MOODS = [
  { id: 'energetic', label: 'Energetic', icon: Zap, color: 'from-yellow-500 to-orange-500', description: 'High energy, upbeat tracks' },
  { id: 'chill', label: 'Chill', icon: Heart, color: 'from-blue-500 to-purple-500', description: 'Relaxed, laid-back vibes' },
  { id: 'focus', label: 'Focus', icon: Brain, color: 'from-green-500 to-teal-500', description: 'Concentration and productivity' },
  { id: 'party', label: 'Party', icon: Volume2, color: 'from-pink-500 to-red-500', description: 'Dance and celebration' },
  { id: 'workout', label: 'Workout', icon: Dumbbell, color: 'from-orange-500 to-red-500', description: 'High intensity training' },
  { id: 'sleep', label: 'Sleep', icon: Moon, color: 'from-indigo-500 to-purple-500', description: 'Peaceful, calming sounds' },
];

const TIME_PERIODS = [
  { id: 'morning', label: 'Morning', icon: Sun, description: 'Start your day right' },
  { id: 'afternoon', label: 'Afternoon', icon: Coffee, description: 'Midday energy boost' },
  { id: 'evening', label: 'Evening', icon: Sunset, description: 'Wind down time' },
  { id: 'night', label: 'Night', icon: Moon, description: 'Late night vibes' },
];

const PLAYLIST_LENGTHS = [
  { value: 12, label: '12 tracks', duration: '~45 min' },
  { value: 18, label: '18 tracks', duration: '~1 hour' },
  { value: 24, label: '24 tracks', duration: '~1.5 hours' },
  { value: 30, label: '30 tracks', duration: '~2 hours' },
];

export const AIPlaylistGenerator: React.FC<AIPlaylistGeneratorProps> = ({
  onPlaylistGenerated,
  className = '',
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customRequest, setCustomRequest] = useState<Partial<AIPlaylistRequest>>({
    mood: 'chill',
    timeOfDay: 'afternoon',
    playlistLength: 18,
    includeNewDiscoveries: true,
  });

  const { generatePlaylist, isGenerating, createRequestFromUserData } = useAIPlaylist();

  const handleQuickGenerate = async () => {
    try {
      const playlist = await generatePlaylist();
      onPlaylistGenerated(playlist);
    } catch (error) {
      console.error('Failed to generate playlist:', error);
    }
  };

  const handleCustomGenerate = async () => {
    try {
      const playlist = await generatePlaylist(customRequest);
      onPlaylistGenerated(playlist);
    } catch (error) {
      console.error('Failed to generate custom playlist:', error);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Quick Generate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard className="p-8 text-center bg-neon-gradient">
          <div className="mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-space font-bold text-white mb-2">
              AI Playlist Generator
            </h2>
            <p className="text-xl text-white/80">
              Let AI create the perfect playlist based on your taste
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <NeonButton
              variant="secondary"
              size="lg"
              onClick={handleQuickGenerate}
              disabled={isGenerating}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30 px-12 py-4"
            >
              <Wand2 className="w-6 h-6 mr-3" />
              {isGenerating ? 'Generating Magic...' : 'Generate My Playlist'}
            </NeonButton>
          </motion.div>

          <motion.button
            className="mt-4 text-white/80 hover:text-white transition-colors text-sm flex items-center mx-auto"
            onClick={() => setShowAdvanced(!showAdvanced)}
            whileHover={{ scale: 1.05 }}
          >
            <Settings className="w-4 h-4 mr-2" />
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </motion.button>
        </GlassCard>
      </motion.div>

      {/* Advanced Options */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Mood Selection */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-space font-bold text-white mb-4">
                Choose Your Mood
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {MOODS.map((mood) => {
                  const Icon = mood.icon;
                  const isSelected = customRequest.mood === mood.id;
                  
                  return (
                    <motion.button
                      key={mood.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-neon-purple bg-neon-purple/20 text-white'
                          : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40 hover:bg-white/10'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCustomRequest(prev => ({ ...prev, mood: mood.id as any }))}
                    >
                      <div className={`w-8 h-8 bg-gradient-to-r ${mood.color} rounded-lg flex items-center justify-center mb-2`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-semibold text-sm">{mood.label}</h4>
                      <p className="text-xs opacity-80 mt-1">{mood.description}</p>
                    </motion.button>
                  );
                })}
              </div>
            </GlassCard>

            {/* Time of Day */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-space font-bold text-white mb-4">
                Time of Day
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {TIME_PERIODS.map((time) => {
                  const Icon = time.icon;
                  const isSelected = customRequest.timeOfDay === time.id;
                  
                  return (
                    <motion.button
                      key={time.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-neon-blue bg-neon-blue/20 text-white'
                          : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40 hover:bg-white/10'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCustomRequest(prev => ({ ...prev, timeOfDay: time.id as any }))}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2" />
                      <h4 className="font-semibold text-sm">{time.label}</h4>
                      <p className="text-xs opacity-80 mt-1">{time.description}</p>
                    </motion.button>
                  );
                })}
              </div>
            </GlassCard>

            {/* Playlist Length */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-space font-bold text-white mb-4">
                Playlist Length
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {PLAYLIST_LENGTHS.map((length) => {
                  const isSelected = customRequest.playlistLength === length.value;
                  
                  return (
                    <motion.button
                      key={length.value}
                      className={`p-4 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-neon-cyan bg-neon-cyan/20 text-white'
                          : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40 hover:bg-white/10'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCustomRequest(prev => ({ ...prev, playlistLength: length.value }))}
                    >
                      <Music className="w-6 h-6 mx-auto mb-2" />
                      <h4 className="font-semibold text-sm">{length.label}</h4>
                      <p className="text-xs opacity-80 mt-1">{length.duration}</p>
                    </motion.button>
                  );
                })}
              </div>
            </GlassCard>

            {/* Additional Options */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-space font-bold text-white mb-4">
                Discovery Settings
              </h3>
              <div className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customRequest.includeNewDiscoveries}
                    onChange={(e) => setCustomRequest(prev => ({ 
                      ...prev, 
                      includeNewDiscoveries: e.target.checked 
                    }))}
                    className="w-5 h-5 rounded border-white/20 bg-white/10 text-neon-purple focus:ring-neon-purple focus:ring-offset-0"
                  />
                  <div>
                    <span className="text-white font-medium">Include New Discoveries</span>
                    <p className="text-gray-400 text-sm">Add 30% new artists to expand your taste</p>
                  </div>
                </label>
              </div>
            </GlassCard>

            {/* Generate Button */}
            <div className="text-center">
              <NeonButton
                variant="primary"
                size="lg"
                onClick={handleCustomGenerate}
                disabled={isGenerating}
                className="px-12 py-4"
              >
                <Sparkles className="w-6 h-6 mr-3" />
                {isGenerating ? 'Creating Your Playlist...' : 'Generate Custom Playlist'}
              </NeonButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};