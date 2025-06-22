import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { AIPlaylistGenerator } from '../components/ai/AIPlaylistGenerator';
import { PlaylistGenerating } from '../components/ai/PlaylistGenerating';
import { GeneratedPlaylist } from '../components/ai/GeneratedPlaylist';
import { PlaylistCustomizer, CustomizationAdjustments } from '../components/ai/PlaylistCustomizer';
import { GeneratedPlaylist as PlaylistType } from '../services/aiPlaylistService';
import { useAIPlaylist } from '../hooks/useAIPlaylist';
import { useAppStore } from '../stores/appStore';
import { NeonButton } from '../components/ui/NeonButton';
import { useToast } from '../hooks/useToast';

type PageState = 'generator' | 'generating' | 'playlist' | 'customizer';

export const AIPlaylistPage: React.FC = () => {
  const [pageState, setPageState] = useState<PageState>('generator');
  const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistType | null>(null);
  const [showCustomizer, setShowCustomizer] = useState(false);

  const { setCurrentPage } = useAppStore();
  const { 
    generatePlaylist, 
    regeneratePlaylist, 
    isGenerating, 
    generationProgress, 
    currentStep,
    createRequestFromUserData 
  } = useAIPlaylist();
  const { showToast } = useToast();

  const handlePlaylistGenerated = (playlist: PlaylistType) => {
    setCurrentPlaylist(playlist);
    setPageState('playlist');
  };

  const handleRegenerate = async () => {
    if (!currentPlaylist) return;
    
    setPageState('generating');
    try {
      const originalRequest = createRequestFromUserData();
      const newPlaylist = await regeneratePlaylist(originalRequest);
      setCurrentPlaylist(newPlaylist);
      setPageState('playlist');
    } catch (error) {
      setPageState('playlist');
    }
  };

  const handleCustomize = async (adjustments: CustomizationAdjustments) => {
    if (!currentPlaylist) return;
    
    setShowCustomizer(false);
    setPageState('generating');
    
    try {
      const originalRequest = createRequestFromUserData();
      
      // Apply adjustments to the request
      const customRequest = {
        ...originalRequest,
        playlistLength: adjustments.playlistLength,
        excludeArtists: adjustments.removeArtists,
      };

      // Adjust mood if changed
      if (adjustments.moodShift !== currentPlaylist.dominantMood) {
        customRequest.mood = adjustments.moodShift as any;
      }

      const newPlaylist = await generatePlaylist(customRequest);
      setCurrentPlaylist(newPlaylist);
      setPageState('playlist');
      showToast('Playlist customized successfully!', 'success');
    } catch (error) {
      setPageState('playlist');
      showToast('Failed to customize playlist', 'error');
    }
  };

  const handleSavePlaylist = (playlist: PlaylistType) => {
    // In a real app, this would save to the user's library
    showToast(`"${playlist.name}" saved to your library!`, 'success');
  };

  const handleBackToGenerator = () => {
    setCurrentPlaylist(null);
    setPageState('generator');
  };

  // Show generating state when AI is working
  if (isGenerating || pageState === 'generating') {
    return (
      <PlaylistGenerating
        progress={generationProgress}
        currentStep={currentStep}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-600 to-dark-700 pt-24 pb-32">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-4 mb-6">
            <NeonButton
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage('home')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </NeonButton>
            
            {pageState === 'playlist' && (
              <NeonButton
                variant="ghost"
                size="sm"
                onClick={handleBackToGenerator}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate New Playlist
              </NeonButton>
            )}
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {pageState === 'generator' && (
            <motion.div
              key="generator"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <AIPlaylistGenerator onPlaylistGenerated={handlePlaylistGenerated} />
            </motion.div>
          )}

          {pageState === 'playlist' && currentPlaylist && (
            <motion.div
              key="playlist"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <GeneratedPlaylist
                playlist={currentPlaylist}
                onRegenerate={handleRegenerate}
                onSave={handleSavePlaylist}
              />
              
              {/* Customize Button */}
              <div className="mt-6 text-center">
                <NeonButton
                  variant="secondary"
                  onClick={() => setShowCustomizer(true)}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Customize Playlist
                </NeonButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Customizer Modal */}
        <AnimatePresence>
          {showCustomizer && currentPlaylist && (
            <PlaylistCustomizer
              playlist={currentPlaylist}
              onCustomize={handleCustomize}
              onClose={() => setShowCustomizer(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};