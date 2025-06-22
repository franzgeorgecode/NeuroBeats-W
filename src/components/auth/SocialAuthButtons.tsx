import React from 'react';
import { motion } from 'framer-motion';
import { Github } from 'lucide-react';
import { useSignIn } from '@clerk/clerk-react';
import { useToast } from '../../hooks/useToast';

// Custom Discord icon component
const DiscordIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

// Custom Google icon component
const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

interface SocialAuthButtonsProps {
  isLoading?: boolean;
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({ isLoading = false }) => {
  const { signIn } = useSignIn();
  const { showToast } = useToast();

  const providers = [
    {
      name: 'Google',
      provider: 'google' as const,
      icon: GoogleIcon,
      color: 'from-red-500 to-pink-600',
      hoverColor: 'hover:from-red-600 hover:to-pink-700',
    },
    {
      name: 'GitHub',
      provider: 'github' as const,
      icon: Github,
      color: 'from-gray-700 to-gray-900',
      hoverColor: 'hover:from-gray-800 hover:to-black',
    },
    {
      name: 'Discord',
      provider: 'discord' as const,
      icon: DiscordIcon,
      color: 'from-indigo-500 to-purple-600',
      hoverColor: 'hover:from-indigo-600 hover:to-purple-700',
    },
  ];

  const handleProviderAuth = async (provider: 'discord' | 'github' | 'google') => {
    if (isLoading) return;
    
    try {
      console.log(`Attempting to sign in with ${provider}`);
      showToast(`Redirecting to ${provider}...`, 'info');
      
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: '/auth/callback',
        redirectUrlComplete: '/',
      });
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      showToast(`Error signing in with ${provider}. Please try again.`, 'error');
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-dark-600 text-gray-400 font-inter">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {providers.map((provider) => {
          const Icon = provider.icon;
          
          return (
            <motion.button
              key={provider.name}
              className={`
                w-full flex items-center justify-center px-4 py-3 rounded-xl
                bg-gradient-to-r ${provider.color} ${provider.hoverColor}
                text-white font-inter font-medium transition-all duration-200
                border border-white/10 backdrop-blur-sm
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleProviderAuth(provider.provider)}
              disabled={isLoading}
              data-testid={`${provider.provider}-auth-button`}
            >
              <Icon className="w-5 h-5 mr-3" />
              Continue with {provider.name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};