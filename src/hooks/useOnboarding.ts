import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

export const useOnboarding = () => {
  const { user, isLoaded } = useUser();
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;

    try {
      // Check if user has completed onboarding
      const hasCompletedOnboarding = user.publicMetadata?.onboardingCompleted ?? false;
      setShouldShowOnboarding(!hasCompletedOnboarding);
    } catch (error) {
      console.warn('Error checking onboarding status:', error);
      // Default to not showing onboarding if there's an error
      setShouldShowOnboarding(false);
    }
  }, [user, isLoaded]);

  return {
    shouldShowOnboarding,
    isLoading: !isLoaded,
  };
};