import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Sparkles, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Play,
  Heart
} from 'lucide-react';
import { useDeezer } from '../hooks/useDeezer';
import { usePlayerStore } from '../stores/playerStore';
import { GlassCard } from '../components/ui/GlassCard';
import { SongCard } from '../components/ui/SongCard';
import { PlaylistCard } from '../components/ui/PlaylistCard';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { useToast } from '../hooks/useToast';

export const DiscoverPage: React.FC = () => {
  const { useTopTracks, useTrendingPlaylists, deezerService } = useDeezer();
  const { data: topTracks, isLoading: loadingTracks } = useTopTracks(50);
  const { data: trendingPlaylists, isLoading: loadingPlaylists } = useTrendingPlaylists(20);
  const { setCurrentTrack, setIsPlaying, addToQueue } = usePlayerStore();
  const { showToast } = useToast();

  const [trendingScrollIndex, setTrendingScrollIndex] = useState(0);
  const [newReleasesScrollIndex, setNewReleasesScrollIndex] = useState(0);
  const [playlistScrollIndex, setPlaylistScrollIndex] = useState(0);

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

  const scrollCarousel = (direction: 'left' | 'right', setter: React.Dispatch<React.SetStateAction<number>>, maxIndex: number) => {
    setter(prev => {
      if (direction === 'left') {
        return Math.max(0, prev - 1);
      } else {
        return Math.min(maxIndex, prev + 1);
      }
    });
  };

  const CarouselControls: React.FC<{
    onPrev: () => void;
    onNext: () => void;
    canPrev: boolean;
    canNext: boolean;
  }> = ({ onPrev, onNext, canPrev, canNext }) => (
    <div className="flex items-center space-x-2">
      <motion.button
        className={`p-2 rounded-xl transition-colors ${
          canPrev 
            ? 'bg-white/10 text-white hover:bg-white/20' 
            : 'bg-white/5 text-gray-500 cursor-not-allowed'
        }`}
        whileHover={canPrev ? { scale: 1.1 } : {}}
        whileTap={canPrev ? { scale: 0.9 } : {}}
        onClick={onPrev}
        disabled={!canPrev}
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>
      <motion.button
        className={`p-2 rounded-xl transition-colors ${
          canNext 
            ? 'bg-white/10 text-white hover:bg-white/20' 
            : 'bg-white/5 text-gray-500 cursor-not-allowed'
        }`}
        whileHover={canNext ? { scale: 1.1 } : {}}
        whileTap={canNext ? { scale: 0.9 } : {}}
        onClick={onNext}
        disabled={!canNext}
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  );

  const trendingTracks = topTracks?.data?.slice(0, 20) || [];
  const newReleases = topTracks?.data?.slice(20, 40) || [];
  const forYouTracks = topTracks?.data?.slice(40, 50) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-600 to-dark-700 pt-24 pb-32">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
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
                  Discover New Music
                </h1>
                <p className="text-xl text-white/80 mb-6">
                  Explore trending tracks, new releases, and personalized recommendations
                </p>
                <div className="flex items-center space-x-6 text-white/90">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-inter">Trending Now</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-inter">Fresh Releases</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5" />
                    <span className="font-inter">For You</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-white/20 rounded-full animate-pulse-slow" />
              </div>
            </div>
          </GlassCard>
        </motion.section>

        {/* Trending Section */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <TrendingUp className="w-6 h-6 text-neon-purple mr-3" />
              <h2 className="text-2xl font-space font-bold text-white">
                Trending Now
              </h2>
            </div>
            <CarouselControls
              onPrev={() => scrollCarousel('left', setTrendingScrollIndex, Math.max(0, trendingTracks.length - 6))}
              onNext={() => scrollCarousel('right', setTrendingScrollIndex, Math.max(0, trendingTracks.length - 6))}
              canPrev={trendingScrollIndex > 0}
              canNext={trendingScrollIndex < Math.max(0, trendingTracks.length - 6)}
            />
          </div>

          {loadingTracks ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              <LoadingSkeleton variant="song" count={6} />
            </div>
          ) : (
            <div className="overflow-hidden">
              <motion.div
                className="flex space-x-6"
                animate={{ x: -trendingScrollIndex * 280 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {trendingTracks.map((track, index) => (
                  <div key={track.id} className="w-64 flex-shrink-0">
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
                      onPlay={() => handlePlayTrack(track)}
                      onAddToQueue={() => handleAddToQueue(track)}
                    />
                  </div>
                ))}
              </motion.div>
            </div>
          )}
        </motion.section>

        {/* New Releases Section */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Sparkles className="w-6 h-6 text-neon-blue mr-3" />
              <h2 className="text-2xl font-space font-bold text-white">
                New Releases
              </h2>
            </div>
            <CarouselControls
              onPrev={() => scrollCarousel('left', setNewReleasesScrollIndex, Math.max(0, newReleases.length - 6))}
              onNext={() => scrollCarousel('right', setNewReleasesScrollIndex, Math.max(0, newReleases.length - 6))}
              canPrev={newReleasesScrollIndex > 0}
              canNext={newReleasesScrollIndex < Math.max(0, newReleases.length - 6)}
            />
          </div>

          {loadingTracks ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              <LoadingSkeleton variant="song" count={6} />
            </div>
          ) : (
            <div className="overflow-hidden">
              <motion.div
                className="flex space-x-6"
                animate={{ x: -newReleasesScrollIndex * 280 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {newReleases.map((track, index) => (
                  <div key={track.id} className="w-64 flex-shrink-0">
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
                      onPlay={() => handlePlayTrack(track)}
                      onAddToQueue={() => handleAddToQueue(track)}
                    />
                  </div>
                ))}
              </motion.div>
            </div>
          )}
        </motion.section>

        {/* Trending Playlists Section */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Play className="w-6 h-6 text-neon-cyan mr-3" />
              <h2 className="text-2xl font-space font-bold text-white">
                Trending Playlists
              </h2>
            </div>
            <CarouselControls
              onPrev={() => scrollCarousel('left', setPlaylistScrollIndex, Math.max(0, (trendingPlaylists?.data?.length || 0) - 4))}
              onNext={() => scrollCarousel('right', setPlaylistScrollIndex, Math.max(0, (trendingPlaylists?.data?.length || 0) - 4))}
              canPrev={playlistScrollIndex > 0}
              canNext={playlistScrollIndex < Math.max(0, (trendingPlaylists?.data?.length || 0) - 4)}
            />
          </div>

          {loadingPlaylists ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <LoadingSkeleton variant="playlist" count={4} />
            </div>
          ) : (
            <div className="overflow-hidden">
              <motion.div
                className="flex space-x-6"
                animate={{ x: -playlistScrollIndex * 320 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {trendingPlaylists?.data?.map((playlist) => (
                  <div key={playlist.id} className="w-80 flex-shrink-0">
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
                  </div>
                ))}
              </motion.div>
            </div>
          )}
        </motion.section>

        {/* For You Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center mb-6">
            <Heart className="w-6 h-6 text-neon-pink mr-3" />
            <h2 className="text-2xl font-space font-bold text-white">
              Made For You
            </h2>
          </div>

          {loadingTracks ? (
            <div className="grid grid-cols-1 gap-4">
              <LoadingSkeleton variant="compact-song" count={5} />
            </div>
          ) : (
            <div className="space-y-4">
              {forYouTracks.map((track, index) => (
                <SongCard
                  key={track.id}
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
                  variant="compact"
                  index={index}
                  showIndex
                  onPlay={() => handlePlayTrack(track)}
                  onAddToQueue={() => handleAddToQueue(track)}
                />
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
};