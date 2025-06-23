export interface CachedSong {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  preview_url: string;
  cover_url: string;
  genre: string;
  rank: number;
  deezer_id: string;
  cached_date: string;
}

export interface DailySongsCache {
  lastUpdated: string;
  genres: {
    [genreName: string]: CachedSong[];
  };
}

class DailySongsCacheService {
  private readonly STORAGE_KEY = 'neurobeats_daily_songs_cache';
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

  // Obtener el caché actual
  getCache(): DailySongsCache | null {
    try {
      const cached = localStorage.getItem(this.STORAGE_KEY);
      if (!cached) return null;
      
      const data = JSON.parse(cached) as DailySongsCache;
      
      // Verificar si el caché es válido (no más de 24 horas)
      const lastUpdated = new Date(data.lastUpdated);
      const now = new Date();
      const timeDiff = now.getTime() - lastUpdated.getTime();
      
      if (timeDiff > this.CACHE_DURATION) {
        // Caché expirado, eliminarlo
        this.clearCache();
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error reading songs cache:', error);
      this.clearCache();
      return null;
    }
  }

  // Guardar canciones en el caché
  saveCache(cache: DailySongsCache): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.error('Error saving songs cache:', error);
    }
  }

  // Limpiar el caché
  clearCache(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing songs cache:', error);
    }
  }

  // Obtener canciones por género desde el caché
  getSongsByGenre(genre: string): CachedSong[] {
    const cache = this.getCache();
    if (!cache || !cache.genres[genre]) {
      return [];
    }
    return cache.genres[genre];
  }

  // Obtener canciones por múltiples géneros
  getSongsByGenres(genres: string[]): CachedSong[] {
    const cache = this.getCache();
    if (!cache) return [];

    const songs: CachedSong[] = [];
    genres.forEach(genre => {
      const genreSongs = cache.genres[genre] || [];
      songs.push(...genreSongs.slice(0, 5)); // Top 5 por género
    });

    return songs;
  }

  // Verificar si necesita actualización
  needsUpdate(): boolean {
    const cache = this.getCache();
    return cache === null;
  }

  // Obtener fecha de última actualización
  getLastUpdated(): string | null {
    const cache = this.getCache();
    return cache?.lastUpdated || null;
  }

  // Crear un nuevo caché vacío
  createEmptyCache(): DailySongsCache {
    return {
      lastUpdated: new Date().toISOString(),
      genres: {}
    };
  }

  // Agregar canciones de un género al caché
  addGenreSongs(genre: string, songs: CachedSong[]): void {
    let cache = this.getCache();
    if (!cache) {
      cache = this.createEmptyCache();
    }

    cache.genres[genre] = songs;
    cache.lastUpdated = new Date().toISOString();
    this.saveCache(cache);
  }

  // Obtener estadísticas del caché
  getCacheStats(): {
    totalSongs: number;
    genresCount: number;
    lastUpdated: string | null;
    isExpired: boolean;
  } {
    const cache = this.getCache();
    
    if (!cache) {
      return {
        totalSongs: 0,
        genresCount: 0,
        lastUpdated: null,
        isExpired: true
      };
    }

    const totalSongs = Object.values(cache.genres).reduce(
      (sum, songs) => sum + songs.length, 
      0
    );

    const lastUpdated = new Date(cache.lastUpdated);
    const now = new Date();
    const timeDiff = now.getTime() - lastUpdated.getTime();
    const isExpired = timeDiff > this.CACHE_DURATION;

    return {
      totalSongs,
      genresCount: Object.keys(cache.genres).length,
      lastUpdated: cache.lastUpdated,
      isExpired
    };
  }
}

export const dailySongsCacheService = new DailySongsCacheService();