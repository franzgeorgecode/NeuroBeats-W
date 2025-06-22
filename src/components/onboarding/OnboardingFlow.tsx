import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Sparkles } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { WelcomeScreen } from './WelcomeScreen';
import { GenreSelector } from './GenreSelector';
import { SongSelector } from './SongSelector';
import { OnboardingProgress } from './OnboardingProgress';
import { OnboardingComplete } from './OnboardingComplete';
import { useToast } from '../../hooks/useToast';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';

export interface SelectedSong {
  id: string;
  title: string;
  artist: string;
  preview_url: string;
  cover_url?: string;
  duration: number;
}

const ONBOARDING_STEPS = [
  { id: 'welcome', title: 'Welcome', description: 'Welcome to NeuroBeats' },
  { id: 'genres', title: 'Genres', description: 'Choose your favorite genres' },
  { id: 'songs', title: 'Songs', description: 'Select your favorite tracks' },
  { id: 'complete', title: 'Complete', description: 'All set!' },
];

export const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<SelectedSong[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSkipConfirmation, setShowSkipConfirmation] = useState(false);

  const { user } = useUser();
  const { showToast } = useToast();

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true; // Welcome screen
      case 1: return selectedGenres.length >= 3; // Genres (minimum 3)
      case 2: return selectedSongs.length === 5; // Songs (exactly 5)
      case 3: return true; // Complete screen
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setShowSkipConfirmation(true);
  };

  const confirmSkip = async () => {
    setIsLoading(true);
    try {
      if (user) {
        await user.update({
          publicMetadata: {
            ...user.publicMetadata,
            onboardingCompleted: true,
            favoriteGenres: [],
            selectedSongs: [],
          }
        });
      }
      showToast('Onboarding skipped. You can update preferences later.', 'info');
    } catch (error) {
      console.error('Error skipping onboarding:', error);
      showToast('Error skipping onboarding', 'error');
    } finally {
      setIsLoading(false);
      setShowSkipConfirmation(false);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      if (user) {
        await user.update({
          publicMetadata: {
            ...user.publicMetadata,
            onboardingCompleted: true,
            favoriteGenres: selectedGenres,
            selectedSongs: selectedSongs,
          }
        });
      }
      
      setCurrentStep(3); // Move to complete screen
      showToast('Welcome to NeuroBeats! Your preferences have been saved.', 'success');
    } catch (error) {
      console.error('Error saving preferences:', error);
      showToast('Error saving preferences', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeScreen />;
      case 1:
        return (
          <GenreSelector
            selectedGenres={selectedGenres}
            onGenreToggle={(genre) => {
              setSelectedGenres(prev => 
                prev.includes(genre) 
                  ? prev.filter(g => g !== genre)
                  : [...prev, genre]
              );
            }}
          />
        );
      case 2:
        return (
          <SongSelector
            selectedGenres={selectedGenres}
            selectedSongs={selectedSongs}
            onSongToggle={(song) => {
              setSelectedSongs(prev => {
                const isSelected = prev.some(s => s.id === song.id);
                if (isSelected) {
                  return prev.filter(s => s.id !== song.id);
                } else if (prev.length < 5) {
                  return [...prev, song];
                }
                return prev;
              });
            }}
          />
        );
      case 3:
        return (
          <OnboardingComplete
            selectedGenres={selectedGenres}
            selectedSongs={selectedSongs}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-dark-600 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-neon-purple/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-neon-blue/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-pink/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-neon-gradient rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-space font-bold text-white">
                NeuroBeats Setup
              </h1>
            </div>

            {currentStep < 3 && (
              <NeonButton
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-gray-400 hover:text-white"
              >
                Skip for now
              </NeonButton>
            )}
          </div>

          {/* Progress */}
          <OnboardingProgress
            steps={ONBOARDING_STEPS}
            currentStep={currentStep}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {renderCurrentStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        {currentStep < 3 && (
          <div className="p-6">
            <div className="flex items-center justify-between">
              <NeonButton
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </NeonButton>

              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  {currentStep === 1 && `${selectedGenres.length}/3 genres selected`}
                  {currentStep === 2 && `${selectedSongs.length}/5 songs selected`}
                </p>
              </div>

              {currentStep === 2 ? (
                <NeonButton
                  variant="primary"
                  onClick={handleComplete}
                  disabled={!canProceed() || isLoading}
                  className="flex items-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{isLoading ? 'Saving...' : 'Complete Setup'}</span>
                </NeonButton>
              ) : (
                <NeonButton
                  variant="primary"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </NeonButton>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Skip Confirmation Modal */}
      <AnimatePresence>
        {showSkipConfirmation && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSkipConfirmation(false)}
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <GlassCard className="p-6 max-w-md">
                  <h3 className="text-xl font-space font-bold text-white mb-4">
                    Skip Setup?
                  </h3>
                  <p className="text-gray-400 mb-6">
                    You can always set up your preferences later in your profile settings.
                  </p>
                  <div className="flex space-x-3">
                    <NeonButton
                      variant="ghost"
                      onClick={() => setShowSkipConfirmation(false)}
                      className="flex-1"
                    >
                      Cancel
                    </NeonButton>
                    <NeonButton
                      variant="primary"
                      onClick={confirmSkip}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? 'Skipping...' : 'Skip'}
                    </NeonButton>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};