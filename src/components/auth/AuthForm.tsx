import React from 'react';
import { motion } from 'framer-motion';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onToggleMode: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onToggleMode }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-space font-bold text-white mb-2">
          {mode === 'signin' ? 'Welcome Back' : 'Join NeuroBeats'}
        </h1>
        <p className="text-gray-400 font-inter">
          {mode === 'signin' 
            ? 'Sign in to continue your musical journey' 
            : 'Create your account and discover amazing music'
          }
        </p>
      </motion.div>

      <div className="clerk-auth-container">
        {mode === 'signin' ? (
          <SignIn 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors",
                socialButtonsBlockButtonText: "text-white font-inter",
                dividerLine: "bg-white/20",
                dividerText: "text-gray-400 font-inter",
                formFieldLabel: "text-white font-inter font-medium",
                formFieldInput: "bg-dark-300/50 border border-white/10 text-white placeholder-gray-400 focus:border-neon-purple focus:ring-neon-purple/50 rounded-xl",
                formButtonPrimary: "bg-neon-gradient hover:opacity-90 text-white font-inter font-medium rounded-xl",
                footerActionLink: "text-neon-purple hover:text-neon-blue font-inter",
                footerActionText: "text-gray-400 font-inter",
                identityPreviewText: "text-white",
                identityPreviewEditButton: "text-neon-purple hover:text-neon-blue",
                formResendCodeLink: "text-neon-purple hover:text-neon-blue",
                otpCodeFieldInput: "bg-dark-300/50 border border-white/10 text-white focus:border-neon-purple rounded-lg",
                alertText: "text-red-400",
                formFieldErrorText: "text-red-400",
              },
              layout: {
                socialButtonsPlacement: "top",
                showOptionalFields: false,
              },
            }}
            redirectUrl="/"
            signUpUrl="#"
            afterSignInUrl="/"
            afterSignUpUrl="/"
          />
        ) : (
          <SignUp 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors",
                socialButtonsBlockButtonText: "text-white font-inter",
                dividerLine: "bg-white/20",
                dividerText: "text-gray-400 font-inter",
                formFieldLabel: "text-white font-inter font-medium",
                formFieldInput: "bg-dark-300/50 border border-white/10 text-white placeholder-gray-400 focus:border-neon-purple focus:ring-neon-purple/50 rounded-xl",
                formButtonPrimary: "bg-neon-gradient hover:opacity-90 text-white font-inter font-medium rounded-xl",
                footerActionLink: "text-neon-purple hover:text-neon-blue font-inter",
                footerActionText: "text-gray-400 font-inter",
                identityPreviewText: "text-white",
                identityPreviewEditButton: "text-neon-purple hover:text-neon-blue",
                formResendCodeLink: "text-neon-purple hover:text-neon-blue",
                otpCodeFieldInput: "bg-dark-300/50 border border-white/10 text-white focus:border-neon-purple rounded-lg",
                alertText: "text-red-400",
                formFieldErrorText: "text-red-400",
              },
              layout: {
                socialButtonsPlacement: "top",
                showOptionalFields: false,
              },
            }}
            redirectUrl="/"
            signInUrl="#"
            afterSignInUrl="/"
            afterSignUpUrl="/"
          />
        )}
      </div>

      {/* Toggle Mode */}
      <div className="mt-6 text-center">
        <p className="text-gray-400 font-inter">
          {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
        </p>
        <button
          onClick={onToggleMode}
          className="text-neon-purple hover:text-neon-blue transition-colors font-medium font-inter mt-1"
        >
          {mode === 'signin' ? 'Sign up' : 'Sign in'}
        </button>
      </div>
    </div>
  );
};