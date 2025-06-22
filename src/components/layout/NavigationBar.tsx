import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Search, 
  Compass, 
  Radio,
  TrendingUp,
  Library,
  Heart,
  Music
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'discover', label: 'Discover', icon: Compass, path: '/discover' },
  { id: 'search', label: 'Search', icon: Search, path: '/search' },
  { id: 'genres', label: 'Genres', icon: Music, path: '/genres' },
  { id: 'trending', label: 'Trending', icon: TrendingUp, path: '/trending' },
  { id: 'library', label: 'Library', icon: Library, path: '/library' },
];

export const NavigationBar: React.FC = () => {
  const { currentPage, setCurrentPage } = useAppStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-dark-500/90 backdrop-blur-xl border-t border-white/10">
        <div className="flex items-center justify-around py-2">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <motion.button
                key={item.id}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-neon-purple' 
                    : 'text-gray-400 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(item.id)}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-neon-purple rounded-full"
                      layoutId="activeIndicator"
                    />
                  )}
                </div>
                <span className="text-xs font-medium">
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};