import React from 'react';
import { motion } from 'framer-motion';
import { Music, Waves, Zap, BrainCircuit, Sparkles, Cpu, Target, ArrowRight } from 'lucide-react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { useSearchParams } from 'react-router-dom';
import { ParticleBackground } from '../components/ui/ParticleBackground';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'sign-in';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <ParticleBackground />
      
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-white" />
        </svg>
      </div>
      
      <div className="relative z-10 min-h-screen flex">
        {/* Enhanced Left Side - Branding */}
        <motion.div
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 relative"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/10" />
          
          {/* Geometric shapes background */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-2xl rotate-12 animate-float" />
            <div className="absolute bottom-32 right-16 w-24 h-24 bg-gradient-to-r from-pink-400/20 to-purple-500/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-8 w-16 h-16 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-lg rotate-45 animate-float" style={{ animationDelay: '4s' }} />
            <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-xl animate-float" style={{ animationDelay: '6s' }} />
          </div>
          
          <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              {/* Enhanced Logo */}
              <motion.div
                className="relative w-32 h-32 mx-auto mb-8"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-full h-full bg-gradient-to-r from-white/20 to-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-2xl">
                  <BrainCircuit className="w-16 h-16 text-white" />
                </div>
                <motion.div
                  className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>
              </motion.div>
              
              {/* Enhanced Title */}
              <motion.h1 
                className="text-6xl font-space font-bold mb-4 bg-gradient-to-r from-white via-cyan-100 to-purple-100 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                NeuroBeats
              </motion.h1>
              
              {/* Subtle tagline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8"
              >
                <p className="text-lg text-white/90 mb-2 font-medium">
                  Advanced Neural Music Platform
                </p>
                <p className="text-sm text-white/70 max-w-md leading-relaxed">
                  Precision-engineered for the modern music enthusiast. 
                  Clean, powerful, intuitive.
                </p>
              </motion.div>
              
              {/* Refined Features */}
              <div className="space-y-4 max-w-sm">
                {[
                  { icon: BrainCircuit, text: 'Neural Processing', desc: 'Intelligent music analysis' },
                  { icon: Target, text: 'Precision Discovery', desc: 'Targeted recommendations' },
                  { icon: Cpu, text: 'High Performance', desc: 'Optimized experience' },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    className="group"
                  >
                    <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-all duration-300">
                      <div className="w-10 h-10 bg-gradient-to-r from-white/20 to-white/10 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-white font-medium text-sm">{feature.text}</div>
                        <div className="text-white/70 text-xs">{feature.desc}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Right Side - Auth Form */}
        <motion.div
          className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-gray-100"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <div className="w-full max-w-md">
            {/* Clean minimal container inspired by 21st.dev */}
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200/50"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4"
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.5 }}
                >
                  <Music className="w-6 h-6 text-white" />
                </motion.div>
                <h2 className="text-2xl font-space font-bold text-gray-900 mb-2">
                  {mode === 'sign-up' ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-gray-600 text-sm">
                  {mode === 'sign-up' 
                    ? 'Join the neural music revolution' 
                    : 'Access your personalized music experience'
                  }
                </p>
              </div>

              {mode === 'sign-up' ? (
                <div className="clerk-auth-container">
                  <SignUp 
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "bg-transparent shadow-none border-none",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors rounded-xl font-medium shadow-sm",
                        socialButtonsBlockButtonText: "text-gray-700 font-medium",
                        dividerLine: "bg-gray-200",
                        dividerText: "text-gray-500 text-sm",
                        formFieldLabel: "text-gray-700 font-medium text-sm",
                        formFieldInput: "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl transition-all",
                        formButtonPrimary: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300",
                        footerActionLink: "text-purple-600 hover:text-purple-700 font-medium transition-colors",
                        footerActionText: "text-gray-500",
                        identityPreviewText: "text-gray-700",
                        identityPreviewEditButton: "text-purple-600 hover:text-purple-700",
                        formResendCodeLink: "text-purple-600 hover:text-purple-700",
                        otpCodeFieldInput: "bg-gray-50 border border-gray-200 text-gray-900 focus:border-purple-500 rounded-lg",
                        alertText: "text-red-600",
                        formFieldErrorText: "text-red-600",
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
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors rounded-xl font-medium shadow-sm",
                        socialButtonsBlockButtonText: "text-gray-700 font-medium",
                        dividerLine: "bg-gray-200",
                        dividerText: "text-gray-500 text-sm",
                        formFieldLabel: "text-gray-700 font-medium text-sm",
                        formFieldInput: "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl transition-all",
                        formButtonPrimary: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300",
                        footerActionLink: "text-purple-600 hover:text-purple-700 font-medium transition-colors",
                        footerActionText: "text-gray-500",
                        identityPreviewText: "text-gray-700",
                        identityPreviewEditButton: "text-purple-600 hover:text-purple-700",
                        formResendCodeLink: "text-purple-600 hover:text-purple-700",
                        otpCodeFieldInput: "bg-gray-50 border border-gray-200 text-gray-900 focus:border-purple-500 rounded-lg",
                        alertText: "text-red-600",
                        formFieldErrorText: "text-red-600",
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
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};