import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Check, Loader2, Music, RefreshCw } from 'lucide-react';
import { useDeezer } from '../../hooks/useDeezer';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';
import type { SelectedSong } from './OnboardingFlow';

interface SongSelectorProps {
  selectedGenres: string[];
  selectedSongs: SelectedSong[];
  onSongToggle: (song: SelectedSong) => void;
}

// Mapeo de géneros a IDs de Deezer
const GENRE_MAPPING: { [key: string]: string } = {
  'Pop': '132',
  'Rock': '152', 
  'Hip Hop': '116',
  'Electronic': '106',
  'Classical': '32',
  'Jazz': '129',
  'Reggae': '144',
  'Country': '2',
  'R&B': '165',
  'Latin': '197',
  'Metal': '464',
  'Indie': '85',
  'Folk': '466',
  'Blues': '153',
  'Soul': '169'
};

export const SongSelector: React.FC<SongSelectorProps> = ({
  selectedGenres,
  selectedSongs,
  onSongToggle,
}) => {
  const { useTopTracks, deezerService } = useDeezer();
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const [genreTracks, setGenreTracks] = useState<any[]>([]);
  const [isLoadingGenres, setIsLoadingGenres] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Cargar canciones por género
  useEffect(() => {
    const loadGenreTracks = async () => {
      setIsLoadingGenres(true);
      setError(null);
      let tracksSuccessfullyFetched = true; // Flag for success of primary genre track fetching

      try {
        const allTracks: any[] = [];
        if (selectedGenres.length > 0) {
            for (const genre of selectedGenres) {
                const genreId = GENRE_MAPPING[genre];
                if (genreId) {
                    try {
                        const searchQuery = `genre:"${genre}"`;
                        // Fetch 5, use top 3 as before
                        const response = await deezerService.searchSongs(searchQuery, 5);
                        if (response.data && response.data.length > 0) {
                            const topTracks = response.data.slice(0, 3).map(track => ({
                                ...track,
                                genre: genre
                            }));
                            allTracks.push(...topTracks);
                        } else {
                            console.warn(`No tracks found for genre ${genre}`);
                        }
                    } catch (genreError) {
                        console.error(`Error loading tracks for genre ${genre}:`, genreError);
                        tracksSuccessfullyFetched = false;
                        // Optional: break here if one failure is enough to stop
                    }
                }
            }

            // Only attempt to fetch supplementary tracks if initial genre fetches were successful
            // and we have some tracks but fewer than 15.
            if (tracksSuccessfullyFetched && allTracks.length > 0 && allTracks.length < 15) {
                try {
                    const { data: topTracksData } = await deezerService.getTopTracks(20);
                    if (topTracksData?.data) {
                        const needed = 15 - allTracks.length;
                        const additionalTracks = topTracksData.data
                            .slice(0, Math.max(0, needed)) // Ensure slice is not negative
                            .map(track => ({ ...track, genre: 'Popular' }));
                        allTracks.push(...additionalTracks);
                    }
                } catch (topTracksError) {
                    console.warn('Warning: Error loading supplementary top tracks:', topTracksError);
                    // Not treating this as a critical failure if genre tracks were already fetched.
                }
            }
        }

        // (Inside the try block of loadGenreTracks, after all track fetching attempts)

        if (selectedGenres.length > 0) {
            // Scenario 1: Complete failure - errors during genre fetching AND zero tracks resulted.
            if (!tracksSuccessfullyFetched && allTracks.length === 0) {
                throw new Error("Could not fetch songs for your selected genres. Please try other genres or check your connection.");
            }

            // Scenario 2: Partial success or insufficient supplementary - got some tracks (1-4) but not enough to select 5.
            // This directly addresses the "only 3 songs shown" issue.
            if (allTracks.length > 0 && allTracks.length < 5) {
                console.warn(`Fetched only ${allTracks.length} tracks for selected genres. Augmenting with fallback songs to ensure enough options for selection.`);
                const currentTracksCopy = [...allTracks]; // Create a copy to avoid potential issues if allTracks is referenced elsewhere before re-assignment
                const fallbacksToAdd = getFallbackSongs().filter(fb => !currentTracksCopy.some(at => at.id === fb.id)); // Get unique fallbacks
                const combinedTracks = [...currentTracksCopy, ...fallbacksToAdd];
                setGenreTracks(combinedTracks.slice(0, 15)); // Display combined list, capped at 15 tracks
                // Note: Not setting a full error here as we've provided a usable list.
                // A toast message could be an alternative if user feedback is desired for augmentation.
            }
            // Scenario 3: Sufficient tracks found (5 or more).
            else if (allTracks.length >= 5) {
                setGenreTracks(allTracks.slice(0, 15)); // Display fetched tracks, capped at 15
            }
            // Scenario 4: Zero tracks found, even if `tracksSuccessfullyFetched` was true (e.g., genres returned no tracks).
            // Or, `tracksSuccessfullyFetched` is false but `allTracks.length` was not 0 initially but became 0.
            else if (allTracks.length === 0) {
                throw new Error("No songs were found that match your selected genres. Please try different genres or check available popular tracks.");
            }
            // Implicit else: Should not be reached if logic is exhaustive for allTracks.length conditions.
            // If it were, it would mean setGenreTracks might not be called, leading to an empty display.
            // However, the above conditions (allTracks.length === 0, <5, >=5) cover all cases for allTracks.length.

        } else {
            // This 'else' corresponds to selectedGenres.length === 0.
            // This path should ideally not be taken by loadGenreTracks itself, as the calling useEffect
            // handles the selectedGenres.length === 0 case by directly setting fallbacks and not calling loadGenreTracks.
            // Adding as a defensive measure in case of unexpected calls to loadGenreTracks.
            console.warn("loadGenreTracks was called unexpectedly with no selected genres. Using fallback songs.");
            setGenreTracks(getFallbackSongs());
        }

        // The existing main catch (err: any) block for loadGenreTracks will handle errors thrown by the conditions above
        // (e.g., from Scenario 1 or 4). It already calls setError(err.message) and setGenreTracks(getFallbackSongs()).
      } catch (err: any) {
        console.error('Main error in loadGenreTracks:', err);
        setError(err.message || 'Unable to load songs. Please check connection and try again.');
        setGenreTracks(getFallbackSongs());
      } finally {
        setIsLoadingGenres(false);
      }
    };

    if (selectedGenres.length > 0) {
      loadGenreTracks();
    } else {
      setIsLoadingGenres(false);
      setError(null);
      setGenreTracks(getFallbackSongs());
    }
  }, [selectedGenres, deezerService]);

  const getFallbackSongs = () => [
    {
      id: 'fallback-1',
      title: 'Blinding Lights',
      artist: { name: 'The Weeknd' },
      album: { cover_medium: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg' },
      duration: 200,
      preview: '',
      genre: 'Pop'
    },
    {
      id: 'fallback-2', 
      title: 'Watermelon Sugar',
      artist: { name: 'Harry Styles' },
      album: { cover_medium: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg' },
      duration: 174,
      preview: '',
      genre: 'Pop'
    },
    {
      id: 'fallback-3',
      title: 'Good 4 U', 
      artist: { name: 'Olivia Rodrigo' },
      album: { cover_medium: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg' },
      duration: 178,
      preview: '',
      genre: 'Pop'
    },
    {
      id: 'fallback-4',
      title: 'Levitating',
      artist: { name: 'Dua Lipa' },
      album: { cover_medium: 'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg' },
      duration: 203,
      preview: '',
      genre: 'Pop'
    },
    {
      id: 'fallback-5',
      title: 'Stay',
      artist: { name: 'The Kid LAROI & Justin Bieber' },
      album: { cover_medium: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg' },
      duration: 141,
      preview: '',
      genre: 'Pop'
    },
    {
      id: 'fallback-6',
      title: 'Heat Waves',
      artist: { name: 'Glass Animals' },
      album: { cover_medium: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg' },
      duration: 238,
      preview: '',
      genre: 'Indie'
    },
    {
      id: 'fallback-7',
      title: 'As It Was',
      artist: { name: 'Harry Styles' },
      album: { cover_medium: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg' },
      duration: 167,
      preview: '',
      genre: 'Pop'
    }
  ];

  const handlePreviewPlay = (song: SelectedSong) => {
    if (!audioRef.current || !song.preview_url) return;

    try {
      if (playingPreview === song.id) {
        audioRef.current.pause();
        setPlayingPreview(null);
      } else {
        audioRef.current.src = song.preview_url;
        audioRef.current.play().catch((error) => {
          console.warn('Audio playback failed:', error);
        });
        setPlayingPreview(song.id);
      }
    } catch (error) {
      console.warn('Audio preview error:', error);
      setPlayingPreview(null);
    }
  };

  const handleAudioEnded = () => {
    setPlayingPreview(null);
  };

  const convertDeezerToSelectedSong = (deezerTrack: any): SelectedSong => {
    return {
      id: deezerTrack.id,
      title: deezerTrack.title,
      artist: deezerTrack.artist.name,
      preview_url: deezerTrack.preview || '',
      cover_url: deezerTrack.album?.cover_medium || deezerTrack.album?.cover_big || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
      duration: deezerTrack.duration,
    };
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRetry = () => {
    setError(null);
    setIsLoadingGenres(true);
    // Trigger reload by updating a state that useEffect depends on
    window.location.reload();
  };

  if (error) {
    return (
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-space font-bold text-white mb-4">
            Choose Your Favorite Songs
          </h2>
          <p className="text-xl text-gray-300 mb-2">
            Select exactly 5 songs to complete your music profile
          </p>
        </motion.div>

        <GlassCard className="p-8 text-center">
          <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Unable to load songs
          </h3>
          <p className="text-gray-400 mb-6">
            {error}
          </p>
          <div className="space-y-4">
            <NeonButton variant="primary" onClick={handleRetry}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </NeonButton>
            <p className="text-sm text-gray-500">
              Or continue with our curated selection below
            </p>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (isLoadingGenres) {
    return (
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-space font-bold text-white mb-4">
            Loading Your Personalized Songs
          </h2>
          <p className="text-xl text-gray-300">
            Finding the perfect tracks based on your genre preferences...
          </p>
        </motion.div>

        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-neon-purple animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onError={() => setPlayingPreview(null)}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-4xl font-space font-bold text-white mb-4">
          Choose Your Favorite Songs
        </h2>
        <p className="text-xl text-gray-300 mb-2">
          Select exactly 5 songs to complete your music profile
        </p>
        <p className="text-lg text-neon-purple font-medium">
          {selectedSongs.length}/5 songs selected
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Based on your selected genres: {selectedGenres.join(', ')}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
      >
        {genreTracks.map((track, index) => {
          const song = convertDeezerToSelectedSong(track);
          const isSelected = selectedSongs.some(s => s.id === song.id);
          const isPlaying = playingPreview === song.id;
          const canSelect = selectedSongs.length < 5 || isSelected;
          
          return (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: canSelect ? 1.02 : 1 }}
              whileTap={{ scale: canSelect ? 0.98 : 1 }}
            >
              <GlassCard
                className={`
                  p-4 cursor-pointer transition-all duration-300 relative overflow-hidden group
                  ${isSelected 
                    ? 'ring-2 ring-neon-purple shadow-neon bg-neon-gradient' 
                    : canSelect 
                      ? 'hover:ring-1 hover:ring-white/30' 
                      : 'opacity-50 cursor-not-allowed'
                  }
                `}
                onClick={() => canSelect && onSongToggle(song)}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center z-10"
                  >
                    <Check className="w-4 h-4 text-neon-purple" />
                  </motion.div>
                )}

                <div className="flex items-center space-x-4">
                  {/* Album Art with Play Button */}
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-neon-purple to-neon-blue rounded-xl overflow-hidden">
                      {song.cover_url ? (
                        <img
                          src={song.cover_url}
                          alt={song.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Preview Play Button - only show if preview URL exists */}
                    {song.preview_url && (
                      <motion.button
                        className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreviewPlay(song);
                        }}
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6 text-white" />
                        ) : (
                          <Play className="w-6 h-6 text-white" />
                        )}
                      </motion.button>
                    )}

                    {/* Playing indicator */}
                    {isPlaying && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-neon-green rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>

                  {/* Song Info */}
                  <div className="flex-1 min-w-0 text-left">
                    <h3 className="text-white font-inter font-semibold truncate text-sm">
                      {song.title}
                    </h3>
                    <p className="text-gray-400 text-xs truncate">
                      {song.artist}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-gray-500 text-xs">
                        {formatDuration(song.duration)}
                      </p>
                      {track.genre && (
                        <span className="text-xs bg-neon-purple/20 text-neon-purple px-2 py-1 rounded-full">
                          {track.genre}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Selected Songs Preview */}
      <AnimatePresence>
        {selectedSongs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="mt-8"
          >
            <GlassCard className="p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-space font-bold text-white mb-4">
                Your Selected Songs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedSongs.map((song, index) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-neon-purple to-neon-blue rounded-lg overflow-hidden">
                      {song.cover_url ? (
                        <img
                          src={song.cover_url}
                          alt={song.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {song.title}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        {song.artist}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedSongs.length === 5 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <div className="flex items-center justify-center space-x-2 text-neon-green">
            <Check className="w-5 h-5" />
            <span className="font-inter font-medium">Perfect! You're ready to complete your setup</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};