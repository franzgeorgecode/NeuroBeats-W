import { supabase } from './supabase';
import type { Profile, UserPreferences, ListeningHistory } from '../types/supabase';

export class ProfileService {
  // Get user profile
  static async getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  // Update user profile
  static async updateProfile(userId: string, updates: Partial<Profile>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  // Check username availability
  static async checkUsernameAvailability(username: string, currentUserId?: string) {
    try {
      let query = supabase
        .from('profiles')
        .select('id')
        .eq('username', username);

      if (currentUserId) {
        query = query.neq('id', currentUserId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { isAvailable: data.length === 0, error: null };
    } catch (error: any) {
      return { isAvailable: false, error: { message: error.message } };
    }
  }

  // Get user preferences
  static async getUserPreferences(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  // Update user preferences
  static async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .update(preferences)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  // Add to listening history
  static async addToListeningHistory(userId: string, trackId: string, playDuration = 0, completed = false) {
    try {
      const { data, error } = await supabase
        .from('listening_history')
        .insert({
          user_id: userId,
          track_id: trackId,
          play_duration: playDuration,
          completed,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  // Get listening history
  static async getListeningHistory(userId: string, limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('listening_history')
        .select('*')
        .eq('user_id', userId)
        .order('played_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  // Upload avatar
  static async uploadAvatar(userId: string, file: File) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { data, error } = await this.updateProfile(userId, {
        avatar_url: publicUrl,
      });

      if (error) throw error;
      return { data: publicUrl, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }
}