import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  audioQuality: 'low' | 'normal' | 'high';
  autoplay: boolean;
  crossfade: number;
  notifications: {
    push: boolean;
    email: boolean;
    marketing: boolean;
  };
  accessibility: {
    highContrast: boolean;
    reduceMotion: boolean;
    fontSize: 'small' | 'normal' | 'large';
  };
  offline: {
    enabled: boolean;
    maxStorage: number; // in GB
  };
}

interface SettingsStore extends SettingsState {
  setAudioQuality: (quality: SettingsState['audioQuality']) => void;
  setAutoplay: (autoplay: boolean) => void;
  setCrossfade: (crossfade: number) => void;
  setNotifications: (notifications: SettingsState['notifications']) => void;
  setAccessibility: (accessibility: SettingsState['accessibility']) => void;
  setOffline: (offline: SettingsState['offline']) => void;
  resetSettings: () => void;
}

const defaultSettings: SettingsState = {
  audioQuality: 'normal',
  autoplay: true,
  crossfade: 0,
  notifications: {
    push: true,
    email: true,
    marketing: false,
  },
  accessibility: {
    highContrast: false,
    reduceMotion: false,
    fontSize: 'normal',
  },
  offline: {
    enabled: false,
    maxStorage: 2,
  },
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,
      
      setAudioQuality: (audioQuality) => set({ audioQuality }),
      setAutoplay: (autoplay) => set({ autoplay }),
      setCrossfade: (crossfade) => set({ crossfade }),
      setNotifications: (notifications) => set({ notifications }),
      setAccessibility: (accessibility) => set({ accessibility }),
      setOffline: (offline) => set({ offline }),
      
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'settings-storage',
    }
  )
);