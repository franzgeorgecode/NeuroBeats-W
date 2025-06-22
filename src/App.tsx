import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { ParticleBackground } from './components/ui/ParticleBackground';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { NavigationBar } from './components/layout/NavigationBar';
import { Player } from './components/player/Player';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ToastContainer } from './components/ui/Toast';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { SocialShare } from './components/social/SocialShare';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { InstallPrompt } from './components/pwa/InstallPrompt';
import { MobileGestures } from './components/mobile/MobileGestures';
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { GenresPage } from './pages/GenresPage';
import { TrendingPage } from './pages/TrendingPage';
import { LibraryPage } from './pages/LibraryPage';
import { AIPlaylistPage } from './pages/AIPlaylistPage';
import { AuthPage } from './pages/AuthPage';
import { SearchPage } from './pages/SearchPage';
import { ArtistPage } from './pages/ArtistPage';
import { AlbumPage } from './pages/AlbumPage';
import { UserProfile } from './components/auth/UserProfile';
import { useAppStore } from './stores/appStore';
import { useOnboarding } from './hooks/useOnboarding';
import { useSettingsStore } from './stores/settingsStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function AppContent() {
  const { sidebarCollapsed, currentPage, setCurrentPage, theme } = useAppStore();
  const { isSignedIn, isLoaded } = useAuth();
  const { shouldShowOnboarding, isLoading: onboardingLoading } = useOnboarding();
  const { accessibility } = useSettingsStore();
  
  const [shareModal, setShareModal] = useState({ isOpen: false, track: null, playlist: null });
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Apply accessibility settings
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    root.style.fontSize = accessibility.fontSize === 'small' ? '14px' : 
                         accessibility.fontSize === 'large' ? '18px' : '16px';
    
    // High contrast
    if (accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduce motion
    if (accessibility.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  }, [accessibility]);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      root.classList.toggle('dark', mediaQuery.matches);
      root.classList.toggle('light', !mediaQuery.matches);
      
      const handleChange = (e: MediaQueryListEvent) => {
        root.classList.toggle('dark', e.matches);
        root.classList.toggle('light', !e.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      root.classList.remove('dark', 'light');
      root.classList.add(theme);
    }
  }, [theme]);

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-dark-600 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-neon-gradient rounded-full animate-pulse mx-auto mb-4" />
          <p className="text-white font-inter">Loading NeuroBeats...</p>
        </div>
      </div>
    );
  }

  // Show onboarding if user needs it
  if (isSignedIn && shouldShowOnboarding && !onboardingLoading) {
    return (
      <div className="min-h-screen bg-dark-600">
        <ParticleBackground />
        <OnboardingFlow />
        <ToastContainer />
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'discover':
        return <DiscoverPage />;
      case 'search':
        return <SearchPage />;
      case 'genres':
        return <GenresPage />;
      case 'trending':
        return <TrendingPage />;
      case 'library':
        return <LibraryPage />;
      case 'ai-playlist':
        return <AIPlaylistPage />;
      case 'liked':
        return <div className="pt-24 pb-32 px-6 text-white">Liked Songs - Coming Soon</div>;
      case 'radio':
        return <div className="pt-24 pb-32 px-6 text-white">Radio Page - Coming Soon</div>;
      case 'profile':
        return <UserProfile />;
      default:
        return <HomePage />;
    }
  };

  return (
    <MobileGestures className="min-h-screen bg-dark-600 text-white font-inter overflow-x-hidden">
      <ParticleBackground />
      
      <div className="relative z-10">
        {isSignedIn && (
          <>
            <Sidebar />
            <Header />
            <NavigationBar />
          </>
        )}
        
        <main className={`transition-all duration-300 ${
          isSignedIn ? (sidebarCollapsed ? 'ml-20' : 'ml-64') : ''
        } ${isSignedIn ? 'md:ml-64 md:mr-0' : ''}`}>
          {renderCurrentPage()}
        </main>
        
        {isSignedIn && <Player />}
      </div>

      <SocialShare
        isOpen={shareModal.isOpen}
        onClose={() => setShareModal({ isOpen: false, track: null, playlist: null })}
        track={shareModal.track}
        playlist={shareModal.playlist}
      />

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <InstallPrompt />
      <ToastContainer />
    </MobileGestures>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route 
            path="/auth/*" 
            element={
              <ProtectedRoute requireAuth={false}>
                <AuthPage />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/artist/:artistId"
            element={
              <ProtectedRoute requireAuth={true}>
                <ArtistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/album/:albumId"
            element={
              <ProtectedRoute requireAuth={true}>
                <AlbumPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/*" 
            element={
              <ProtectedRoute requireAuth={true}>
                <AppContent />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;