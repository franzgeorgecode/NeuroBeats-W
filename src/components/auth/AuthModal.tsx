import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { GlassCard } from '../ui/GlassCard';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  onToggleMode: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  mode,
  onToggleMode,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <GlassCard className="w-full max-w-md p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-space font-bold text-white">
                    {mode === 'signin' ? 'Welcome Back' : 'Join NeuroBeats'}
                  </h2>
                  <motion.button
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

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
                      afterSignInUrl="/"
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
                      afterSignUpUrl="/"
                    />
                  )}
                </div>

                <div className="mt-6 text-center">
                  <p className="text-gray-400">
                    {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
                  </p>
                  <button
                    onClick={onToggleMode}
                    className="text-neon-purple hover:text-neon-blue transition-colors font-medium"
                  >
                    {mode === 'signin' ? 'Sign up' : 'Sign in'}
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};