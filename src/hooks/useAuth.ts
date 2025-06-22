import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import { AuthService } from '../services/auth';
import { useAuthStore } from '../stores/authStore';
import { useToast } from './useToast';

export const useAuth = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    setAuthenticated,
    setLoading,
    logout: logoutStore,
  } = useAuthStore();

  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      if (initialized) return;

      try {
        setLoading(true);
        
        // Get initial session
        const { session } = await AuthService.getSession();
        
        if (!mounted) return;
        
        setSession(session);
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            username: session.user.user_metadata?.username || '',
            avatar_url: session.user.user_metadata?.avatar_url,
            created_at: session.user.created_at || '',
            updated_at: session.user.updated_at || '',
          });
          setAuthenticated(true);
        } else {
          setUser(null);
          setAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setUser(null);
          setAuthenticated(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        setSession(session);
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            username: session.user.user_metadata?.username || '',
            avatar_url: session.user.user_metadata?.avatar_url,
            created_at: session.user.created_at || '',
            updated_at: session.user.updated_at || '',
          });
          setAuthenticated(true);
          
          if (event === 'SIGNED_IN') {
            showToast('Welcome back!', 'success');
            navigate('/');
          }
        } else {
          setUser(null);
          setAuthenticated(false);
          
          if (event === 'SIGNED_OUT') {
            showToast('Signed out successfully', 'success');
            navigate('/auth');
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setAuthenticated, setLoading, navigate, showToast, initialized]);

  const signUp = async (credentials: {
    email: string;
    password: string;
    username?: string;
    fullName?: string;
  }) => {
    setLoading(true);
    const { data, error } = await AuthService.signUp(credentials);
    
    if (error) {
      showToast(error.message, 'error');
      setLoading(false);
      return { success: false, error };
    }

    if (data.user && !data.session) {
      showToast('Please check your email to verify your account', 'info');
    }

    setLoading(false);
    return { success: true, data };
  };

  const signIn = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    const { data, error } = await AuthService.signIn(credentials);
    
    if (error) {
      showToast(error.message, 'error');
      setLoading(false);
      return { success: false, error };
    }

    setLoading(false);
    return { success: true, data };
  };

  const signInWithProvider = async (provider: 'discord' | 'github' | 'google') => {
    setLoading(true);
    const { data, error } = await AuthService.signInWithProvider(provider);
    
    if (error) {
      showToast(error.message, 'error');
      setLoading(false);
      return { success: false, error };
    }

    setLoading(false);
    return { success: true, data };
  };

  const logout = async () => {
    setLoading(true);
    const { error } = await AuthService.signOut();
    
    if (error) {
      showToast(error.message, 'error');
    }
    
    logoutStore();
    setLoading(false);
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    const { error } = await AuthService.resetPassword(email);
    
    if (error) {
      showToast(error.message, 'error');
      setLoading(false);
      return { success: false, error };
    }

    showToast('Password reset email sent', 'success');
    setLoading(false);
    return { success: true };
  };

  return {
    user,
    session,
    isAuthenticated,
    isLoading: isLoading && !initialized,
    signUp,
    signIn,
    signInWithProvider,
    logout,
    resetPassword,
  };
};