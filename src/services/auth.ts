import { supabase } from './supabase';
import type { Provider } from '@supabase/supabase-js';

export interface AuthCredentials {
  email: string;
  password: string;
  username?: string;
  fullName?: string;
}

export interface AuthError {
  message: string;
  field?: string;
}

export class AuthService {
  // Email/Password Authentication
  static async signUp({ email, password, username, fullName }: AuthCredentials) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { data: null, error: { message: error.message } };
    }
  }

  static async signIn({ email, password }: AuthCredentials) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { data: null, error: { message: error.message } };
    }
  }

  // OAuth Authentication
  static async signInWithProvider(provider: Provider) {
    try {
      // Get the current URL for redirect
      const currentUrl = window.location.origin;
      const redirectTo = `${currentUrl}/auth/callback`;
      
      console.log(`Attempting OAuth with ${provider}`);
      console.log(`Redirect URL: ${redirectTo}`);
      
      // Verify Supabase URL is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl === 'your_supabase_url_here') {
        throw new Error('Supabase URL not configured. Please check your environment variables.');
      }
      
      console.log(`Supabase URL: ${supabaseUrl}`);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          // Add specific scopes for each provider
          scopes: provider === 'github' ? 'user:email' : 
                 provider === 'google' ? 'email profile' :
                 provider === 'discord' ? 'identify email' : undefined,
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error(`Sign in with ${provider} error:`, error);
      return { data: null, error: { message: error.message } };
    }
  }

  // Sign out
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { error: { message: error.message } };
    }
  }

  // Reset password
  static async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return { error: { message: error.message } };
    }
  }

  // Update password
  static async updatePassword(password: string) {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Update password error:', error);
      return { error: { message: error.message } };
    }
  }

  // Get current session
  static async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { session, error: null };
    } catch (error: any) {
      console.error('Get session error:', error);
      return { session: null, error: { message: error.message } };
    }
  }

  // Get current user
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { user, error: null };
    } catch (error: any) {
      console.error('Get current user error:', error);
      return { user: null, error: { message: error.message } };
    }
  }

  // Validate email format
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Validate username
  static validateUsername(username: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }
    
    if (username.length > 20) {
      errors.push('Username must be no more than 20 characters long');
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, and underscores');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Check if Supabase is properly configured
  static checkConfiguration(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || supabaseUrl === 'your_supabase_url_here') {
      errors.push('Supabase URL is not configured');
    } else if (!supabaseUrl.includes('.supabase.co')) {
      errors.push('Invalid Supabase URL format');
    }
    
    if (!supabaseKey || supabaseKey === 'your_supabase_anon_key_here') {
      errors.push('Supabase anonymous key is not configured');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}