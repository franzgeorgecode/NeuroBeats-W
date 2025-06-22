import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Auth functions
export const authAPI = {
  signUp: async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },
};

// Tracks functions
export const tracksAPI = {
  getTracks: async (limit = 50, offset = 0) => {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  getTrackById: async (id: string) => {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  searchTracks: async (query: string) => {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .or(`title.ilike.%${query}%,artist.ilike.%${query}%,album.ilike.%${query}%`)
      .limit(20);
    return { data, error };
  },
};

// Playlists functions
export const playlistsAPI = {
  getUserPlaylists: async (userId: string) => {
    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  createPlaylist: async (playlist: any) => {
    const { data, error } = await supabase
      .from('playlists')
      .insert([playlist])
      .select()
      .single();
    return { data, error };
  },

  updatePlaylist: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('playlists')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  deletePlaylist: async (id: string) => {
    const { error } = await supabase
      .from('playlists')
      .delete()
      .eq('id', id);
    return { error };
  },
};