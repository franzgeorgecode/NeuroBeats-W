import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, 
  Guitar, 
  Mic, 
  Headphones, 
  Piano, 
  Drum,
  Radio,
  Heart,
  Zap,
  Star,
  Volume2,
  Disc,
  Waves,
  Sparkles,
  Crown,
  Grid3X3,
  List,
  ArrowLeft,
  Settings,
  Check
} from 'lucide-react';
import { useDeezer } from '../hooks/useDeezer';
import { usePlayerStore } from '../stores/playerStore';
import { useUser } from '../hooks/useUser';
import { GlassCard } from '../components/ui/GlassCard';
import { SongCard } from '../components/ui/SongCard';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { NeonButton } from '../components/ui/NeonButton';
import { useToast } from '../hooks/useToast';

const GENRES = [
  { 
    id: '132', 
    name: 'Pop', 
    icon: Star, 
    color: 'from-pink-500 to-rose-500', 
    description: 'Catchy melodies and mainstream hits',
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg'
  },
  { 
    id: '152', 
    name: 'Rock', 
    icon: Guitar, 
    color: 'from-red-500 to-orange-500', 
    description: 'Electric guitars and powerful vocals',
    image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg'
  },
  { 
    id: '116', 
    name: 'Hip Hop', 
    icon: Mic, 
    color: 'from-purple-500 to-indigo-500', 
    description: 'Rhythmic beats and rap vocals',
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg'
  },
  { 
    id: '106', 
    name: 'Electronic', 
    icon: Zap, 
    color: 'from-cyan-500 to-blue-500', 
    description: 'Electronic beats and dance rhythms',
    image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg'
  },
  { 
    id: '85', 
    name: 'Alternative', 
    icon: Sparkles, 
    color: 'from-violet-500 to-purple-500', 
    description: 'Independent and alternative sounds',
    image: 'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg'
  },
  { 
    id: '165', 
    name: 'R&B', 
    icon: Heart, 
    color: 'from-rose-500 to-pink-500', 
    description: 'Soulful vocals and smooth grooves',
    image: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg'
  },
  { 
    id: '129', 
    name: 'Jazz', 
    icon: Piano, 
    color: 'from-amber-500 to-yellow-500', 
    description: 'Improvisation and smooth rhythms',
    image: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg'
  },
  { 
    id: '144', 
    name: 'Reggae', 
    icon: Waves, 
    color: 'from-green-500 to-lime-500', 
    description: 'Laid-back Caribbean vibes',
    image: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg'
  },
];

