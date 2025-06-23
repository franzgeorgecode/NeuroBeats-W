import { dailySongsCacheService, type CachedSong, type DailySongsCache } from './dailySongsCache';
import { getSongsByGenres, getAllSongs } from '../data/mockSongs';
import type { DeezerTrack } from './deezer';

export interface SmartMusicServiceOptions {
  deezerService?: any;
  fallbackToMock?: boolean;
  maxSongsPerGenre?: number;
}

class SmartMusicService {
  private deezerService: any;
  private readonly maxSongsPerGenre: number;
  private readonly fallbackToMock: boolean;

  // Géneros disponibles con sus variaciones de búsqueda
  private readonly GENRES = {
    'Pop': ['pop hits', 'popular pop', 'top pop songs', 'pop music'],
    'Rock': ['rock classics', 'rock hits', 'best rock songs', 'rock music'],
    'Hip Hop': ['hip hop hits', 'rap songs', 'hip hop top', 'rap music'],
    'Electronic': ['electronic music', 'edm hits', 'electronic dance', 'techno'],
    'R&B': ['r&b hits', 'rnb songs', 'soul music', 'r&b music'],
    'Jazz': ['jazz classics', 'smooth jazz', 'jazz standards', 'jazz music'],
    'Classical': ['classical music', 'orchestral', 'classical hits', 'symphony'],
    'Reggae': ['reggae classics', 'reggae hits', 'bob marley', 'reggae music'],
    'Country': ['country hits', 'country music', 'country songs', 'nashville'],
    'Latin': ['latin hits', 'spanish music', 'reggaeton', 'latin pop']
  };

  constructor(options: SmartMusicServiceOptions = {}) {
    this.deezerService = options.deezerService;
    this.maxSongsPerGenre = options.maxSongsPerGenre || 5;
    this.fallbackToMock = options.fallbackToMock !== false;
  }

  // Obtener canciones por géneros (método principal)
  async getSongsByGenres(genres: string[]): Promise<CachedSong[]> {
    try {
      // 1. Intentar obtener del caché primero
      const cachedSongs = this.getCachedSongsByGenres(genres);
      if (cachedSongs.length > 0) {
        console.log('Using cached songs');
        return cachedSongs;
      }

      // 2. Si no hay caché o está expirado, actualizar desde Deezer
      if (this.deezerService && dailySongsCacheService.needsUpdate()) {
        console.log('Updating cache from Deezer...');
        await this.updateCacheFromDeezer(genres);
        
        // Intentar obtener del caché nuevamente
        const updatedCachedSongs = this.getCachedSongsByGenres(genres);
        if (updatedCachedSongs.length > 0) {
          return updatedCachedSongs;
        }
      }

      // 3. Fallback a datos mock si falla todo lo demás
      if (this.fallbackToMock) {
        console.log('Using fallback mock songs');
        return this.getMockSongsByGenres(genres);
      }

      return [];
    } catch (error) {
      console.error('Error getting songs by genres:', error);
      
      // Fallback a datos mock en caso de error
      if (this.fallbackToMock) {
        return this.getMockSongsByGenres(genres);
      }
      
      return [];
    }
  }

  // Obtener canciones del caché
  private getCachedSongsByGenres(genres: string[]): CachedSong[] {
    return dailySongsCacheService.getSongsByGenres(genres);
  }

  // Actualizar caché desde Deezer
  private async updateCacheFromDeezer(genres: string[]): Promise<void> {
    if (!this.deezerService) {
      throw new Error('Deezer service not available');
    }

    try {
      for (const genre of genres) {
        await this.updateGenreInCache(genre);
        // Pequeña pausa entre requests para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Error updating cache from Deezer:', error);
      throw error;
    }
  }

  // Actualizar un género específico en el caché
  private async updateGenreInCache(genre: string): Promise<void> {
    try {
      const queries = this.GENRES[genre as keyof typeof this.GENRES] || [genre];
      const randomQuery = queries[Math.floor(Math.random() * queries.length)];
      
      const response = await this.deezerService.searchSongs(randomQuery, this.maxSongsPerGenre);
      
      if (response.data && response.data.length > 0) {
        const cachedSongs: CachedSong[] = response.data.slice(0, this.maxSongsPerGenre).map((track: DeezerTrack, index: number) => ({
          id: `${genre.toLowerCase()}_${track.id}`,
          title: track.title,
          artist: track.artist.name,
          album: track.album.title,
          duration: track.duration,
          preview_url: track.preview,
          cover_url: track.album.cover_xl || track.album.cover_big || track.album.cover_medium,
          genre: genre,
          rank: index + 1,
          deezer_id: track.id,
          cached_date: new Date().toISOString()
        }));

        dailySongsCacheService.addGenreSongs(genre, cachedSongs);
        console.log(`Updated cache for ${genre}: ${cachedSongs.length} songs`);
      }
    } catch (error) {
      console.error(`Error updating cache for genre ${genre}:`, error);
    }
  }

  // Obtener canciones mock como fallback
  private getMockSongsByGenres(genres: string[]): CachedSong[] {
    const mockSongs = getSongsByGenres(genres);
    
    return mockSongs.slice(0, genres.length * this.maxSongsPerGenre).map(song => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      album: song.title + ' - Single',
      duration: song.duration,
      preview_url: song.preview_url,
      cover_url: song.cover_url,
      genre: song.genre,
      rank: 1,
      deezer_id: song.id,
      cached_date: new Date().toISOString()
    }));
  }

  // Forzar actualización del caché
  async forceUpdateCache(genres: string[] = []): Promise<boolean> {
    try {
      // Limpiar caché existente
      dailySongsCacheService.clearCache();
      
      // Si no se especifican géneros, usar todos los disponibles
      const genresToUpdate = genres.length > 0 ? genres : Object.keys(this.GENRES);
      
      if (this.deezerService) {
        await this.updateCacheFromDeezer(genresToUpdate);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error forcing cache update:', error);
      return false;
    }
  }

  // Obtener estadísticas del caché
  getCacheInfo() {
    return dailySongsCacheService.getCacheStats();
  }

  // Verificar si hay conectividad a Deezer
  async testDeezerConnection(): Promise<boolean> {
    if (!this.deezerService) return false;
    
    try {
      const response = await this.deezerService.searchSongs('test', 1);
      return response && response.data && response.data.length >= 0;
    } catch (error) {
      console.error('Deezer connection test failed:', error);
      return false;
    }
  }

  // Obtener géneros disponibles
  getAvailableGenres(): string[] {
    return Object.keys(this.GENRES);
  }

  // Configurar servicio Deezer
  setDeezerService(deezerService: any): void {
    this.deezerService = deezerService;
  }
}

export const smartMusicService = new SmartMusicService();