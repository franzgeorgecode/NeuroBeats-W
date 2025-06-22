import React from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, 
  Bell, 
  Settings, 
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useAppStore } from '../../stores/appStore';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';

export const Header: React.FC = () => {
  const { toggleSidebar, currentPage, setCurrentPage } = useAppStore();
  const { user } = useUser();

  const getPageTitle = () => {
    const titles: { [key: string]: string } = {
      home: 'Home',
      search: 'Search',
      library: 'Your Library',
      liked: 'Liked Songs',
      trending: 'Trending',
      radio: 'Radio',
      profile: 'Profile',
    };
    return titles[currentPage] || 'NeuroBeats';
  };

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
              className="p-2 text-white hover:bg-white/10 rounded-xl transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              className="p-2 text-white hover:bg-white/10 rounded-xl transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
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
              <motion.button
                className="p-2 text-white hover:bg-white/10 rounded-xl transition-all duration-200 relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Bell className="w-6 h-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-pink rounded-full animate-pulse" />
              </motion.button>

              <motion.button
                className="p-2 text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
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