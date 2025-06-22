import React from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Add useNavigate
import { useDeezer } from '../hooks/useDeezer';

/**
 * ArtistPage component: Displays detailed information about a specific artist,
 * including their top tracks and albums.
 */
import { usePlayerStore } from '../stores/playerStore';
import { SongCard } from '../components/ui/SongCard';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { GlassCard } from '../components/ui/GlassCard';
import { Music, Users, Disc, ListMusic } from 'lucide-react'; // Icons
import { NeonButton } from '../components/ui/NeonButton';
import { useToast } from '../hooks/useToast';

// Basic Album card for artist's album list
const ArtistAlbumCard: React.FC<{ album: any, onClick: () => void }> = ({ album, onClick }) => (
  <GlassCard className="p-4 cursor-pointer hover:bg-white/10" onClick={onClick}>
    <img src={album.cover_medium || '/default_album.png'} alt={album.title} className="w-full h-auto rounded-lg mb-2" />
    <h3 className="text-md font-semibold text-white truncate">{album.title}</h3>
    <p className="text-xs text-gray-400">{album.release_date ? new Date(album.release_date).getFullYear() : ''}</p>
  </GlassCard>
);

export const ArtistPage: React.FC = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const navigate = useNavigate(); // Initialize navigate
  const {
    useArtistDetails,
    useArtistTopTracks,
    useArtistAlbums,
    deezerService
  } = useDeezer();
  const { setCurrentTrack, setIsPlaying, addToQueue } = usePlayerStore();
  const { showToast } = useToast();

  const { data: artist, isLoading: loadingArtist, error: errorArtist } = useArtistDetails(artistId!);
  const { data: topTracks, isLoading: loadingTopTracks, error: errorTopTracks } = useArtistTopTracks(artistId!, 10);
  const { data: albums, isLoading: loadingAlbums, error: errorAlbums } = useArtistAlbums(artistId!, 20);

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

  const handleAlbumClick = (albumId: string) => {
    navigate(`/album/${albumId}`);
  };

  if (loadingArtist || loadingTopTracks || loadingAlbums) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-600 to-dark-700 pt-24 pb-32 px-6">
        <LoadingSkeleton variant="song-list" /> {/* Using existing variant */}
      </div>
    );
  }

  if (errorArtist || !artist) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 pb-32 px-6 text-white">
        Error loading artist details. Artist ID: {artistId}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-600 to-dark-700 pt-24 pb-32 px-6">
      <GlassCard className="p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center">
          <img
            src={artist.picture_xl || artist.picture_big || '/default_artist.png'}
            alt={artist.name}
            className="w-40 h-40 rounded-full object-cover mb-4 md:mb-0 md:mr-6 shadow-lg"
          />
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-space font-bold text-white mb-2">{artist.name}</h1>
            <div className="flex items-center justify-center md:justify-start space-x-4 text-gray-300 mb-2">
              {artist.nb_fan && (
                <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> {artist.nb_fan.toLocaleString()} Fans</span>
              )}
              {artist.nb_album && (
                <span className="flex items-center"><Disc className="w-4 h-4 mr-1" /> {artist.nb_album} Albums</span>
              )}
            </div>
            {artist.radio && (
                <NeonButton size="sm" variant="secondary" className="mt-2">
                    <Music className="w-4 h-4 mr-2" /> Start Radio
                </NeonButton>
            )}
          </div>
        </div>
      </GlassCard>

      <section className="mb-8">
        <h2 className="text-2xl font-space font-bold text-white mb-4 flex items-center">
            <ListMusic className="w-6 h-6 mr-2 text-neon-purple" /> Top Tracks
        </h2>
        {loadingTopTracks && <LoadingSkeleton variant="song-list" count={5} />}
        {errorTopTracks && <p className="text-red-400">Error loading top tracks.</p>}
        {topTracks?.data && topTracks.data.length > 0 ? (
          <div className="space-y-2">
            {topTracks.data.map((track, index) => (
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
          !loadingTopTracks && <p className="text-gray-400">No top tracks found for this artist.</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-space font-bold text-white mb-4 flex items-center">
            <Disc className="w-6 h-6 mr-2 text-neon-blue" /> Albums
        </h2>
        {loadingAlbums && <LoadingSkeleton variant="song-list" count={4} />} {/* Using existing variant */}
        {albums?.data && albums.data.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {albums.data.map(album => (
              <ArtistAlbumCard key={album.id} album={album} onClick={() => handleAlbumClick(album.id)} />
            ))}
          </div>
        ) : (
          !loadingAlbums && <p className="text-gray-400">No albums found for this artist.</p>
        )}
      </section>
    </div>
  );
};
