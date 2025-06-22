import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SearchState {
  recentSearches: string[];
  trendingSearches: string[];
  searchFilters: {
    type: 'all' | 'track' | 'artist' | 'album';
    year: string;
    duration: 'all' | 'short' | 'medium' | 'long';
    popularity: 'all' | 'popular' | 'trending';
  };
}

interface SearchStore extends SearchState {
  addToRecentSearches: (query: string) => void;
  clearRecentSearches: () => void;
  setSearchFilters: (filters: Partial<SearchState['searchFilters']>) => void;
  resetSearchFilters: () => void;
}

const defaultTrendingSearches = [
  'Bad Bunny',
  'Taylor Swift',
  'The Weeknd',
  'Dua Lipa',
  'Drake',
  'Billie Eilish',
  'Ed Sheeran',
  'Ariana Grande'
];

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      recentSearches: [],
      trendingSearches: defaultTrendingSearches,
      searchFilters: {
        type: 'all',
        year: '',
        duration: 'all',
        popularity: 'all',
      },

      addToRecentSearches: (query: string) => {
        const { recentSearches } = get();
        const filteredSearches = recentSearches.filter(search => 
          search.toLowerCase() !== query.toLowerCase()
        );
        
        set({
          recentSearches: [query, ...filteredSearches].slice(0, 10)
        });
      },

      clearRecentSearches: () => {
        set({ recentSearches: [] });
      },

      setSearchFilters: (filters) => {
        set(state => ({
          searchFilters: { ...state.searchFilters, ...filters }
        }));
      },

      resetSearchFilters: () => {
        set({
          searchFilters: {
            type: 'all',
            year: '',
            duration: 'all',
            popularity: 'all',
          }
        });
      },
    }),
    {
      name: 'search-storage',
      partialize: (state) => ({
        recentSearches: state.recentSearches,
        searchFilters: state.searchFilters,
      }),
    }
  )
);