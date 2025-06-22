import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Music, 
  User, 
  Disc,
  TrendingUp,
  Clock,
  Play,
  Heart,
  Plus
} from 'lucide-react';
import { useDeezer } from '../hooks/useDeezer';
import { usePlayerStore } from '../stores/playerStore';
import { GlassCard } from '../components/ui/GlassCard';
import { SongCard } from '../components/ui/SongCard';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { NeonButton } from '../components/ui/NeonButton';
import { useToast } from '../hooks/useToast';
import { useDebounce } from '../hooks/useDebounce';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'track' | 'artist' | 'album'>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const debouncedQuery = useDebounce(query, 500);
  const { useSearchSongs, deezerService } = useDeezer();
  const { data: searchResults, isLoading, error } = useSearchSongs(debouncedQuery, 30);
  const { setCurrentTrack, setIsPlaying, addToQueue } = usePlayerStore();
  const { showToast } = useToast();

  const handlePlayTrack = (deezerTrack: any) => {
    try {
      const track = deezerService.convertToTrack(deezerTrack);
      setCurrentTrack(track);
      setIsPlaying(true);
      showToast(`Now playing: ${track.title}`, 'success');
    } catch (error) {
      showToast('Error playing track', 'error');
    }
  };

  const handleAddToQueue = (deezerTrack: any) => {
    try {
      const track = deezerService.convertToTrack(deezerTrack);
      addToQueue(track);
      showToast(`Added "${track.title}" to queue`, 'success');
    } catch (error) {
      showToast('Error adding to queue', 'error');
    }
  };

  const trendingSearches = [
    'Bad Bunny', 'Taylor Swift', 'The Weeknd', 'Dua Lipa', 'Drake',
    'Billie Eilish', 'Ed Sheeran', 'Ariana Grande', 'Post Malone', 'Olivia Rodrigo'
  ];

  const handleTrendingSearch = (searchTerm: string) => {
    setQuery(searchTerm);
  };

  const filteredResults = searchResults?.data?.filter(track => {
    if (activeFilter === 'all') return true;
    // For now, we only have tracks from the API
    return activeFilter === 'track';
  }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-600 to-dark-700 pt-24 pb-32">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="p-8 bg-neon-gradient">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-space font-bold text-white mb-4">
                  Search Music
                </h1>
                <p className="text-xl text-white/80 mb-6">
                  Find your favorite songs, artists, and albums
                </p>
                <div className="flex items-center space-x-6 text-white/90">
                  <div className="flex items-center space-x-2">
                    <Music className="w-5 h-5" />
                    <span className="font-inter">Millions of Tracks</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Search className="w-5 h-5" />
                    <span className="font-inter">Instant Search</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Play className="w-5 h-5" />
                    <span className="font-inter">Preview Available</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-white/20 rounded-full animate-pulse-slow" />
              </div>
            </div>
          </GlassCard>
        </motion.section>

        {/* Search Bar */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for songs, artists, albums..."
                  className="w-full pl-12 pr-4 py-4 bg-dark-300/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-purple/50 transition-all"
                />
              </div>
              
              <motion.button
                className={`p-4 rounded-xl transition-colors ${
                  showFilters 
                    ? 'bg-neon-purple text-white' 
                    : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-white/10"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-white font-medium">Filter by:</span>
                    {[
                      { id: 'all', label: 'All', icon: Music },
                      { id: 'track', label: 'Tracks', icon: Music },
                      { id: 'artist', label: 'Artists', icon: User },
                      { id: 'album', label: 'Albums', icon: Disc },
                    ].map((filter) => {
                      const Icon = filter.icon;
                      
                      return (
                        <motion.button
                          key={filter.id}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                            activeFilter === filter.id
                              ? 'bg-neon-gradient text-white'
                              : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setActiveFilter(filter.id as any)}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{filter.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </motion.section>

        {/* Content */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {!query ? (
            // Trending searches when no query
            <div>
              <div className="flex items-center mb-6">
                <TrendingUp className="w-6 h-6 text-neon-purple mr-3" />
                <h2 className="text-2xl font-space font-bold text-white">
                  Trending Searches
                </h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {trendingSearches.map((term, index) => (
                  <motion.button
                    key={term}
                    className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTrendingSearch(term)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-neon-gradient rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white font-medium">{term}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            // Search results
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-space font-bold text-white">
                  Search Results for "{query}"
                </h2>
                <span className="text-gray-400">
                  {filteredResults.length} results
                </span>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  <LoadingSkeleton variant="list-song" count={10} />
                </div>
              ) : error ? (
                <GlassCard className="p-8 text-center">
                  <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Search Error
                  </h3>
                  <p className="text-gray-400">
                    Unable to search at the moment. Please try again.
                  </p>
                </GlassCard>
              ) : filteredResults.length === 0 ? (
                <GlassCard className="p-8 text-center">
                  <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No Results Found
                  </h3>
                  <p className="text-gray-400 mb-4">
                    No tracks found for "{query}". Try different keywords.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {trendingSearches.slice(0, 5).map((term) => (
                      <motion.button
                        key={term}
                        className="px-3 py-1 bg-neon-purple/20 text-neon-purple rounded-full text-sm hover:bg-neon-purple/30 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleTrendingSearch(term)}
                      >
                        {term}
                      </motion.button>
                    ))}
                  </div>
                </GlassCard>
              ) : (
                <div className="space-y-2">
                  {filteredResults.map((track, index) => (
                    <motion.div
                      key={track.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.02 }}
                    >
                      <SongCard
                        song={{
                          id: track.id,
                          title: track.title,
                          artist: track.artist.name,
                          album: track.album?.title,
                          duration: track.duration,
                          cover_url: track.album?.cover_xl || track.album?.cover_big,
                          audio_url: track.preview,
                          plays_count: track.rank,
                        }}
                        variant="list"
                        index={index}
                        showIndex
                        onPlay={() => handlePlayTrack(track)}
                        onAddToQueue={() => handleAddToQueue(track)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
};