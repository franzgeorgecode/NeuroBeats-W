import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Sliders, 
  Zap, 
  Heart, 
  Music, 
  RefreshCw,
  Save,
  X,
  Plus,
  Minus,
  Target
} from 'lucide-react';
import { GeneratedPlaylist } from '../../services/aiPlaylistService';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';

interface PlaylistCustomizerProps {
  playlist: GeneratedPlaylist;
  onCustomize: (adjustments: CustomizationAdjustments) => void;
  onClose: () => void;
  className?: string;
}

export interface CustomizationAdjustments {
  energyAdjustment: number; // -2 to +2
  moodShift: string;
  genreWeights: { [genre: string]: number };
  removeArtists: string[];
  addSimilarTo: string[];
  playlistLength: number;
}

const MOOD_OPTIONS = [
  { id: 'energetic', label: 'More Energetic', icon: Zap, color: 'from-yellow-500 to-orange-500' },
  { id: 'chill', label: 'More Chill', icon: Heart, color: 'from-blue-500 to-purple-500' },
  { id: 'focus', label: 'Better Focus', icon: Target, color: 'from-green-500 to-teal-500' },
  { id: 'party', label: 'Party Vibes', icon: Music, color: 'from-pink-500 to-red-500' },
];

export const PlaylistCustomizer: React.FC<PlaylistCustomizerProps> = ({
  playlist,
  onCustomize,
  onClose,
  className = '',
}) => {
  const [adjustments, setAdjustments] = useState<CustomizationAdjustments>({
    energyAdjustment: 0,
    moodShift: playlist.dominantMood,
    genreWeights: {},
    removeArtists: [],
    addSimilarTo: [],
    playlistLength: playlist.tracks.length,
  });

  const [activeTab, setActiveTab] = useState<'energy' | 'mood' | 'artists' | 'length'>('energy');

  // Get unique artists from playlist
  const playlistArtists = Array.from(new Set(playlist.tracks.map(track => track.artist)));
  
  // Get unique genres from playlist
  const playlistGenres = Array.from(new Set(
    playlist.tracks.map(track => track.genre).filter(Boolean)
  ));

  const handleEnergyChange = (delta: number) => {
    const newEnergy = Math.max(-2, Math.min(2, adjustments.energyAdjustment + delta));
    setAdjustments(prev => ({ ...prev, energyAdjustment: newEnergy }));
  };

  const handleMoodChange = (mood: string) => {
    setAdjustments(prev => ({ ...prev, moodShift: mood }));
  };

  const handleArtistToggle = (artist: string, action: 'remove' | 'similar') => {
    if (action === 'remove') {
      setAdjustments(prev => ({
        ...prev,
        removeArtists: prev.removeArtists.includes(artist)
          ? prev.removeArtists.filter(a => a !== artist)
          : [...prev.removeArtists, artist],
      }));
    } else {
      setAdjustments(prev => ({
        ...prev,
        addSimilarTo: prev.addSimilarTo.includes(artist)
          ? prev.addSimilarTo.filter(a => a !== artist)
          : [...prev.addSimilarTo, artist],
      }));
    }
  };

  const handleLengthChange = (delta: number) => {
    const newLength = Math.max(10, Math.min(50, adjustments.playlistLength + delta));
    setAdjustments(prev => ({ ...prev, playlistLength: newLength }));
  };

  const handleApplyChanges = () => {
    onCustomize(adjustments);
  };

  const hasChanges = () => {
    return (
      adjustments.energyAdjustment !== 0 ||
      adjustments.moodShift !== playlist.dominantMood ||
      adjustments.removeArtists.length > 0 ||
      adjustments.addSimilarTo.length > 0 ||
      adjustments.playlistLength !== playlist.tracks.length
    );
  };

  const getEnergyLabel = (adjustment: number) => {
    const baseEnergy = playlist.averageEnergy;
    const newEnergy = Math.max(1, Math.min(10, baseEnergy + adjustment * 2));
    
    if (newEnergy >= 8) return 'High Energy';
    if (newEnergy >= 6) return 'Medium Energy';
    if (newEnergy >= 4) return 'Moderate';
    return 'Chill';
  };

  const tabs = [
    { id: 'energy', label: 'Energy', icon: Zap },
    { id: 'mood', label: 'Mood', icon: Heart },
    { id: 'artists', label: 'Artists', icon: Music },
    { id: 'length', label: 'Length', icon: Settings },
  ];

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <GlassCard className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-space font-bold text-white">
                Customize Playlist
              </h2>
              <p className="text-gray-400">
                Fine-tune "{playlist.name}" to your liking
              </p>
            </div>
            <motion.button
              className="p-2 text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 mb-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <motion.button
                  key={tab.id}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-neon-gradient text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as any)}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="mb-6"
            >
              {activeTab === 'energy' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Adjust Energy Level
                    </h3>
                    <div className="flex items-center justify-center space-x-4">
                      <motion.button
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEnergyChange(-1)}
                        disabled={adjustments.energyAdjustment <= -2}
                      >
                        <Minus className="w-5 h-5 text-white" />
                      </motion.button>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                          {getEnergyLabel(adjustments.energyAdjustment)}
                        </div>
                        <div className="text-sm text-gray-400">
                          {adjustments.energyAdjustment > 0 && '+'}
                          {adjustments.energyAdjustment} adjustment
                        </div>
                      </div>
                      
                      <motion.button
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEnergyChange(1)}
                        disabled={adjustments.energyAdjustment >= 2}
                      >
                        <Plus className="w-5 h-5 text-white" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">
                      Current playlist energy: <span className="text-neon-purple font-medium">
                        {playlist.averageEnergy.toFixed(1)}/10
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'mood' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Change Mood Direction
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {MOOD_OPTIONS.map((mood) => {
                      const Icon = mood.icon;
                      const isSelected = adjustments.moodShift === mood.id;
                      
                      return (
                        <motion.button
                          key={mood.id}
                          className={`p-4 rounded-lg border transition-all ${
                            isSelected
                              ? 'border-neon-purple bg-neon-purple/20 text-white'
                              : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleMoodChange(mood.id)}
                        >
                          <div className={`w-8 h-8 bg-gradient-to-r ${mood.color} rounded-lg flex items-center justify-center mb-2`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">{mood.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'artists' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Artist Preferences
                    </h3>
                    <div className="space-y-4">
                      {playlistArtists.slice(0, 8).map((artist) => (
                        <div key={artist} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <span className="text-white font-medium">{artist}</span>
                          <div className="flex space-x-2">
                            <motion.button
                              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                adjustments.addSimilarTo.includes(artist)
                                  ? 'bg-green-500 text-white'
                                  : 'bg-white/10 text-gray-300 hover:bg-green-500/20 hover:text-green-400'
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleArtistToggle(artist, 'similar')}
                            >
                              More Like This
                            </motion.button>
                            <motion.button
                              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                adjustments.removeArtists.includes(artist)
                                  ? 'bg-red-500 text-white'
                                  : 'bg-white/10 text-gray-300 hover:bg-red-500/20 hover:text-red-400'
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleArtistToggle(artist, 'remove')}
                            >
                              Remove
                            </motion.button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'length' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Playlist Length
                    </h3>
                    <div className="flex items-center justify-center space-x-4">
                      <motion.button
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleLengthChange(-5)}
                        disabled={adjustments.playlistLength <= 10}
                      >
                        <Minus className="w-5 h-5 text-white" />
                      </motion.button>
                      
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-1">
                          {adjustments.playlistLength}
                        </div>
                        <div className="text-sm text-gray-400">tracks</div>
                      </div>
                      
                      <motion.button
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleLengthChange(5)}
                        disabled={adjustments.playlistLength >= 50}
                      >
                        <Plus className="w-5 h-5 text-white" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">
                      Current playlist: <span className="text-neon-purple font-medium">
                        {playlist.tracks.length} tracks
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <div className="text-sm text-gray-400">
              {hasChanges() ? 'Changes will regenerate the playlist' : 'No changes made'}
            </div>
            
            <div className="flex space-x-3">
              <NeonButton variant="ghost" onClick={onClose}>
                Cancel
              </NeonButton>
              <NeonButton
                variant="primary"
                onClick={handleApplyChanges}
                disabled={!hasChanges()}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Apply Changes
              </NeonButton>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};