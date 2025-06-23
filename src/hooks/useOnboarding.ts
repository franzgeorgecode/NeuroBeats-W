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
      // Check if user has completed onboarding
      const hasCompletedOnboarding = user.publicMetadata?.onboardingCompleted === true;
      console.log('Onboarding check:', { 
        hasCompletedOnboarding, 
        metadata: user.publicMetadata 
      });
      
      setShouldShowOnboarding(!hasCompletedOnboarding);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // Default to showing onboarding if there's an error checking
      setShouldShowOnboarding(true);
    }
  }, [user, isLoaded, user?.publicMetadata]);

  return {
    shouldShowOnboarding,
    isLoading: !isLoaded,
  };
};