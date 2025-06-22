import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDeezer } from '../hooks/useDeezer';

/**
 * AlbumPage component: Displays the tracklist and details for a specific album.
 */
import { usePlayerStore } from '../stores/playerStore';
import { SongCard } from '../components/ui/SongCard';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { GlassCard } from '../components/ui/GlassCard';
import { Disc, ListMusic, User, ArrowLeft } from 'lucide-react'; // Icons (removed Calendar)
import { NeonButton } from '../components/ui/NeonButton';
import { useToast } from '../hooks/useToast';

export const AlbumPage: React.FC = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();
  const { useAlbumTracks, deezerService } = useDeezer();
  const { setCurrentTrack, setIsPlaying, addToQueue } = usePlayerStore();
  const { showToast } = useToast();

  const { data: albumTracksResponse, isLoading, error } = useAlbumTracks(albumId!);

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
    } catch (err)      {
      showToast('Error adding to queue.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-600 to-dark-700 pt-24 pb-32 px-6">
        <LoadingSkeleton variant="song-list" /> {/* Using existing variant */}
      </div>
    );
  }

  if (error || !albumTracksResponse?.data || albumTracksResponse.data.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 pb-32 px-6 text-white">
        <p>Error loading album details or no tracks found. Album ID: {albumId}</p>
         <NeonButton onClick={() => navigate(-1)} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </NeonButton>
      </div>
    );
  }

  const tracks = albumTracksResponse.data;
  const albumInfo = tracks[0]?.album;
  const artistInfo = tracks[0]?.artist;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-600 to-dark-700 pt-24 pb-32 px-6">
      <NeonButton onClick={() => navigate(-1)} className="mb-6" variant="ghost" size="sm">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </NeonButton>

      <GlassCard className="p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center">
          <img
            src={albumInfo?.cover_xl || albumInfo?.cover_big || '/default_album.png'}
            alt={albumInfo?.title || 'Album Cover'}
            className="w-40 h-40 rounded-lg object-cover mb-4 md:mb-0 md:mr-6 shadow-lg"
          />
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-space font-bold text-white mb-2">{albumInfo?.title || 'Album Title'}</h1>
            {artistInfo && (
              <p
                className="text-xl text-neon-purple hover:underline cursor-pointer mb-1"
                onClick={() => navigate(`/artist/${artistInfo.id}`)}
              >
                <User className="w-5 h-5 mr-1 inline-block" />{artistInfo.name}
              </p>
            )}
            <div className="flex items-center justify-center md:justify-start space-x-4 text-gray-300 mb-2">
                {albumTracksResponse.total && (
                    <span className="flex items-center"><ListMusic className="w-4 h-4 mr-1" /> {albumTracksResponse.total} Tracks</span>
                )}
            </div>
          </div>
        </div>
      </GlassCard>

      <section>
        <h2 className="text-2xl font-space font-bold text-white mb-4 flex items-center">
            <ListMusic className="w-6 h-6 mr-2 text-neon-cyan" /> Tracks
        </h2>
        {isLoading && <LoadingSkeleton variant="song-list" count={10} />}
        {error && <p className="text-red-400">Error loading tracks.</p>}
        {tracks && tracks.length > 0 ? (
          <div className="space-y-2">
            {tracks.map((track, index) => (
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
          !isLoading && <p className="text-gray-400">No tracks found for this album.</p>
        )}
      </section>
    </div>
  );
};