export const GenresPage: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState<typeof GENRES[0] | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showGenreSettings, setShowGenreSettings] = useState(false);
  const [userGenres, setUserGenres] = useState<string[]>([]);
  
  const { useSearchSongs, useTopTracksByGenre, deezerService } = useDeezer();
  const { setCurrentTrack, setIsPlaying, addToQueue } = usePlayerStore();
  const { profile, updatePreferences } = useUser();
  const { showToast } = useToast();

  // Get user's favorite genres from profile
  React.useEffect(() => {
    if (profile?.publicMetadata?.favoriteGenres) {
      setUserGenres(profile.publicMetadata.favoriteGenres as string[]);
    }
  }, [profile]);

  // Fetch top tracks for the selected genre
  const {
    data: topTracksByGenreResponse,
    isLoading,
    error
  } = useTopTracksByGenre(selectedGenre?.id!, 15);

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

  const handleGenreToggle = (genreName: string) => {
    const newGenres = userGenres.includes(genreName)
      ? userGenres.filter(g => g !== genreName)
      : [...userGenres, genreName];
    
    setUserGenres(newGenres);
  };

  const handleSaveGenres = async () => {
    try {
      await updatePreferences({ favoriteGenres: userGenres });
      setShowGenreSettings(false);
      showToast('Genre preferences updated!', 'success');
    } catch (error) {
      showToast('Failed to update preferences', 'error');
    }
  };

  if (selectedGenre) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-600 to-dark-700 pt-24 pb-32">
        <div className="container mx-auto px-6">
          {/* Genre Header */}
          <motion.section
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center mb-6">
              <NeonButton
                variant="ghost"
                size="sm"
                onClick={() => setSelectedGenre(null)}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Genres
              </NeonButton>
            </div>

            <GlassCard className={`p-8 bg-gradient-to-r ${selectedGenre.color} relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-20">
                <img
                  src={selectedGenre.image}
                  alt={selectedGenre.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4">
                      <selectedGenre.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-space font-bold text-white">
                        {selectedGenre.name}
                      </h1>
                      <p className="text-xl text-white/80">
                        {selectedGenre.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </GlassCard>
          </motion.section>

          {/* Genre Tracks */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-space font-bold text-white">
                Top {selectedGenre.name} Tracks
              </h2>
              <span className="text-gray-400">
                {topTracksByGenreResponse?.data?.length || 0} tracks
              </span>
            </div>

            {isLoading ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6' 
                : 'space-y-2'
              }>
                <LoadingSkeleton 
                  variant={viewMode === 'grid' ? 'song' : 'list-song'} 
                  count={viewMode === 'grid' ? 10 : 15} 
                />
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6' 
                : 'space-y-2'
              }>
                {topTracksByGenreResponse?.data?.map((track, index) => (
                  <SongCard
                    key={track.id}
                    song={deezerService.convertToTrack(track)}
                    variant={viewMode === 'grid' ? 'default' : 'list'}
                    index={index}
                    showIndex={viewMode === 'list'}
                    onPlay={() => handlePlayTrack(track)}
                    onAddToQueue={() => handleAddToQueue(track)}
                  />
                ))}
              </div>
            )}
            {error && <p className="text-red-500">Error loading tracks for this genre.</p>}
            {!isLoading && !error && (!topTracksByGenreResponse?.data || topTracksByGenreResponse.data.length === 0) && (
              <div className="text-center py-12">
                <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No tracks found
                </h3>
                <p className="text-gray-400">
                  Try exploring other genres or check back later
                </p>
              </div>
            )}
          </motion.section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-600 to-dark-700 pt-24 pb-32">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="p-8 bg-neon-gradient">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-space font-bold text-white mb-4">
                  Explore Genres
                </h1>
                <p className="text-xl text-white/80 mb-6">
                  Discover music across different genres and styles
                </p>
                <div className="flex items-center space-x-6 text-white/90">
                  <div className="flex items-center space-x-2">
                    <Music className="w-5 h-5" />
                    <span className="font-inter">{GENRES.length} Genres</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Headphones className="w-5 h-5" />
                    <span className="font-inter">High Quality</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-inter">Curated</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <NeonButton
                  variant="secondary"
                  onClick={() => setShowGenreSettings(true)}
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Preferences
                </NeonButton>
                <div className="w-32 h-32 bg-white/20 rounded-full animate-pulse-slow" />
              </div>
            </div>
          </GlassCard>
        </motion.section>

        {/* User's Favorite Genres */}
        {userGenres.length > 0 && (
          <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-space font-bold text-white">
                Your Favorite Genres
              </h2>
              <NeonButton
                variant="ghost"
                size="sm"
                onClick={() => setShowGenreSettings(true)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Edit
              </NeonButton>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {GENRES.filter(genre => userGenres.includes(genre.name)).map((genre, index) => {
                const Icon = genre.icon;
                
                return (
                  <motion.div
                    key={genre.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <GlassCard
                      className="p-4 cursor-pointer transition-all duration-300 relative overflow-hidden group ring-2 ring-neon-purple"
                      onClick={() => setSelectedGenre(genre)}
                    >
                      <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                        <img
                          src={genre.image}
                          alt={genre.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-60 group-hover:opacity-80 transition-opacity`} />
                      
                      <div className="relative z-10">
                        <div className={`w-12 h-12 bg-gradient-to-r ${genre.color} rounded-xl flex items-center justify-center mb-3 mx-auto shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        
                        <h3 className="text-lg font-space font-bold text-white mb-1 text-center">
                          {genre.name}
                        </h3>
                        
                        <p className="text-white/80 text-xs text-center leading-relaxed">
                          {genre.description}
                        </p>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* All Genres Grid */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-space font-bold text-white mb-6">
            All Genres
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {GENRES.map((genre, index) => {
              const Icon = genre.icon;
              const isFavorite = userGenres.includes(genre.name);
              
              return (
                <motion.div
                  key={genre.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GlassCard
                    className={`p-6 cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                      isFavorite ? 'ring-2 ring-neon-purple' : ''
                    }`}
                    onClick={() => setSelectedGenre(genre)}
                  >
                    {/* Favorite indicator */}
                    {isFavorite && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-neon-purple rounded-full flex items-center justify-center z-20">
                        <Heart className="w-3 h-3 text-white fill-current" />
                      </div>
                    )}

                    {/* Background Image */}
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                      <img
                        src={genre.image}
                        alt={genre.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-60 group-hover:opacity-80 transition-opacity`} />
                    
                    <div className="relative z-10">
                      <div className={`w-16 h-16 bg-gradient-to-r ${genre.color} rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-space font-bold text-white mb-2 text-center">
                        {genre.name}
                      </h3>
                      
                      <p className="text-white/80 text-sm text-center leading-relaxed">
                        {genre.description}
                      </p>
                    </div>

                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Genre Settings Modal */}
        <AnimatePresence>
          {showGenreSettings && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowGenreSettings(false)}
              />
              <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full max-w-2xl"
                >
                  <GlassCard className="p-6">
                    <h3 className="text-2xl font-space font-bold text-white mb-4">
                      Manage Genre Preferences
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Select your favorite genres to get personalized recommendations
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      {GENRES.map((genre) => {
                        const Icon = genre.icon;
                        const isSelected = userGenres.includes(genre.name);
                        
                        return (
                          <motion.button
                            key={genre.id}
                            className={`p-4 rounded-xl border transition-all ${
                              isSelected
                                ? 'border-neon-purple bg-neon-purple/20 text-white'
                                : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleGenreToggle(genre.name)}
                          >
                            <div className={`w-8 h-8 bg-gradient-to-r ${genre.color} rounded-lg flex items-center justify-center mb-2 mx-auto`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-medium">{genre.name}</span>
                            {isSelected && (
                              <Check className="w-4 h-4 text-neon-purple mx-auto mt-1" />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                    
                    <div className="flex space-x-3">
                      <NeonButton
                        variant="ghost"
                        onClick={() => setShowGenreSettings(false)}
                        className="flex-1"
                      >
                        Cancel
                      </NeonButton>
                      <NeonButton
                        variant="primary"
                        onClick={handleSaveGenres}
                        className="flex-1"
                      >
                        Save Preferences
                      </NeonButton>
                    </div>
                  </GlassCard>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};