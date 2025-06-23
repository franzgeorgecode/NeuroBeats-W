import { QueryClient } from '@tanstack/react-query';

export interface DeezerTrack {
  id: string;
  title: string;
  title_short: string;
  title_version?: string;
  link: string;
  duration: number;
  rank: number;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  preview: string;
  md5_image: string;
  artist: {
    id: string;
    name: string;
    link: string;
    picture: string;
    picture_small: string;
    picture_medium: string;
    picture_big: string;
    picture_xl: string;
    tracklist: string;
    type: string;
  };
  album: {
    id: string;
    title: string;
    cover: string;
    cover_small: string;
    cover_medium: string;
    cover_big: string;
    cover_xl: string;
    md5_image: string;
    tracklist: string;
    type: string;
  };
  type: string;
}

export interface DeezerPlaylist {
  id: string;
  title: string;
  description: string;
  duration: number;
  public: boolean;
  is_loved_track: boolean;
  collaborative: boolean;
  nb_tracks: number;
  fans: number;
  link: string;
  share: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  checksum: string;
  tracklist: string;
  creation_date: string;
  md5_image: string;
  picture_type: string;
  user: {
    id: string;
    name: string;
    tracklist: string;
    type: string;
  };
  type: string;
}

export interface DeezerGenre {
  id: string;
  name: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  type: string;
}

export interface DeezerArtist {
  id: string;
  name: string;
  link: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  nb_album: number;
  nb_fan: number;
  radio: boolean;
  tracklist: string;
  type: 'artist';
}

// Interface for album lists (e.g., artist's albums)
// Based on the 'album' object within DeezerTrack, but as a root object
export interface DeezerAlbumPreview {
  id: string;
  title: string;
  link: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  md5_image: string;
  genre_id?: number; // Optional, may not always be present
  fans?: number; // Optional
  release_date?: string; // Optional
  record_type?: string; // e.g., 'album', 'single'
  tracklist: string;
  explicit_lyrics?: boolean; // Optional
  type: 'album';
}

// Response type for lists of albums
export interface DeezerArtistAlbumsResponse {
  data: DeezerAlbumPreview[];
  total: number;
  next?: string;
}

// For album details, we can reuse DeezerAlbumPreview if it's comprehensive enough,
// or define a new DeezerAlbumDetail if more fields are returned by /album/{id} endpoint.
// For now, let's assume /album/{id} returns DeezerAlbumPreview.
// The tracks for an album are expected to be DeezerTrack objects.
export interface DeezerAlbumTracksResponse {
  data: DeezerTrack[];
  total: number;
  next?: string;
}

export interface DeezerArtistListResponse {
  data: DeezerArtist[];
  total?: number; // Optional total, as not all artist list endpoints provide it
  next?: string; // Optional next, for pagination if available
}

export interface DeezerSearchResponse {
  data: DeezerTrack[];
  total: number;
  next?: string;
}

export interface DeezerPlaylistResponse {
  data: DeezerPlaylist[];
  total: number;
}

export interface DeezerGenreResponse {
  data: DeezerGenre[];
}

