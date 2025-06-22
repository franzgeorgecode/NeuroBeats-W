import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Clock, 
  Music, 
  BarChart3,
  Calendar,
  Play,
  Shuffle,
  Download,
  Share2,
  Filter,
  Search,
  Grid3X3,
  List,
  Plus
} from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { usePlayerStore } from '../stores/playerStore';
import { GlassCard } from '../components/ui/GlassCard';
import { SongCard } from '../components/ui/SongCard';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { NeonButton } from '../components/ui/NeonButton';
import { useToast } from '../hooks/useToast';

const LIBRARY_TABS = [
  { id: 'liked', label: 'Liked Songs', icon: Heart, color: 'text-neon-pink' },
  { id: 'history', label: 'Recently Played', icon: Clock, color: 'text-neon-blue' },
  { id: 'playlists', label: 'My Playlists', icon: Music, color: 'text-neon-purple' },
  { id: 'stats', label: 'Listening Stats', icon: BarChart3, color: 'text-neon-cyan' },
];

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently Added' },
  { value: 'title', label: 'Title A-Z' },
  { value: 'artist', label: 'Artist A-Z' },
  { value: 'duration', label: 'Duration' },
  { value: 'plays', label: 'Play Count' },
];

export const LibraryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('liked');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { profile, preferences } = useUser();
  const { setCurrentTrack, setIsPlaying, addToQueue } = usePlayerStore();
  const { showToast } = useToast();

  // Mock data - in real app, this would come from your backend
  const likedSongs = [
    {
      id: '1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: 200,
      cover_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
      audio_url: '',
      plays_count: 1500000,
      liked_at: '2024-01-15',
    },
    {
      id: '2',
      title: 'Watermelon Sugar',
      artist: 'Harry Styles',
      album: 'Fine Line',
      duration: 174,
      cover_url: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg',
      audio_url: '',
      plays_count: 1200000,
      liked_at: '2024-01-10',
    },
  ];

  const recentlyPlayed = [
    {
      id: '3',
      title: 'Good 4 U',
      artist: 'Olivia Rodrigo',
      album: 'SOUR',
      duration: 178,
      cover_url: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg',
      audio_url: '',
      plays_count: 900000,
      played_at: '2024-01-20 14:30',
    },
  ];

  const myPlaylists = [
    {
      id: 'p1',
      title: 'My Favorites',
      description: 'All my favorite tracks in one place',
      trackCount: 45,
      duration: 10800, // 3 hours
      coverUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
      isPublic: false,
      created_at: '2024-01-01',
    },
    {
      id: 'p2',
      title: 'Workout Mix',
      description: 'High energy tracks for the gym',
      trackCount: 32,
      duration: 7200, // 2 hours
      coverUrl: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg',
      isPublic: true,
      created_at: '2024-01-05',
    },
  ];

  const listeningStats = {
    totalMinutes: 15420, // ~257 hours
    totalTracks: 1234,
    topGenres: ['Pop', 'Rock', 'Electronic', 'Hip Hop', 'R&B'],
    topArtists: ['The Weeknd', 'Taylor Swift', 'Drake', 'Billie Eilish', 'Ed Sheeran'],
    monthlyMinutes: [1200, 1400, 1600, 1800, 2000, 2200],
  };

  const handlePlayAll = () => {
    if (activeTab === 'liked' && likedSongs.length > 0) {
      // Convert first song and play
      const firstSong = likedSongs[0];
      const track = {
        id: firstSong.id,
        title: firstSong.title,
        artist: firstSong.artist,
        album: firstSong.album || '',
        duration: firstSong.duration,
        cover_url: firstSong.cover_url,
        audio_url: firstSong.audio_url,
        genre: '',
        release_date: '',
        plays_count: firstSong.plays_count || 0,
        likes_count: 0,
        created_at: new Date().toISOString(),
      };
      setCurrentTrack(track);
      setIsPlaying(true);
      showToast('Playing all liked songs', 'success');
    }
  };

  const handleShuffle = () => {
    showToast('Shuffle mode enabled', 'success');
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'liked':
        return (
          <div>
            {/* Header Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <NeonButton variant="primary" onClick={handlePlayAll}>
                  <Play className="w-4 h-4 mr-2" />
                  Play All
                </NeonButton>
                <NeonButton variant="ghost" onClick={handleShuffle}>
                  <Shuffle className="w-4 h-4 mr-2" />
                  Shuffle
                </NeonButton>
              </div>
              
              <div className="flex items-center space-x-2">
                <motion.button
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-neon-purple text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-5 h-5" />
                </motion.button>
                <motion.button
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-neon-purple text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Songs List */}
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6' 
              : 'space-y-2'
            }>
              {likedSongs.map((song, index) => (
                <SongCard
                  key={song.id}
                  song={song}
                  variant={viewMode === 'grid' ? 'default' : 'list'}
                  index={index}
                  showIndex={viewMode === 'list'}
                />
              ))}
            </div>
          </div>
        );

      case 'history':
        return (
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Recently Played
              </h3>
              <p className="text-gray-400">
                Your listening history from the past 30 days
              </p>
            </div>

            <div className="space-y-2">
              {recentlyPlayed.map((song, index) => (
                <div key={song.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors">
                  <SongCard
                    song={song}
                    variant="list"
                    index={index}
                    className="flex-1"
                  />
                  <div className="text-gray-400 text-sm ml-4">
                    {formatDate(song.played_at.split(' ')[0])}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'playlists':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  My Playlists
                </h3>
                <p className="text-gray-400">
                  {myPlaylists.length} playlists
                </p>
              </div>
              
              <NeonButton variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Playlist
              </NeonButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myPlaylists.map((playlist) => (
                <GlassCard key={playlist.id} className="p-6">
                  <div className="relative mb-4">
                    <div className="w-full aspect-square bg-gradient-to-br from-neon-purple to-neon-blue rounded-xl overflow-hidden">
                      <img
                        src={playlist.coverUrl}
                        alt={playlist.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    
                    <motion.button
                      className="absolute bottom-4 right-4 w-12 h-12 bg-neon-gradient rounded-full flex items-center justify-center shadow-neon opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Play className="w-6 h-6 text-white ml-0.5" />
                    </motion.button>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      {playlist.title}
                    </h4>
                    <p className="text-gray-400 text-sm mb-2">
                      {playlist.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{playlist.trackCount} tracks</span>
                      <span>{formatDuration(playlist.duration)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                      <span>{playlist.isPublic ? 'Public' : 'Private'}</span>
                      <span>Created {formatDate(playlist.created_at)}</span>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        );

      case 'stats':
        return (
          <div>
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-2">
                Your Listening Statistics
              </h3>
              <p className="text-gray-400">
                Insights into your music listening habits
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                {
                  label: 'Total Listening Time',
                  value: formatDuration(listeningStats.totalMinutes * 60),
                  icon: Clock,
                  color: 'from-neon-purple to-neon-blue',
                },
                {
                  label: 'Tracks Played',
                  value: listeningStats.totalTracks.toLocaleString(),
                  icon: Music,
                  color: 'from-neon-blue to-neon-cyan',
                },
                {
                  label: 'Average per Day',
                  value: `${Math.round(listeningStats.totalMinutes / 30)}m`,
                  icon: Calendar,
                  color: 'from-neon-cyan to-neon-green',
                },
                {
                  label: 'Favorite Genre',
                  value: listeningStats.topGenres[0],
                  icon: Heart,
                  color: 'from-neon-green to-neon-pink',
                },
              ].map((stat, index) => (
                <GlassCard key={stat.label} className="p-6 text-center">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-2xl font-space font-bold text-white mb-1">
                    {stat.value}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {stat.label}
                  </p>
                </GlassCard>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Genres */}
              <GlassCard className="p-6">
                <h4 className="text-lg font-semibold text-white mb-4">
                  Top Genres
                </h4>
                <div className="space-y-3">
                  {listeningStats.topGenres.map((genre, index) => (
                    <div key={genre} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-neon-purple font-mono text-sm">
                          #{index + 1}
                        </span>
                        <span className="text-white">{genre}</span>
                      </div>
                      <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-neon-gradient rounded-full"
                          style={{ width: `${100 - index * 15}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Top Artists */}
              <GlassCard className="p-6">
                <h4 className="text-lg font-semibold text-white mb-4">
                  Top Artists
                </h4>
                <div className="space-y-3">
                  {listeningStats.topArtists.map((artist, index) => (
                    <div key={artist} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-neon-blue font-mono text-sm">
                          #{index + 1}
                        </span>
                        <span className="text-white">{artist}</span>
                      </div>
                      <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-neon-gradient rounded-full"
                          style={{ width: `${100 - index * 12}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        );

      default:
        return null;
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
                  Your Library
                </h1>
                <p className="text-xl text-white/80 mb-6">
                  Your personal music collection and listening history
                </p>
                <div className="flex items-center space-x-6 text-white/90">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5" />
                    <span className="font-inter">{likedSongs.length} Liked</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Music className="w-5 h-5" />
                    <span className="font-inter">{myPlaylists.length} Playlists</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span className="font-inter">{formatDuration(listeningStats.totalMinutes * 60)} Listened</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-white/20 rounded-full animate-pulse-slow" />
              </div>
            </div>
          </GlassCard>
        </motion.section>

        {/* Tabs */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {LIBRARY_TABS.map((tab) => {
              const Icon = tab.icon;
              
              return (
                <motion.button
                  key={tab.id}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-neon-gradient text-white shadow-neon'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : tab.color}`} />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* Content */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </motion.section>
      </div>
    </div>
  );
};