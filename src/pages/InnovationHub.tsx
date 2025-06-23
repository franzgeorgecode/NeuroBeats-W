import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Activity, 
  Users, 
  Trophy, 
  Music, 
  Zap, 
  Sparkles,
  Target,
  Heart,
  Gamepad2,
  Radio,
  Palette,
  Rocket,
  Star,
  Crown,
  Headphones
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { NeonButton } from '../components/ui/NeonButton';
import { AIComposer } from '../components/ai/AIComposer';
import { Audio3DVisualizer } from '../components/visualization/Audio3DVisualizer';
import { EmotionalAnalyzer } from '../components/ai/EmotionalAnalyzer';
import { AchievementSystem } from '../components/gamification/AchievementSystem';
import { LiveSession } from '../components/collaborative/LiveSession';

interface InnovationFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  category: 'ai' | 'social' | 'visual' | 'gaming';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isNew?: boolean;
  isPremium?: boolean;
  component: React.ComponentType<any>;
}

const innovationFeatures: InnovationFeature[] = [
  {
    id: 'ai-composer',
    title: 'AI Music Composer',
    description: 'Generate unique compositions using advanced AI algorithms in real-time',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    category: 'ai',
    difficulty: 'advanced',
    isNew: true,
    component: AIComposer
  },
  {
    id: '3d-visualizer',
    title: '3D Audio Visualizer',
    description: 'Immersive 3D audio visualization with interactive controls and real-time analysis',
    icon: Activity,
    color: 'from-blue-500 to-cyan-500',
    category: 'visual',
    difficulty: 'intermediate',
    isNew: true,
    component: Audio3DVisualizer
  },
  {
    id: 'emotional-ai',
    title: 'Emotional AI Analyzer',
    description: 'Real-time emotional analysis of music using advanced machine learning',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    category: 'ai',
    difficulty: 'advanced',
    isPremium: true,
    component: EmotionalAnalyzer
  },
  {
    id: 'live-sessions',
    title: 'Live Collaborative Sessions',
    description: 'Listen together with friends in real-time with synchronized playback',
    icon: Users,
    color: 'from-green-500 to-emerald-500',
    category: 'social',
    difficulty: 'beginner',
    isNew: true,
    component: LiveSession
  },
  {
    id: 'achievements',
    title: 'Gamification System',
    description: 'Unlock achievements, earn XP, and compete with friends in music challenges',
    icon: Trophy,
    color: 'from-yellow-500 to-orange-500',
    category: 'gaming',
    difficulty: 'beginner',
    component: AchievementSystem
  }
];

export const InnovationHub: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<InnovationFeature | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Features', icon: Sparkles },
    { id: 'ai', name: 'AI Powered', icon: Brain },
    { id: 'visual', name: 'Visualizations', icon: Palette },
    { id: 'social', name: 'Social', icon: Users },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2 }
  ];

  const filteredFeatures = selectedCategory === 'all' 
    ? innovationFeatures 
    : innovationFeatures.filter(f => f.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-600 to-dark-700 pt-24 pb-32">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.section
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Rocket className="w-10 h-10 text-white" />
            </motion.div>
            <div className="text-left">
              <h1 className="text-5xl font-space font-bold text-white mb-2">
                Innovation Hub
              </h1>
              <p className="text-xl text-gray-300">
                Next-generation music features powered by AI
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-8 text-white/80">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span>Real-time</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-blue-400" />
              <span>Cutting-edge</span>
            </div>
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-golden" />
              <span>Award-winning</span>
            </div>
          </div>
        </motion.section>

        {/* Category Filter */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GlassCard className="p-4">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map(category => {
                const Icon = category.icon;
                return (
                  <motion.button
                    key={category.id}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-neon-gradient text-white shadow-neon'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{category.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </GlassCard>
        </motion.section>

        {/* Features Grid */}
        {!selectedFeature && (
          <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassCard 
                      className="p-6 hover:bg-white/5 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                      onClick={() => setSelectedFeature(feature)}
                    >
                      {/* Background Animation */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                        initial={false}
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />

                      {/* Content */}
                      <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <Icon className="w-7 h-7 text-white" />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {feature.isNew && (
                              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">
                                NEW
                              </span>
                            )}
                            {feature.isPremium && (
                              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full">
                                PRO
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-xl font-space font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
                          {feature.title}
                        </h3>
                        
                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                          {feature.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(feature.difficulty)}`}>
                            {feature.difficulty}
                          </span>
                          
                          <NeonButton
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Explore
                          </NeonButton>
                        </div>
                      </div>

                      {/* Hover Effects */}
                      <motion.div
                        className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      />
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Feature Demo */}
        <AnimatePresence mode="wait">
          {selectedFeature && (
            <motion.section
              key={selectedFeature.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              {/* Feature Header */}
              <GlassCard className={`p-6 mb-6 bg-gradient-to-r ${selectedFeature.color}/10 border border-white/20`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${selectedFeature.color} rounded-xl flex items-center justify-center`}>
                      {React.createElement(selectedFeature.icon, { className: "w-8 h-8 text-white" })}
                    </div>
                    <div>
                      <h2 className="text-3xl font-space font-bold text-white">
                        {selectedFeature.title}
                      </h2>
                      <p className="text-gray-300">{selectedFeature.description}</p>
                    </div>
                  </div>

                  <NeonButton
                    variant="secondary"
                    onClick={() => setSelectedFeature(null)}
                  >
                    Back to Hub
                  </NeonButton>
                </div>
              </GlassCard>

              {/* Feature Component */}
              <GlassCard className="p-6">
                <selectedFeature.component />
              </GlassCard>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Call to Action */}
        {!selectedFeature && (
          <motion.section
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <GlassCard className="p-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-space font-bold text-white mb-4">
                  Experience the Future of Music
                </h2>
                <p className="text-gray-300 text-lg mb-6">
                  NeuroBeats combines cutting-edge AI, immersive visualizations, and social features 
                  to create the most advanced music platform ever built.
                </p>
                
                <div className="flex items-center justify-center space-x-4">
                  <NeonButton
                    variant="primary"
                    size="lg"
                    onClick={() => setSelectedFeature(innovationFeatures[0])}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Exploring
                  </NeonButton>
                  
                  <NeonButton
                    variant="secondary"
                    size="lg"
                  >
                    <Headphones className="w-5 h-5 mr-2" />
                    Watch Demo
                  </NeonButton>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 mt-8 pt-8 border-t border-white/10">
                  <div className="text-center">
                    <motion.p 
                      className="text-3xl font-bold text-neon-purple mb-2"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      5+
                    </motion.p>
                    <p className="text-gray-400">AI Features</p>
                  </div>
                  <div className="text-center">
                    <motion.p 
                      className="text-3xl font-bold text-neon-blue mb-2"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      3D
                    </motion.p>
                    <p className="text-gray-400">Visualizations</p>
                  </div>
                  <div className="text-center">
                    <motion.p 
                      className="text-3xl font-bold text-neon-green mb-2"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    >
                      Real-time
                    </motion.p>
                    <p className="text-gray-400">Collaboration</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.section>
        )}
      </div>
    </div>
  );
};