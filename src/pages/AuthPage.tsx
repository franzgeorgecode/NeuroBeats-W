import React from 'react';
import { motion } from 'framer-motion';
import { Music, Waves, Zap } from 'lucide-react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { useSearchParams } from 'react-router-dom';
import { ParticleBackground } from '../components/ui/ParticleBackground';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'sign-in';

  return (
    <div className="min-h-screen bg-dark-600 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding */}
        <motion.div
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-neon-purple via-neon-blue to-neon-pink relative"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-black/20" />
          
          <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mb-8 mx-auto backdrop-blur-sm">
                <Music className="w-12 h-12 text-white" />
              </div>
              
              <h1 className="text-5xl font-space font-bold mb-6">
                NeuroBeats
              </h1>
              
              <p className="text-xl font-inter mb-12 max-w-md">
                Experience the future of music with AI-powered recommendations and immersive audio visualization
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: Waves, text: 'Immersive Audio Experience' },
                  { icon: Zap, text: 'AI-Powered Recommendations' },
                  { icon: Music, text: 'Unlimited Music Library' },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="flex items-center space-x-4"
                  >
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-lg font-inter">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Animated Elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full animate-float" />
          <div className="absolute bottom-32 left-16 w-24 h-24 bg-white/5 rounded-full animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 right-8 w-16 h-16 bg-white/15 rounded-full animate-float" style={{ animationDelay: '4s' }} />
        </motion.div>

        {/* Right Side - Auth Form */}
        <motion.div
          className="w-full lg:w-1/2 flex items-center justify-center p-8"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <div className="w-full max-w-md">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
              {mode === 'sign-up' ? (
                <div className="clerk-auth-container">
                  <SignUp 
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "bg-transparent shadow-none border-none",
                        headerTitle: "text-white font-space text-2xl font-bold",
                        headerSubtitle: "text-gray-400 font-inter",
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
                    signInUrl="/auth?mode=sign-in"
                  />
                </div>
              ) : (
                <div className="clerk-auth-container">
                  <SignIn 
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "bg-transparent shadow-none border-none",
                        headerTitle: "text-white font-space text-2xl font-bold",
                        headerSubtitle: "text-gray-400 font-inter",
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
                    signUpUrl="/auth?mode=sign-up"
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};