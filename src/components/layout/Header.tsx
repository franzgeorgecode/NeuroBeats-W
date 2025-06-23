import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, 
  Bell, 
  Settings, 
  User,
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useAppStore } from '../../stores/appStore';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';

export const Header: React.FC = () => {
  const { toggleSidebar, currentPage, setCurrentPage } = useAppStore();
  const { user } = useUser();
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['home']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const getPageTitle = () => {
    const titles: { [key: string]: string } = {
      home: 'Dashboard',
      search: 'Search Music',
      library: 'Your Library',
      liked: 'Liked Songs',
      trending: 'Trending Now',
      genres: 'Genres',
      discover: 'Discover',
      'ai-playlist': 'AI Playlists',
      radio: 'Radio',
      profile: 'Profile',
    };
    return titles[currentPage] || 'NeuroBeats';
  };

  const navigateBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentPage(navigationHistory[newIndex]);
    }
  };

  const navigateForward = () => {
    if (historyIndex < navigationHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentPage(navigationHistory[newIndex]);
    }
  };

  const goToSearch = () => {
    // Add to navigation history if not already there
    const newHistory = [...navigationHistory.slice(0, historyIndex + 1), 'search'];
    setNavigationHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPage('search');
  };

  // Track current page changes to update navigation history
  useEffect(() => {
    const lastPage = navigationHistory[historyIndex];
    if (lastPage !== currentPage) {
      // Only add to history if it's a different page and not caused by back/forward navigation
      const newHistory = [...navigationHistory.slice(0, historyIndex + 1), currentPage];
      setNavigationHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [currentPage]);

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < navigationHistory.length - 1;

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-30 p-4"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <GlassCard className="flex items-center justify-between p-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <motion.button
            className="p-2 text-white hover:bg-white/10 rounded-xl transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
          >
            <Menu className="w-6 h-6" />
          </motion.button>

          <div className="flex items-center space-x-2">
            <motion.button
              className={`p-2 rounded-xl transition-all duration-200 ${
                canGoBack 
                  ? 'text-white hover:bg-white/10' 
                  : 'text-gray-500 cursor-not-allowed'
              }`}
              whileHover={canGoBack ? { scale: 1.1 } : {}}
              whileTap={canGoBack ? { scale: 0.9 } : {}}
              onClick={navigateBack}
              disabled={!canGoBack}
              title="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              className={`p-2 rounded-xl transition-all duration-200 ${
                canGoForward 
                  ? 'text-white hover:bg-white/10' 
                  : 'text-gray-500 cursor-not-allowed'
              }`}
              whileHover={canGoForward ? { scale: 1.1 } : {}}
              whileTap={canGoForward ? { scale: 0.9 } : {}}
              onClick={navigateForward}
              disabled={!canGoForward}
              title="Go forward"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>

          <h1 className="text-2xl font-space font-bold text-white">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Quick Search Button */}
              <motion.button
                className="p-2 text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={goToSearch}
                title="Search music"
              >
                <Search className="w-6 h-6" />
              </motion.button>

              <motion.button
                className="p-2 text-white hover:bg-white/10 rounded-xl transition-all duration-200 relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => console.log('Notifications opened')}
                title="Notifications"
              >
                <Bell className="w-6 h-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-pink rounded-full animate-pulse" />
              </motion.button>

              <motion.button
                className="p-2 text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  const newHistory = [...navigationHistory.slice(0, historyIndex + 1), 'profile'];
                  setNavigationHistory(newHistory);
                  setHistoryIndex(newHistory.length - 1);
                  setCurrentPage('profile');
                }}
                title="Settings"
              >
                <Settings className="w-6 h-6" />
              </motion.button>

              <div className="flex items-center space-x-2 pl-2 border-l border-white/20">
                <motion.button
                  className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-xl transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentPage('profile')}
                >
                  <div className="w-8 h-8 bg-neon-gradient rounded-full flex items-center justify-center overflow-hidden">
                    {user.imageUrl ? (
                      <img 
                        src={user.imageUrl} 
                        alt={user.fullName || 'User'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <span className="text-white font-inter font-medium">
                    {user.firstName || user.username || 'User'}
                  </span>
                </motion.button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <NeonButton variant="ghost" size="sm">
                Sign In
              </NeonButton>
              <NeonButton variant="primary" size="sm">
                Sign Up
              </NeonButton>
            </div>
          )}
        </div>
      </GlassCard>
    </motion.header>
  );
};