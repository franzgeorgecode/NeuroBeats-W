import '@clerk/clerk-react';

declare module '@clerk/clerk-react' {
  interface PublicUserData {
    onboardingCompleted?: boolean;
    favoriteGenres?: string[];
    selectedSongs?: Array<{
      id: string;
      title: string;
      artist: string;
      preview_url: string;
      cover_url?: string;
      duration: number;
    }>;
    listeningHistory?: Array<{
      trackId: string;
      playedAt: string;
      playDuration: number;
      completed: boolean;
    }>;
    theme?: 'dark' | 'light' | 'auto';
    audioQuality?: 'low' | 'normal' | 'high';
    notifications?: {
      push: boolean;
      email: boolean;
      marketing: boolean;
    };
  }
}