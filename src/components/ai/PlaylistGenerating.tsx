import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Music, 
  Brain, 
  Search, 
  CheckCircle,
  Loader2,
  Wand2,
  Zap
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

interface PlaylistGeneratingProps {
  progress: number;
  currentStep: string;
  className?: string;
}

const GENERATION_STEPS = [
  { 
    id: 'analyzing', 
    label: 'Analyzing Your Taste', 
    icon: Brain, 
    description: 'Understanding your music preferences',
    color: 'from-neon-purple to-neon-blue'
  },
  { 
    id: 'generating', 
    label: 'AI Magic in Progress', 
    icon: Wand2, 
    description: 'Creating personalized recommendations',
    color: 'from-neon-blue to-neon-cyan'
  },
  { 
    id: 'searching', 
    label: 'Finding Perfect Tracks', 
    icon: Search, 
    description: 'Matching AI suggestions with real songs',
    color: 'from-neon-cyan to-neon-green'
  },
  { 
    id: 'finalizing', 
    label: 'Finalizing Playlist', 
    icon: CheckCircle, 
    description: 'Putting the finishing touches',
    color: 'from-neon-green to-neon-pink'
  },
];

export const PlaylistGenerating: React.FC<PlaylistGeneratingProps> = ({
  progress,
  currentStep,
  className = '',
}) => {
  const getCurrentStepIndex = () => {
    if (progress < 10) return 0;
    if (progress < 20) return 1;
    if (progress < 80) return 2;
    return 3;
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-dark-500 via-dark-600 to-dark-700 flex items-center justify-center p-6 ${className}`}>
      <div className="w-full max-w-2xl">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard className="p-8 text-center">
            {/* Animated Icon */}
            <div className="relative mb-8">
              <motion.div
                className="w-24 h-24 bg-neon-gradient rounded-full flex items-center justify-center mx-auto"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                }}
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>
              
              {/* Floating particles */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-neon-gradient rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                  }}
                  animate={{
                    x: [0, Math.cos(i * 45 * Math.PI / 180) * 60],
                    y: [0, Math.sin(i * 45 * Math.PI / 180) * 60],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-space font-bold text-white mb-2">
              Creating Your Perfect Playlist
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Our AI is crafting something special just for you
            </p>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-600 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-neon-gradient rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Current Step */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center space-x-3 mb-2">
                <Loader2 className="w-5 h-5 text-neon-purple animate-spin" />
                <span className="text-white font-medium">{currentStep}</span>
              </div>
            </motion.div>

            {/* Steps Visualization */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {GENERATION_STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                
                return (
                  <motion.div
                    key={step.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isActive
                        ? 'border-neon-purple bg-neon-purple/20'
                        : isCompleted
                          ? 'border-neon-green bg-neon-green/20'
                          : 'border-white/20 bg-white/5'
                    }`}
                    animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-r ${step.color} rounded-lg flex items-center justify-center mb-2 mx-auto`}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : isActive ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        >
                          <Icon className="w-4 h-4 text-white" />
                        </motion.div>
                      ) : (
                        <Icon className="w-4 h-4 text-white opacity-50" />
                      )}
                    </div>
                    <h4 className={`font-semibold text-xs ${
                      isActive || isCompleted ? 'text-white' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </h4>
                    <p className={`text-xs mt-1 ${
                      isActive || isCompleted ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {step.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Fun Facts */}
            <motion.div
              className="mt-8 p-4 bg-white/5 rounded-xl"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="flex items-center justify-center space-x-2 text-neon-cyan">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Did you know? Our AI analyzes over 50 musical features to create your perfect playlist!
                </span>
              </div>
            </motion.div>
          </GlassCard>
        </motion.div>

        {/* Background Animation */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-neon-gradient rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};