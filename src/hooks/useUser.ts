import { useState, useEffect } from 'react';
import { useUser as useClerkUser } from '@clerk/clerk-react';
import { useToast } from './useToast';

export const useUser = () => {
  const { user, isLoaded } = useClerkUser();
  const { showToast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);

  // Get user preferences from metadata
  const preferences = user?.publicMetadata || null;

  const updatePreferences = async (updates: any) => {
    if (!user) return { success: false };

    setIsLoading(true);
    try {
      await user.update({
        publicMetadata: {
          ...user.publicMetadata,
          ...updates,
        },
      });
      
      showToast('Preferences updated successfully', 'success');
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Error updating preferences:', error);
      showToast('Error updating preferences', 'error');
      setIsLoading(false);
      return { success: false, error };
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return { success: false };

    setIsLoading(true);
    try {
      // Clerk handles avatar uploads
      await user.setProfileImage({ file });
      
      showToast('Avatar updated successfully', 'success');
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      showToast('Error uploading avatar', 'error');
      setIsLoading(false);
      return { success: false, error };
    }
  };

  const addToListeningHistory = async (trackId: string, playDuration = 0, completed = false) => {
    if (!user) return;

    try {
      // Store listening history in user metadata
      const history = user.publicMetadata.listeningHistory || [];
      const newEntry = {
        trackId,
        playedAt: new Date().toISOString(),
        playDuration,
        completed,
      };
      
      // Keep only the last 100 entries
      const updatedHistory = [newEntry, ...history].slice(0, 100);
      
      await user.update({
        publicMetadata: {
          ...user.publicMetadata,
          listeningHistory: updatedHistory,
        },
      });
    } catch (error) {
      console.error('Error adding to listening history:', error);
    }
  };

  return {
    profile: user,
    preferences,
    isLoading: isLoading || !isLoaded,
    updatePreferences,
    uploadAvatar,
    addToListeningHistory,
  };
};