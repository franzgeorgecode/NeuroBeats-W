import { Workbox } from 'workbox-window';

class ServiceWorkerManager {
  private wb: Workbox | null = null;
  private registration: ServiceWorkerRegistration | null = null;

  async register() {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      this.wb = new Workbox('/sw.js');

      // Add event listeners
      this.wb.addEventListener('installed', (event) => {
        if (event.isUpdate) {
          // Show update available notification
          this.showUpdateNotification();
        }
      });

      this.wb.addEventListener('waiting', () => {
        // Show update ready notification
        this.showUpdateReadyNotification();
      });

      this.wb.addEventListener('controlling', () => {
        // Reload page when new service worker takes control
        window.location.reload();
      });

      try {
        this.registration = await this.wb.register();
        console.log('Service Worker registered successfully');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  async update() {
    if (this.wb) {
      await this.wb.update();
    }
  }

  skipWaiting() {
    if (this.wb) {
      this.wb.messageSkipWaiting();
    }
  }

  private showUpdateNotification() {
    // You can integrate this with your toast system
    console.log('App update available');
  }

  private showUpdateReadyNotification() {
    // You can integrate this with your toast system
    console.log('App update ready');
  }

  // Cache management with error handling
  async cacheTrack(trackUrl: string, trackId: string) {
    if (!this.registration || !trackUrl) return;

    try {
      const cache = await caches.open('music-cache-v1');
      await cache.add(trackUrl);
      
      // Store metadata in memory instead of localStorage to avoid storage access issues
      const metadata = {
        id: trackId,
        url: trackUrl,
        cachedAt: Date.now(),
      };
      
      // Use sessionStorage as fallback, with error handling
      try {
        sessionStorage.setItem(`cached-track-${trackId}`, JSON.stringify(metadata));
      } catch (storageError) {
        console.warn('Storage access denied, caching in memory only:', storageError);
      }
    } catch (error) {
      console.error('Failed to cache track:', error);
    }
  }

  async getCachedTrack(trackId: string): Promise<string | null> {
    try {
      let metadata = null;
      
      // Try to get from sessionStorage with error handling
      try {
        const stored = sessionStorage.getItem(`cached-track-${trackId}`);
        if (stored) {
          metadata = JSON.parse(stored);
        }
      } catch (storageError) {
        console.warn('Storage access denied:', storageError);
        return null;
      }
      
      if (!metadata) return null;

      const { url } = metadata;
      const cache = await caches.open('music-cache-v1');
      const response = await cache.match(url);
      
      return response ? url : null;
    } catch (error) {
      console.error('Failed to get cached track:', error);
      return null;
    }
  }

  async clearCache() {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      
      // Clear sessionStorage metadata with error handling
      try {
        Object.keys(sessionStorage).forEach(key => {
          if (key.startsWith('cached-track-')) {
            sessionStorage.removeItem(key);
          }
        });
      } catch (storageError) {
        console.warn('Storage access denied during cleanup:', storageError);
      }
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  async getCacheSize(): Promise<number> {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return estimate.usage || 0;
      }
      return 0;
    } catch (error) {
      console.error('Failed to get cache size:', error);
      return 0;
    }
  }
}

export const serviceWorkerManager = new ServiceWorkerManager();