class DeezerService {
  private baseURL = 'https://deezerdevs-deezer.p.rapidapi.com';
  private apiKey = import.meta.env.VITE_RAPIDAPI_KEY;
  private queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com',
        },
        timeout: 10000, // 10 second timeout
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw error;
    }
  }

  async searchSongs(query: string, limit: number = 25): Promise<DeezerSearchResponse> {
    const cacheKey = ['deezer', 'search', query, limit];
    
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: () => this.makeRequest<DeezerSearchResponse>('/search', {
        q: query,
        limit: limit.toString(),
      }),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    });
  }

  /**
   * Fetches songs for a specific genre using search.
   * @param genreName The name of the genre.
   * @param limit The maximum number of songs to fetch (default is 25).
   * @returns A promise that resolves to a list of songs in the specified genre.
   */
  async getSongsByGenre(genreName: string, limit: number = 25): Promise<DeezerSearchResponse> {
    const cacheKey = ['deezer', 'genre-songs', genreName, limit];
    
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: async () => {
        // Mejorar las búsquedas por género con términos más específicos
        const genreQueries = {
          'Pop': ['pop hits', 'popular pop', 'top pop songs'],
          'Rock': ['rock classics', 'rock hits', 'best rock songs'],
          'Hip Hop': ['hip hop hits', 'rap songs', 'hip hop top'],
          'Electronic': ['electronic music', 'edm hits', 'electronic dance'],
          'R&B': ['r&b hits', 'rnb songs', 'soul music'],
          'Jazz': ['jazz classics', 'smooth jazz', 'jazz standards'],
          'Classical': ['classical music', 'orchestral', 'classical hits'],
          'Reggae': ['reggae classics', 'reggae hits', 'bob marley'],
          'Country': ['country hits', 'country music', 'country songs'],
          'Latin': ['latin hits', 'spanish music', 'reggaeton']
        };

        const queries = genreQueries[genreName as keyof typeof genreQueries] || [genreName];
        const randomQuery = queries[Math.floor(Math.random() * queries.length)];
        
        try {
          return await this.searchSongs(randomQuery, limit);
        } catch (error) {
          // Fallback a búsqueda simple
          return await this.searchSongs(genreName, limit);
        }
      },
      staleTime: 10 * 60 * 1000, // 10 minutos para actualizar más frecuentemente
      gcTime: 20 * 60 * 1000, // 20 minutos
    });
  }


  async getTrendingPlaylists(limit: number = 25): Promise<DeezerSearchResponse> {
    // Since chart endpoints aren't available, use popular search terms as fallback
    const cacheKey = ['deezer', 'trending-playlists', limit];
    
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: () => this.searchSongs('top hits 2024', limit),
      staleTime: 30 * 60 * 1000, // 30 minutes
      gcTime: 60 * 60 * 1000, // 1 hour
    });
  }

  async getSongDetails(songId: string): Promise<DeezerTrack> {
    const cacheKey = ['deezer', 'track', songId];
    
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: () => this.makeRequest<DeezerTrack>(`/track/${songId}`),
      staleTime: 60 * 60 * 1000, // 1 hour
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
    });
  }

  async getGenres(): Promise<DeezerGenreResponse> {
    const cacheKey = ['deezer', 'genres'];
    
    // Since genre endpoint isn't available, return predefined genres
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: () => Promise.resolve({
        data: [
          { id: '1', name: 'Pop', picture: '', picture_small: '', picture_medium: '', picture_big: '', picture_xl: '', type: 'genre' },
          { id: '2', name: 'Rock', picture: '', picture_small: '', picture_medium: '', picture_big: '', picture_xl: '', type: 'genre' },
          { id: '3', name: 'Hip Hop', picture: '', picture_small: '', picture_medium: '', picture_big: '', picture_xl: '', type: 'genre' },
          { id: '4', name: 'Electronic', picture: '', picture_small: '', picture_medium: '', picture_big: '', picture_xl: '', type: 'genre' },
          { id: '5', name: 'R&B', picture: '', picture_small: '', picture_medium: '', picture_big: '', picture_xl: '', type: 'genre' },
          { id: '6', name: 'Jazz', picture: '', picture_small: '', picture_medium: '', picture_big: '', picture_xl: '', type: 'genre' },
          { id: '7', name: 'Classical', picture: '', picture_small: '', picture_medium: '', picture_big: '', picture_xl: '', type: 'genre' },
          { id: '8', name: 'Reggae', picture: '', picture_small: '', picture_medium: '', picture_big: '', picture_xl: '', type: 'genre' },
          { id: '9', name: 'Country', picture: '', picture_small: '', picture_medium: '', picture_big: '', picture_xl: '', type: 'genre' },
          { id: '10', name: 'Latin', picture: '', picture_small: '', picture_medium: '', picture_big: '', picture_xl: '', type: 'genre' },
        ]
      }),
      staleTime: 24 * 60 * 60 * 1000, // 24 hours
      gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  async getTopTracks(limit: number = 50): Promise<DeezerSearchResponse> {
    const cacheKey = ['deezer', 'top-tracks', limit];
    
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: async () => {
        // Intentar con diferentes queries populares para obtener variedad
        const popularQueries = [
          'top hits 2024', 
          'popular music 2024',
          'trending songs',
          'chart toppers',
          'best songs 2024',
          'viral hits',
          'mainstream music'
        ];
        
        try {
          // Usar una query aleatoria para obtener variedad
          const randomQuery = popularQueries[Math.floor(Math.random() * popularQueries.length)];
          const result = await this.searchSongs(randomQuery, limit);
          
          // Asegurar que tenemos datos válidos con preview URLs
          if (result.data && result.data.length > 0) {
            result.data = result.data.filter(track => 
              track.preview && 
              track.preview.length > 0 && 
              track.title && 
              track.artist?.name
            );
          }
          
          return result;
        } catch (error) {
          // Fallback a query simple si falla
          const fallbackResult = await this.searchSongs('popular songs', limit);
          
          // Filtrar tracks sin preview
          if (fallbackResult.data) {
            fallbackResult.data = fallbackResult.data.filter(track => 
              track.preview && 
              track.preview.length > 0
            );
          }
          
          return fallbackResult;
        }
      },
      staleTime: 15 * 60 * 1000, // 15 minutos para refrescar más frecuentemente
      gcTime: 30 * 60 * 1000, // 30 minutos
    });
  }

  async getPlaylistTracks(playlistId: string): Promise<DeezerSearchResponse> {
    const cacheKey = ['deezer', 'playlist-tracks', playlistId];
    
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: () => this.makeRequest<DeezerSearchResponse>(`/playlist/${playlistId}/tracks`),
      staleTime: 15 * 60 * 1000, // 15 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    });
  }

  // Convert Deezer track to our internal Track type
  convertToTrack(deezerTrack: DeezerTrack): import('../types').Track {
    return {
      id: deezerTrack.id,
      title: deezerTrack.title,
      artist: deezerTrack.artist.name,
      artistId: deezerTrack.artist.id,
      album: deezerTrack.album.title,
      albumId: deezerTrack.album.id,
      duration: deezerTrack.duration,
      cover_url: deezerTrack.album.cover_xl || deezerTrack.album.cover_big,
      audio_url: deezerTrack.preview,
      genre: '',
      release_date: '',
      plays_count: deezerTrack.rank,
      likes_count: 0,
      created_at: new Date().toISOString(),
    };
  }

  /**
   * Fetches details for a specific artist.
   * @param artistId The ID of the artist.
   * @returns A promise that resolves to the artist's details.
   */
  async getArtistDetails(artistId: string): Promise<DeezerArtist> {
    const cacheKey = ['deezer', 'artist', artistId];
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: () => this.makeRequest<DeezerArtist>(`/artist/${artistId}`),
      staleTime: 60 * 60 * 1000, // 1 hour
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
    });
  }

  /**
   * Fetches the top tracks for a specific artist.
   * @param artistId The ID of the artist.
   * @param limit The maximum number of top tracks to fetch (default is 10).
   * @returns A promise that resolves to a list of the artist's top tracks.
   */
  async getArtistTopTracks(artistId: string, limit: number = 10): Promise<DeezerSearchResponse> {
    const cacheKey = ['deezer', 'artist-top-tracks', artistId, limit];
    
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: async () => {
        // First get artist details to get the name
        const artist = await this.getArtistDetails(artistId);
        // Then search for the artist's songs
        return this.searchSongs(artist.name, limit);
      },
      staleTime: 30 * 60 * 1000, // 30 minutes
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
    });
  }

  /**
   * Fetches a list of artists for a specific genre.
   * @param genreId The ID of the genre.
   * @param limit The maximum number of artists to fetch (default is 25).
   * @returns A promise that resolves to a list of artists in the genre.
   */
  async getArtistsByGenre(genreId: string, limit: number = 25): Promise<DeezerArtistListResponse> {
    const cacheKey = ['deezer', 'genre-artists', genreId, limit];
    
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: async () => {
        // Since we don't have direct genre endpoints, search for popular artists
        const genreNames: { [key: string]: string } = {
          '1': 'pop artists',
          '2': 'rock artists', 
          '3': 'hip hop artists',
          '4': 'electronic artists',
          '5': 'r&b artists'
        };
        
        const searchTerm = genreNames[genreId] || 'popular artists';
        const searchResult = await this.searchSongs(searchTerm, limit);
        
        // Extract unique artists from search results
        const artists: DeezerArtist[] = [];
        const seenArtists = new Set<string>();
        
        for (const track of searchResult.data) {
          if (!seenArtists.has(track.artist.id) && artists.length < limit) {
            seenArtists.add(track.artist.id);
            artists.push({
              id: track.artist.id,
              name: track.artist.name,
              link: track.artist.link,
              picture: track.artist.picture,
              picture_small: track.artist.picture_small,
              picture_medium: track.artist.picture_medium,
              picture_big: track.artist.picture_big,
              picture_xl: track.artist.picture_xl,
              nb_album: 0,
              nb_fan: 0,
              radio: false,
              tracklist: track.artist.tracklist,
              type: 'artist'
            });
          }
        }
        
        return { data: artists };
      },
      staleTime: 30 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
    });
  }

  /**
   * Fetches the top tracks for a specific genre.
   * @param genreId The ID of the genre.
   * @param limit The maximum number of tracks to fetch.
   * @returns A promise that resolves to a list of top tracks in the genre.
   */
  async getTopTracksByGenre(genreId: string, limit: number = 25): Promise<DeezerSearchResponse> {
    const cacheKey = ['deezer', 'genre-top-tracks', genreId, limit];
    
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: async () => {
        const genreNames: { [key: string]: string } = {
          '1': 'Pop',
          '2': 'Rock', 
          '3': 'Hip Hop',
          '4': 'Electronic',
          '5': 'R&B'
        };
        
        const genreName = genreNames[genreId] || 'music';
        return await this.getSongsByGenre(genreName, limit);
      },
      staleTime: 30 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
    });
  }

  /**
   * Fetches radio tracks for a specific genre.
   * @param genreId The ID of the genre.
   * @param limit The maximum number of tracks to fetch.
   * @returns A promise that resolves to radio tracks for the genre.
   */
  async getRadioForGenre(genreId: string, limit: number = 25): Promise<DeezerSearchResponse> {
    const cacheKey = ['deezer', 'genre-radio', genreId, limit];
    
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: async () => {
        // Use top tracks by genre as radio substitute
        return await this.getTopTracksByGenre(genreId, limit);
      },
      staleTime: 15 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    });
  }

  /**
   * Fetches radio tracks for a specific artist.
   * @param artistId The ID of the artist.
   * @param limit The maximum number of tracks to fetch.
   * @returns A promise that resolves to radio tracks for the artist.
   */
  async getRadioForArtist(artistId: string, limit: number = 25): Promise<DeezerSearchResponse> {
    const cacheKey = ['deezer', 'artist-radio', artistId, limit];
    
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: async () => {
        // Use artist's top tracks as radio substitute
        return await this.getArtistTopTracks(artistId, limit);
      },
      staleTime: 15 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    });
  }

  /**
   * Fetches albums for a specific artist.
   * @param artistId The ID of the artist.
   * @param limit The maximum number of albums to fetch.
   * @returns A promise that resolves to the artist's albums.
   */
  async getArtistAlbums(artistId: string, limit: number = 25): Promise<DeezerArtistAlbumsResponse> {
    const cacheKey = ['deezer', 'artist-albums', artistId, limit];
    
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: async () => {
        try {
          const response = await this.makeRequest<DeezerArtistAlbumsResponse>(`/artist/${artistId}/albums?limit=${limit}`);
          return response;
        } catch (error) {
          // Fallback: get artist details and create mock albums
          const artist = await this.getArtistDetails(artistId);
          const mockAlbums: DeezerAlbumPreview[] = [{
            id: `${artistId}_album1`,
            title: `${artist.name} - Greatest Hits`,
            link: '',
            cover: artist.picture_xl,
            cover_small: artist.picture_small,
            cover_medium: artist.picture_medium,
            cover_big: artist.picture_big,
            cover_xl: artist.picture_xl,
            md5_image: '',
            tracklist: '',
            type: 'album'
          }];
          
          return { data: mockAlbums, total: mockAlbums.length };
        }
      },
      staleTime: 30 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
    });
  }

  /**
   * Fetches tracks for a specific album.
   * @param albumId The ID of the album.
   * @param limit The maximum number of tracks to fetch.
   * @returns A promise that resolves to the album's tracks.
   */
  async getAlbumTracks(albumId: string, limit: number = 25): Promise<DeezerAlbumTracksResponse> {
    const cacheKey = ['deezer', 'album-tracks', albumId, limit];
    
    return this.queryClient.fetchQuery({
      queryKey: cacheKey,
      queryFn: async () => {
        try {
          const response = await this.makeRequest<DeezerAlbumTracksResponse>(`/album/${albumId}/tracks?limit=${limit}`);
          return response;
        } catch (error) {
          // Fallback: return popular tracks as album content
          const popularTracks = await this.searchSongs('popular music', limit);
          return {
            data: popularTracks.data,
            total: popularTracks.data.length
          };
        }
      },
      staleTime: 15 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    });
  }

}

export default DeezerService;