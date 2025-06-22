import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Search, 
  Library, 
  Heart, 
  Plus,
  Music,
  Radio,
  TrendingUp,
  User,
  Compass,
  Sparkles
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { useAuth } from '../../hooks/useAuth';
import { GlassCard } from '../ui/GlassCard';

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, currentPage, setCurrentPage } = useAppStore();
  const { isAuthenticated } = useAuth();

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'genres', label: 'Genres', icon: Music },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'library', label: 'Your Library', icon: Library },
    { id: 'liked', label: 'Liked Songs', icon: Heart },
    { id: 'radio', label: 'Radio', icon: Radio },
  ];

  const aiMenuItems = [
    { id: 'ai-playlist', label: 'AI Playlist Generator', icon: Sparkles },
  ];

  const userMenuItems = [
    { id: 'profile', label: 'Profile', icon: User },
  ];

  if (!isAuthenticated) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed left-0 top-0 h-full z-40 hidden md:block ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        exit={{ x: -100 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <GlassCard className="h-full rounded-none rounded-r-2xl p-6">
          {/* Logo */}
          <motion.div 
            className="flex items-center mb-8"
            animate={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
          >
            <div className="p-2 bg-neon-gradient rounded-xl">
              <Music className="w-8 h-8 text-white" />
            </div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.h1
                  className="ml-3 text-2xl font-space font-bold bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  NeuroBeats
                </motion.h1>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Navigation */}
          <nav className="space-y-2 mb-8">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <motion.button
                  key={item.id}
                  className={`
                    w-full flex items-center p-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-neon-gradient text-white shadow-neon' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentPage(item.id)}
                  style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
                >
                  <Icon className="w-6 h-6" />
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        className="ml-3 font-inter font-medium"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </nav>

          {/* AI Section */}
          <div className="border-t border-white/10 pt-4 mb-8">
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.h3
                  className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3 px-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  AI Features
                </motion.h3>
              )}
            </AnimatePresence>
            
            {aiMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <motion.button
                  key={item.id}
                  className={`
                    w-full flex items-center p-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-neon-gradient text-white shadow-neon' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentPage(item.id)}
                  style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
                >
                  <Icon className="w-6 h-6" />
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        className="ml-3 font-inter font-medium"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>

          {/* User Section */}
          <div className="border-t border-white/10 pt-4 mb-8">
            {userMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <motion.button
                  key={item.id}
                  className={`
                    w-full flex items-center p-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-neon-gradient text-white shadow-neon' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentPage(item.id)}
                  style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
                >
                  <Icon className="w-6 h-6" />
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        className="ml-3 font-inter font-medium"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>

          {/* Create Playlist Button */}
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <button className="w-full flex items-center p-3 rounded-xl border border-dashed border-neon-purple/50 text-neon-purple hover:bg-neon-purple/10 transition-all duration-200">
                  <Plus className="w-6 h-6" />
                  <span className="ml-3 font-inter font-medium">Create Playlist</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  );
};