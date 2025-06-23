import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

export const useOnboarding = () => {
  const { user, isLoaded } = useUser();
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      setShouldShowOnboarding(false);
      return;
    }

    try {
      // Check if user has completed onboarding in Clerk or localStorage
      const clerkCompleted = user.publicMetadata?.onboardingCompleted === true;
      const localCompleted = localStorage.getItem('onboardingCompleted') === 'true';
      const hasCompletedOnboarding = clerkCompleted || localCompleted;
      
      console.log('Onboarding check:', { 
        clerkCompleted,
        localCompleted,
        hasCompletedOnboarding, 
        metadata: user.publicMetadata 
      });
      
      setShouldShowOnboarding(!hasCompletedOnboarding);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // Check localStorage as fallback
      const localCompleted = localStorage.getItem('onboardingCompleted') === 'true';
      setShouldShowOnboarding(!localCompleted);
    }
  }, [user, isLoaded, user?.publicMetadata]);

  return {
    shouldShowOnboarding,
    isLoading: !isLoaded,
  };
};