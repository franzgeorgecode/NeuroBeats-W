import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Mic, 
  X, 
  Clock, 
  TrendingUp, 
  Music, 
  User, 
  Disc,
  Filter,
  Loader2
} from 'lucide-react';
import { useDeezer } from '../../hooks/useDeezer';
import { usePlayerStore } from '../../stores/playerStore';
import { useSearchStore } from '../../stores/searchStore';
import { GlassCard } from '../ui/GlassCard';
import { useDebounce } from '../../hooks/useDebounce';

interface SearchBarProps {
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  className = '', 
  onFocus, 
  onBlur 
}) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all', // all, track, artist, album
    year: '',
    duration: 'all', // all, short, medium, long
    popularity: 'all' // all, popular, trending
  });

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const debouncedQuery = useDebounce(query, 300);
  const { useSearchSongs } = useDeezer();
  const { data: searchResults, isLoading } = useSearchSongs(debouncedQuery, 10);
  const { setCurrentTrack, setIsPlaying } = usePlayerStore();
  const { 
    recentSearches, 
    addToRecentSearches, 
    clearRecentSearches,
    trendingSearches 
  } = useSearchStore();

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      addToRecentSearches(searchQuery.trim());
      setQuery(searchQuery);
      setShowResults(false);
    }
  };

  const handleVoiceSearch = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handlePlayTrack = (track: any) => {
    // Convert Deezer track to our format and play
    const convertedTrack = {
      id: track.id,
      title: track.title,
      artist: track.artist.name,
      album: track.album?.title || '',
      duration: track.duration,
      cover_url: track.album?.cover_xl || track.album?.cover_big,
      audio_url: track.preview,
      genre: '',
      release_date: '',
      plays_count: track.rank || 0,
      likes_count: 0,
      created_at: new Date().toISOString(),
    };
    
    setCurrentTrack(convertedTrack);
    setIsPlaying(true);
    setShowResults(false);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFilteredResults = () => {
    if (!searchResults?.data) return [];
    
    let filtered = searchResults.data;
    
    // Filter by duration
    if (filters.duration !== 'all') {
      filtered = filtered.filter(track => {
        const duration = track.duration;
        switch (filters.duration) {
          case 'short': return duration < 180; // < 3 minutes
          case 'medium': return duration >= 180 && duration <= 300; // 3-5 minutes
          case 'long': return duration > 300; // > 5 minutes
          default: return true;
        }
      });
    }
    
    // Filter by popularity
    if (filters.popularity !== 'all') {
      filtered = filtered.filter(track => {
        switch (filters.popularity) {
          case 'popular': return track.rank > 500000;
          case 'trending': return track.rank > 800000;
          default: return true;
        }
      });
    }
    
    return filtered;
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <GlassCard className="flex items-center p-3">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setShowResults(true);
              onFocus?.();
            }}
            onBlur={onBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                handleSearch(query);
              }
            }}
            placeholder="Search songs, artists, albums..."
            className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
          />

          {/* Voice Search */}
          <motion.button
            className={`p-2 rounded-lg transition-colors mr-2 ${
              isListening 
                ? 'bg-neon-gradient text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleVoiceSearch}
            disabled={!recognitionRef.current}
          >
            {isListening ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Mic className="w-4 h-4" />
              </motion.div>
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </motion.button>

          {/* Filters Toggle */}
          <motion.button
            className={`p-2 rounded-lg transition-colors mr-2 ${
              showFilters 
                ? 'bg-neon-purple text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
          </motion.button>

          {/* Clear Button */}
          {query && (
            <motion.button
              className="p-2 text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </GlassCard>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 z-50"
            >
              <GlassCard className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Duration Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duration
                    </label>
                    <select
                      value={filters.duration}
                      onChange={(e) => setFilters(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full bg-dark-300 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-neon-purple focus:outline-none"
                    >
                      <option value="all">All</option>
                      <option value="short">Short (&lt; 3min)</option>
                      <option value="medium">Medium (3-5min)</option>
                      <option value="long">Long (&gt; 5min)</option>
                    </select>
                  </div>

                  {/* Popularity Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Popularity
                    </label>
                    <select
                      value={filters.popularity}
                      onChange={(e) => setFilters(prev => ({ ...prev, popularity: e.target.value }))}
                      className="w-full bg-dark-300 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-neon-purple focus:outline-none"
                    >
                      <option value="all">All</option>
                      <option value="popular">Popular</option>
                      <option value="trending">Trending</option>
                    </select>
                  </div>

                  {/* Year Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Year
                    </label>
                    <input
                      type="number"
                      value={filters.year}
                      onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                      placeholder="e.g. 2023"
                      min="1950"
                      max={new Date().getFullYear()}
                      className="w-full bg-dark-300 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-neon-purple focus:outline-none"
                    />
                  </div>

                  {/* Reset Filters */}
                  <div className="flex items-end">
                    <motion.button
                      className="w-full px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded-lg transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFilters({
                        type: 'all',
                        year: '',
                        duration: 'all',
                        popularity: 'all'
                      })}
                    >
                      Reset
                    </motion.button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 z-40"
          >
            <GlassCard className="max-h-96 overflow-y-auto">
              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 text-neon-purple animate-spin mr-3" />
                  <span className="text-gray-400">Searching...</span>
                </div>
              )}

              {/* No Query - Show Recent and Trending */}
              {!query && !isLoading && (
                <div className="p-4">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-semibold flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Recent Searches
                        </h3>
                        <button
                          onClick={clearRecentSearches}
                          className="text-gray-400 hover:text-white text-sm transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="space-y-2">
                        {recentSearches.slice(0, 5).map((search, index) => (
                          <motion.button
                            key={index}
                            className="w-full text-left p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
                            whileHover={{ x: 4 }}
                            onClick={() => handleSearch(search)}
                          >
                            {search}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trending Searches */}
                  <div>
                    <h3 className="text-white font-semibold flex items-center mb-3">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Trending
                    </h3>
                    <div className="space-y-2">
                      {trendingSearches.map((search, index) => (
                        <motion.button
                          key={index}
                          className="w-full text-left p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
                          whileHover={{ x: 4 }}
                          onClick={() => handleSearch(search)}
                        >
                          {search}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Search Results */}
              {query && !isLoading && (
                <div className="p-4">
                  {getFilteredResults().length > 0 ? (
                    <div className="space-y-2">
                      {getFilteredResults().map((track) => (
                        <motion.div
                          key={track.id}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                          whileHover={{ x: 4 }}
                          onClick={() => handlePlayTrack(track)}
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-blue rounded-lg overflow-hidden">
                            <img
                              src={track.album?.cover_medium || ''}
                              alt={track.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium truncate group-hover:text-neon-purple transition-colors">
                              {track.title}
                            </h4>
                            <p className="text-gray-400 text-sm truncate">
                              {track.artist.name}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-gray-400">
                            <Music className="w-4 h-4" />
                            <span className="text-sm">{formatDuration(track.duration)}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Music className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-400">No results found for "{query}"</p>
                      <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or search terms</p>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};