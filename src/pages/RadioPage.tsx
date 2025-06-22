import React, { useState, useEffect } from 'react';
import { useDeezer } from '../hooks/useDeezer';
import { usePlayerStore } from '../stores/playerStore';

/**
 * RadioPage component: Allows users to select a genre and listen to a
 * radio station based on that genre's tracks.
 */
import { SongCard } from '../components/ui/SongCard';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { GlassCard } from '../components/ui/GlassCard';
// import { NeonButton } from '../components/ui/NeonButton'; // NeonButton not used in final snippet
import { Radio as RadioIcon, Music, ListMusic } from 'lucide-react'; // Icons
import { useToast } from '../hooks/useToast';

export const RadioPage: React.FC = () => {
  const { useGenres, useRadioForGenre, deezerService } = useDeezer();
  const { setCurrentTrack, setIsPlaying, addToQueue } = usePlayerStore();
  const { showToast } = useToast();

  const [selectedGenreId, setSelectedGenreId] = useState<string | null>(null);

  const { data: genresResponse, isLoading: loadingGenres, error: errorGenres } = useGenres();
  const {
    data: radioTracksResponse,
    isLoading: loadingRadioTracks,
    error: errorRadioTracks,
    refetch: refetchRadioTracks
  } = useRadioForGenre(selectedGenreId!, 50);

  useEffect(() => {
    // The useRadioForGenre hook is set to enabled: !!genreId,
    // so it should automatically fetch when selectedGenreId becomes non-null.
    // Explicit refetch can be useful if the query key doesn't change or to force refresh.
    if (selectedGenreId) {
       refetchRadioTracks();
    }
  }, [selectedGenreId, refetchRadioTracks]);

  const handlePlayTrack = (deezerTrack: any) => {
    try {
      const track = deezerService.convertToTrack(deezerTrack);
      setCurrentTrack(track);
      setIsPlaying(true);
      showToast(`Now playing: ${track.title}`, 'success');
    } catch (err) {
      showToast('Error playing track.', 'error');
    }
  };

  const handleAddToQueue = (deezerTrack: any) => {
    try {
      const track = deezerService.convertToTrack(deezerTrack);
      addToQueue(track);
      showToast(`Added "${track.title}" to queue.`, 'success');
    } catch (err) {
      showToast('Error adding to queue.', 'error');
    }
  };

  const genres = genresResponse?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-600 to-dark-700 pt-24 pb-32 px-6">
      <GlassCard className="p-6 mb-8">
        <div className="flex items-center mb-4">
          <RadioIcon className="w-8 h-8 text-neon-pink mr-3" />
          <h1 className="text-3xl font-space font-bold text-white">Genre Radio</h1>
        </div>
        <p className="text-gray-300 mb-6">Select a genre to start a radio station based on its mood and popular tracks.</p>

        {loadingGenres ? (
          <LoadingSkeleton variant="input" />
        ) : errorGenres ? (
          <p className="text-red-400">Could not load genres. Please try again later.</p>
        ) : (
          <div className="max-w-sm">
            <label htmlFor="genre-select" className="block text-sm font-medium text-gray-300 mb-1">
              Select Genre:
            </label>
            <select
              id="genre-select"
              value={selectedGenreId || ''}
              onChange={(e) => setSelectedGenreId(e.target.value || null)}
              className="w-full p-3 bg-dark-300/70 border border-white/20 rounded-xl text-white focus:border-neon-pink focus:outline-none focus:ring-2 focus:ring-neon-pink/50 transition-all"
            >
              <option value="">-- Choose a Genre --</option>
              {genres.map(genre => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </GlassCard>

      {selectedGenreId && (
        <section>
          <h2 className="text-2xl font-space font-bold text-white mb-4 flex items-center">
            <ListMusic className="w-6 h-6 mr-2 text-neon-pink" /> Radio Tracks
          </h2>
          {loadingRadioTracks && <LoadingSkeleton variant="song-list" count={10} />}
          {errorRadioTracks && <p className="text-red-400">Error loading radio tracks for this genre.</p>}

          {radioTracksResponse?.data && radioTracksResponse.data.length > 0 ? (
            <div className="space-y-2">
              {radioTracksResponse.data.map((track, index) => (
                <SongCard
                  key={track.id}
                  song={deezerService.convertToTrack(track)}
                  variant="list"
                  index={index}
                  showIndex
                  onPlay={() => handlePlayTrack(track)}
                  onAddToQueue={() => handleAddToQueue(track)}
                />
              ))}
            </div>
          ) : (
            !loadingRadioTracks && !errorRadioTracks && <p className="text-gray-400">No radio tracks found for this genre. Try selecting another one.</p>
          )}
        </section>
      )}
      {!selectedGenreId && !loadingGenres && !errorGenres && (
         <div className="text-center py-10">
            <Music className="w-12 h-12 text-gray-500 mx-auto mb-3"/>
            <p className="text-gray-400">Please select a genre to load radio tracks.</p>
        </div>
      )}
    </div>
  );
};
