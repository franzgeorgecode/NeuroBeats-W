import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import DeezerService from '../services/deezer';

export const useDeezer = () => {
  const queryClient = useQueryClient();
  const deezerService = new DeezerService(queryClient);

  const useSearchSongs = (query: string, limit: number = 25) => {
    return useQuery({
      queryKey: ['deezer', 'search', query, limit],
      queryFn: () => deezerService.searchSongs(query, limit),
      enabled: !!query && query.length > 2,
      staleTime: 5 * 60 * 1000,
    });
  };

  /**
   * Hook to fetch a list of artists for a specific genre.
   * @param genreId The ID of the genre.
   * @param limit Optional. The maximum number of artists to fetch (default is 25).
   * @returns The react-query query result for the list of artists in the genre.
   */
  const useArtistsByGenre = (genreId: string, limit: number = 25) => {
    return useQuery({
      queryKey: ['deezer', 'genre-artists', genreId, limit],
      queryFn: () => deezerService.getArtistsByGenre(genreId, limit),
      enabled: !!genreId,
      staleTime: 15 * 60 * 1000,
    });
  };

  /**
   * Hook to fetch the top tracks for a specific genre.
   * @param genreId The ID of the genre.
   * @param limit Optional. The maximum number of tracks to fetch.
   * @returns The react-query query result for the top tracks in the genre.
   */
  const useTopTracksByGenre = (genreId: string, limit?: number) => {
    return useQuery({
      queryKey: ['deezer', 'genre-top-tracks', genreId, limit],
      queryFn: () => deezerService.getTopTracksByGenre(genreId, limit),
      enabled: !!genreId,
      staleTime: 30 * 60 * 1000,
    });
  };

  /**
   * Hook to fetch a list of radio tracks for a specific genre.
   * @param genreId The ID of the genre.
   * @param limit Optional. The maximum number of radio tracks to fetch.
   * @returns The react-query query result for the genre's radio tracks.
   */
  const useRadioForGenre = (genreId: string, limit?: number) => {
    return useQuery({
      queryKey: ['deezer', 'genre-radio', genreId, limit],
      queryFn: () => deezerService.getRadioForGenre(genreId, limit),
      enabled: !!genreId,
      staleTime: 15 * 60 * 1000,
    });
  };

  /**
   * Hook to fetch a list of radio tracks for a specific artist.
   * @param artistId The ID of the artist.
   * @param limit Optional. The maximum number of radio tracks to fetch.
   * @returns The react-query query result for the artist's radio tracks.
   */
  const useRadioForArtist = (artistId: string, limit?: number) => {
    return useQuery({
      queryKey: ['deezer', 'artist-radio', artistId, limit],
      queryFn: () => deezerService.getRadioForArtist(artistId, limit),
      enabled: !!artistId,
      staleTime: 15 * 60 * 1000,
    });
  };

  const useTopTracks = (limit: number = 50) => {
    return useQuery({
      queryKey: ['deezer', 'top-tracks', limit],
      queryFn: () => deezerService.getTopTracks(limit),
      staleTime: 30 * 60 * 1000,
    });
  };

  const useGenres = () => {
    return useQuery({
      queryKey: ['deezer', 'genres'],
      queryFn: () => deezerService.getGenres(),
      staleTime: 24 * 60 * 60 * 1000,
    });
  };

  const useTrendingPlaylists = (limit: number = 25) => {
    return useQuery({
      queryKey: ['deezer', 'trending-playlists', limit],
      queryFn: () => deezerService.getTrendingPlaylists(limit),
      staleTime: 30 * 60 * 1000,
    });
  };

  const useSongDetails = (songId: string) => {
    return useQuery({
      queryKey: ['deezer', 'track', songId],
      queryFn: () => deezerService.getSongDetails(songId),
      enabled: !!songId,
      staleTime: 60 * 60 * 1000,
    });
  };

  const usePlaylistTracks = (playlistId: string) => {
    return useQuery({
      queryKey: ['deezer', 'playlist-tracks', playlistId],
      queryFn: () => deezerService.getPlaylistTracks(playlistId),
      enabled: !!playlistId,
      staleTime: 15 * 60 * 1000,
    });
  };

  /**
   * Hook to fetch details for a specific artist.
   * @param artistId The ID of the artist.
   * @returns The react-query query result for the artist's details.
   */
  const useArtistDetails = (artistId: string) => {
    return useQuery({
      queryKey: ['deezer', 'artist', artistId],
      queryFn: () => deezerService.getArtistDetails(artistId),
      enabled: !!artistId,
      staleTime: 60 * 60 * 1000,
    });
  };

  /**
   * Hook to fetch the top tracks for a specific artist.
   * @param artistId The ID of the artist.
   * @param limit Optional. The maximum number of top tracks to fetch.
   * @returns The react-query query result for the artist's top tracks.
   */
  const useArtistTopTracks = (artistId: string, limit?: number) => {
    return useQuery({
      queryKey: ['deezer', 'artist-top-tracks', artistId, limit],
      queryFn: () => deezerService.getArtistTopTracks(artistId, limit),
      enabled: !!artistId,
      staleTime: 30 * 60 * 1000,
    });
  };

  /**
   * Hook to fetch albums for a specific artist.
   * @param artistId The ID of the artist.
   * @param limit Optional. The maximum number of albums to fetch.
   * @returns The react-query query result for the artist's albums.
   */
  const useArtistAlbums = (artistId: string, limit?: number) => {
    return useQuery({
      queryKey: ['deezer', 'artist-albums', artistId, limit],
      queryFn: () => deezerService.getArtistAlbums(artistId, limit),
      enabled: !!artistId,
      staleTime: 30 * 60 * 1000,
    });
  };

  /**
   * Hook to fetch tracks for a specific album.
   * @param albumId The ID of the album.
   * @param limit Optional. The maximum number of tracks to fetch.
   * @returns The react-query query result for the album's tracks.
   */
  const useAlbumTracks = (albumId: string, limit?: number) => {
    return useQuery({
      queryKey: ['deezer', 'album-tracks', albumId, limit],
      queryFn: () => deezerService.getAlbumTracks(albumId, limit),
      enabled: !!albumId,
      staleTime: 15 * 60 * 1000,
    });
  };

  return {
    deezerService,
    useSearchSongs,
    useArtistsByGenre,
    useTopTracksByGenre,
    useRadioForGenre,
    useRadioForArtist,
    useTopTracks,
    useGenres,
    useTrendingPlaylists,
    useSongDetails,
    usePlaylistTracks,
    useArtistDetails,
    useArtistTopTracks,
    useArtistAlbums,
    useAlbumTracks,
  };
};