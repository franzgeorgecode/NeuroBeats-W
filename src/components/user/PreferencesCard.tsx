import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Music, Heart, Edit, Check, X } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';
import { useToast } from '../../hooks/useToast';

const AVAILABLE_GENRES = [
  'Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Jazz', 'Classical',
  'Country', 'R&B', 'Reggae', 'Blues', 'Folk', 'Punk',
  'Metal', 'Indie', 'Alternative', 'Latin', 'World', 'Ambient',
  'Techno', 'House', 'Dubstep', 'Trap', 'Funk', 'Soul'
];

export const PreferencesCard: React.FC = () => {
  const { user } = useUser();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get current preferences from user metadata
  const currentGenres = (user?.publicMetadata?.favoriteGenres as string[]) || [];
  const [selectedGenres, setSelectedGenres] = useState<string[]>(currentGenres);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => {
      if (prev.includes(genre)) {
        return prev.filter(g => g !== genre);
      } else if (prev.length < 8) {
        return [...prev, genre];
      }
      return prev;
    });
  };

  const handleSave = async () => {
    if (selectedGenres.length < 3) {
      showToast('Please select at least 3 genres', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await user?.update({
        publicMetadata: {
          ...user.publicMetadata,
          favoriteGenres: selectedGenres,
          updatedAt: new Date().toISOString(),
        }
      });
      
      showToast('Preferences updated successfully!', 'success');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating preferences:', error);
      showToast('Error updating preferences', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedGenres(currentGenres);
    setIsEditing(false);
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-neon-gradient rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-space font-bold text-white">
              Music Preferences
            </h3>
            <p className="text-gray-400 text-sm">
              Customize your music taste profile
            </p>
          </div>
        </div>
        
        {!isEditing && (
          <NeonButton
            variant="secondary"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </NeonButton>
        )}
      </div>

      {/* Current Genres */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <Music className="w-4 h-4 text-neon-purple mr-2" />
          <span className="text-white font-medium">
            Favorite Genres {isEditing && `(${selectedGenres.length}/8)`}
          </span>
        </div>
        
        {isEditing ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
              {AVAILABLE_GENRES.map((genre) => (
                <motion.button
                  key={genre}
                  className={`p-2 rounded-lg text-sm font-medium transition-all ${
                    selectedGenres.includes(genre)
                      ? 'bg-neon-gradient text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleGenreToggle(genre)}
                  disabled={!selectedGenres.includes(genre) && selectedGenres.length >= 8}
                >
                  {genre}
                </motion.button>
              ))}
            </div>
            
            {selectedGenres.length < 3 && (
              <p className="text-red-400 text-xs mb-4">
                Please select at least 3 genres
              </p>
            )}
            
            <div className="flex space-x-3">
              <NeonButton
                variant="primary"
                onClick={handleSave}
                disabled={isLoading || selectedGenres.length < 3}
                className="flex-1"
              >
                <Check className="w-4 h-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </NeonButton>
              <NeonButton
                variant="ghost"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </NeonButton>
            </div>
          </>
        ) : (
          <div className="flex flex-wrap gap-2">
            {currentGenres.length > 0 ? (
              currentGenres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-neon-gradient rounded-full text-white text-sm"
                >
                  {genre}
                </span>
              ))
            ) : (
              <p className="text-gray-400 text-sm">
                No genres selected yet
              </p>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {!isEditing && (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-3">
              <Heart className="w-4 h-4 text-neon-pink" />
              <span className="text-white text-sm">Liked Songs</span>
            </div>
            <span className="text-gray-400 text-sm">Coming Soon</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-3">
              <Music className="w-4 h-4 text-neon-blue" />
              <span className="text-white text-sm">Recently Played</span>
            </div>
            <span className="text-gray-400 text-sm">Coming Soon</span>
          </div>
        </div>
      )}
    </GlassCard>
  );
};