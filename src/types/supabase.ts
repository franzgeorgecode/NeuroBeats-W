export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          bio: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          favorite_genres: string[]
          selected_songs: Json
          theme_preference: string
          notification_settings: Json
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          favorite_genres?: string[]
          selected_songs?: Json
          theme_preference?: string
          notification_settings?: Json
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          favorite_genres?: string[]
          selected_songs?: Json
          theme_preference?: string
          notification_settings?: Json
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      listening_history: {
        Row: {
          id: string
          user_id: string
          track_id: string
          played_at: string
          play_duration: number
          completed: boolean
        }
        Insert: {
          id?: string
          user_id: string
          track_id: string
          played_at?: string
          play_duration?: number
          completed?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          track_id?: string
          played_at?: string
          play_duration?: number
          completed?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_username: {
        Args: {
          email_input: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type UserPreferences = Database['public']['Tables']['user_preferences']['Row']
export type ListeningHistory = Database['public']['Tables']['listening_history']['Row']