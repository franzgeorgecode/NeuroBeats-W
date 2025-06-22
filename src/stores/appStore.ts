import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState } from '../types';

interface AppStore extends AppState {
  setTheme: (theme: 'dark' | 'light') => void;
  toggleSidebar: () => void;
  setCurrentPage: (page: string) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarCollapsed: false,
      currentPage: 'home',
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),
      setCurrentPage: (currentPage) => set({ currentPage }),
    }),
    {
      name: 'app-storage',
    }
  )
);