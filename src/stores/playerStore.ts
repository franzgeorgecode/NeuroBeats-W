import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PlayerState, Track } from '../types';

interface PlayerStore extends PlayerState {
  setCurrentTrack: (track: Track) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setQueue: (tracks: Track[]) => void;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      isPlaying: false,
      volume: 0.8,
      progress: 0,
      duration: 0,
      queue: [],
      currentIndex: 0,
      shuffle: false,
      repeat: 'none',
      
      setCurrentTrack: (track) => {
        const { queue } = get();
        const existingIndex = queue.findIndex(t => t.id === track.id);
        
        if (existingIndex === -1) {
          // Add track to queue if not already there
          set({ 
            currentTrack: track,
            queue: [track, ...queue],
            currentIndex: 0,
            progress: 0
          });
        } else {
          // Set existing track as current
          set({ 
            currentTrack: track,
            currentIndex: existingIndex,
            progress: 0
          });
        }
      },
      
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setVolume: (volume) => set({ volume }),
      setProgress: (progress) => set({ progress }),
      setDuration: (duration) => set({ duration }),
      
      addToQueue: (track) => set((state) => ({ 
        queue: [...state.queue, track] 
      })),
      
      removeFromQueue: (index) => set((state) => {
        const newQueue = state.queue.filter((_, i) => i !== index);
        let newCurrentIndex = state.currentIndex;
        
        if (index < state.currentIndex) {
          newCurrentIndex = state.currentIndex - 1;
        } else if (index === state.currentIndex) {
          newCurrentIndex = Math.min(state.currentIndex, newQueue.length - 1);
        }
        
        return {
          queue: newQueue,
          currentIndex: newCurrentIndex,
          currentTrack: newQueue[newCurrentIndex] || null,
        };
      }),
      
      clearQueue: () => set({ 
        queue: [], 
        currentIndex: 0, 
        currentTrack: null,
        isPlaying: false 
      }),
      
      setQueue: (tracks) => set({
        queue: tracks,
        currentIndex: 0,
        currentTrack: tracks[0] || null,
      }),
      
      nextTrack: () => {
        const { queue, currentIndex, shuffle, repeat } = get();
        if (queue.length === 0) return;
        
        let nextIndex;
        
        if (repeat === 'one') {
          // Stay on current track
          return;
        } else if (shuffle) {
          // Random track
          do {
            nextIndex = Math.floor(Math.random() * queue.length);
          } while (nextIndex === currentIndex && queue.length > 1);
        } else {
          // Next track in order
          nextIndex = (currentIndex + 1) % queue.length;
        }
        
        set({ 
          currentIndex: nextIndex,
          currentTrack: queue[nextIndex],
          progress: 0
        });
      },
      
      previousTrack: () => {
        const { queue, currentIndex, shuffle } = get();
        if (queue.length === 0) return;
        
        let prevIndex;
        
        if (shuffle) {
          // Random track
          do {
            prevIndex = Math.floor(Math.random() * queue.length);
          } while (prevIndex === currentIndex && queue.length > 1);
        } else {
          // Previous track in order
          prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
        }
        
        set({ 
          currentIndex: prevIndex,
          currentTrack: queue[prevIndex],
          progress: 0
        });
      },
      
      toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
      
      toggleRepeat: () => set((state) => ({
        repeat: state.repeat === 'none' ? 'all' : 
                state.repeat === 'all' ? 'one' : 'none'
      })),
    }),
    {
      name: 'player-storage',
      partialize: (state) => ({
        volume: state.volume,
        shuffle: state.shuffle,
        repeat: state.repeat,
        queue: state.queue,
        currentIndex: state.currentIndex,
        currentTrack: state.currentTrack,
      }),
    }
  )
);