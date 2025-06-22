import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Globe, 
  Zap, 
  Crown,
  Filter,
  Calendar,
  Music
} from 'lucide-react';
import { useDeezer } from '../hooks/useDeezer';
import { usePlayerStore } from '../stores/playerStore';
import { GlassCard } from '../components/ui/GlassCard';
import { SongCard } from '../components/ui/SongCard';
import { PlaylistCard } from '../components/ui/PlaylistCard';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { NeonButton } from '../components/ui/NeonButton';
import { useToast } from '../hooks/useToast';

const COUNTRIES = [
  { code: 'global', name: 'Global', flag: '🌍' },
  { code: 'us', name: 'United States', flag: '🇺🇸' },
  { code: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'fr', name: 'France', flag: '🇫🇷' },
  { code: 'de', name: 'Germany', flag: '🇩🇪' },
  { code: 'es', name: 'Spain', flag: '🇪🇸' },
  { code: 'it', name: 'Italy', flag: '🇮🇹' },
  { code: 'br', name: 'Brazil', flag: '🇧🇷' },
  { code: 'mx', name: 'Mexico', flag: '🇲🇽' },
  { code: 'jp', name: 'Japan', flag: '🇯🇵' },
  { code: 'kr', name: 'South Korea', flag: '🇰🇷' },
  { code: 'au', name: 'Australia', flag: '🇦🇺' },
];

const TIME_PERIODS = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
];

export const TrendingPage: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [selectedPeriod, setSelectedPeriod] = useState(TIME_PERIODS[1]);
  const [activeTab, setActiveTab] = useState<'tracks' | 'playlists'>('tracks');

  const { useTopTracks, useTrendingPlaylists, deezerService } = useDeezer();
  const { data: topTracks, isLoading: loadingTracks } = useTopTracks(50);
  const { data: trendingPlaylists, isLoading: loadingPlaylists } = useTrendingPlaylists(20);
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
                  Trending Music
                </h1>
                <p className="text-xl text-white/80 mb-6">
                  Discover what's hot around the world right now
                </p>
                <div className="flex items-center space-x-6 text-white/90">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-inter">Real-time Charts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <span className="font-inter">Global & Local</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span className="font-inter">Viral Tracks</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-white/20 rounded-full animate-pulse-slow" />
              </div>
            </div>
          </GlassCard>
        </motion.section>

        {/* Filters */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <GlassCard className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Country Filter */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-neon-purple" />
                  <span className="text-white font-medium">Country:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {COUNTRIES.slice(0, 6).map((country) => (
                    <motion.button
                      key={country.code}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCountry.code === country.code
                          ? 'bg-neon-gradient text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCountry(country)}
                    >
                      {country.flag} {country.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Time Period Filter */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-neon-blue" />
                  <span className="text-white font-medium">Period:</span>
                </div>
                <div className="flex gap-2">
                  {TIME_PERIODS.map((period) => (
                    <motion.button
                      key={period.value}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedPeriod.value === period.value
                          ? 'bg-neon-gradient text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedPeriod(period)}
                    >
                      {period.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.section>

        {/* Tabs */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center space-x-4">
            <motion.button
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                activeTab === 'tracks'
                  ? 'bg-neon-gradient text-white shadow-neon'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('tracks')}
            >
              <Music className="w-5 h-5" />
              <span>Top Tracks</span>
            </motion.button>

            <motion.button
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                activeTab === 'playlists'
                  ? 'bg-neon-gradient text-white shadow-neon'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('playlists')}
            >
              <Crown className="w-5 h-5" />
              <span>Trending Playlists</span>
            </motion.button>
          </div>
        </motion.section>

        {/* Content */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {activeTab === 'tracks' ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-space font-bold text-white">
                  Top 50 - {selectedCountry.name} ({selectedPeriod.label})
                </h2>
                <span className="text-gray-400">
                  {topTracks?.data?.length || 0} tracks
                </span>
              </div>

              {loadingTracks ? (
                <div className="space-y-2">
                  <LoadingSkeleton variant="list-song" count={20} />
                </div>
              ) : (
                <div className="space-y-2">
                  {topTracks?.data?.slice(0, 50).map((track, index) => (
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
                          cover_url: track.album?.cover_xl,
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
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-space font-bold text-white">
                  Trending Playlists
                </h2>
                <span className="text-gray-400">
                  {trendingPlaylists?.data?.length || 0} playlists
                </span>
              </div>

              {loadingPlaylists ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <LoadingSkeleton variant="playlist" count={8} />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {trendingPlaylists?.data?.map((playlist, index) => (
                    <motion.div
                      key={playlist.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <PlaylistCard
                        playlist={{
                          id: playlist.id,
                          title: playlist.title,
                          description: playlist.description,
                          creator: playlist.user?.name,
                          trackCount: playlist.nb_tracks,
                          duration: playlist.duration,
                          coverUrl: playlist.picture_xl,
                          isPublic: playlist.public,
                          followers: playlist.fans,
                        }}
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