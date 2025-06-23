import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Crown, 
  Zap, 
  Target, 
  Music, 
  Headphones, 
  Play,
  Heart,
  Share2,
  Users,
  Clock,
  Flame,
  Award,
  Medal,
  Gift,
  Sparkles,
  TrendingUp,
  Volume2
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';

// Interfaces para sistema de logros
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: 'listening' | 'discovery' | 'social' | 'creation' | 'exploration';
  difficulty: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  points: number;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  rarity: number; // 0-1, donde 1 es más raro
}

interface UserStats {
  totalListeningTime: number; // en minutos
  tracksPlayed: number;
  genresExplored: string[];
  playlistsCreated: number;
  songsLiked: number;
  friendsInvited: number;
  perfectStreaks: number;
  weeklyGoalsMet: number;
  level: number;
  experience: number;
  rank: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: Date;
}

// Sistema de logros y gamificación
class GamificationEngine {
  private static achievements: Achievement[] = [
    // Listening Achievements
    {
      id: 'first-listen',
      name: 'First Steps',
      description: 'Play your first track',
      icon: Play,
      category: 'listening',
      difficulty: 'bronze',
      points: 10,
      progress: 0,
      maxProgress: 1,
      unlocked: false,
      rarity: 0.1
    },
    {
      id: 'music-lover',
      name: 'Music Lover',
      description: 'Listen for 1 hour total',
      icon: Headphones,
      category: 'listening',
      difficulty: 'bronze',
      points: 50,
      progress: 0,
      maxProgress: 60,
      unlocked: false,
      rarity: 0.3
    },
    {
      id: 'marathon-listener',
      name: 'Marathon Listener',
      description: 'Listen for 10 hours total',
      icon: Clock,
      category: 'listening',
      difficulty: 'gold',
      points: 200,
      progress: 0,
      maxProgress: 600,
      unlocked: false,
      rarity: 0.7
    },
    {
      id: 'audiophile',
      name: 'Audiophile',
      description: 'Listen for 100 hours total',
      icon: Volume2,
      category: 'listening',
      difficulty: 'diamond',
      points: 1000,
      progress: 0,
      maxProgress: 6000,
      unlocked: false,
      rarity: 0.95
    },

    // Discovery Achievements
    {
      id: 'genre-explorer',
      name: 'Genre Explorer',
      description: 'Explore 5 different genres',
      icon: Target,
      category: 'discovery',
      difficulty: 'silver',
      points: 75,
      progress: 0,
      maxProgress: 5,
      unlocked: false,
      rarity: 0.4
    },
    {
      id: 'taste-maker',
      name: 'Taste Maker',
      description: 'Discover 50 new tracks',
      icon: Star,
      category: 'discovery',
      difficulty: 'gold',
      points: 300,
      progress: 0,
      maxProgress: 50,
      unlocked: false,
      rarity: 0.6
    },
    {
      id: 'music-connoisseur',
      name: 'Music Connoisseur',
      description: 'Explore all 15 genres',
      icon: Crown,
      category: 'discovery',
      difficulty: 'platinum',
      points: 500,
      progress: 0,
      maxProgress: 15,
      unlocked: false,
      rarity: 0.85
    },

    // Social Achievements
    {
      id: 'first-like',
      name: 'First Love',
      description: 'Like your first song',
      icon: Heart,
      category: 'social',
      difficulty: 'bronze',
      points: 15,
      progress: 0,
      maxProgress: 1,
      unlocked: false,
      rarity: 0.2
    },
    {
      id: 'curator',
      name: 'Curator',
      description: 'Like 100 songs',
      icon: Trophy,
      category: 'social',
      difficulty: 'gold',
      points: 250,
      progress: 0,
      maxProgress: 100,
      unlocked: false,
      rarity: 0.65
    },
    {
      id: 'social-butterfly',
      name: 'Social Butterfly',
      description: 'Share 10 tracks',
      icon: Share2,
      category: 'social',
      difficulty: 'silver',
      points: 100,
      progress: 0,
      maxProgress: 10,
      unlocked: false,
      rarity: 0.5
    },

    // Creation Achievements
    {
      id: 'ai-pioneer',
      name: 'AI Pioneer',
      description: 'Generate your first AI playlist',
      icon: Sparkles,
      category: 'creation',
      difficulty: 'silver',
      points: 100,
      progress: 0,
      maxProgress: 1,
      unlocked: false,
      rarity: 0.45
    },
    {
      id: 'composer',
      name: 'Digital Composer',
      description: 'Create a track with AI Composer',
      icon: Music,
      category: 'creation',
      difficulty: 'gold',
      points: 200,
      progress: 0,
      maxProgress: 1,
      unlocked: false,
      rarity: 0.75
    },

    // Special Achievements
    {
      id: 'streak-master',
      name: 'Streak Master',
      description: 'Listen daily for 7 days',
      icon: Flame,
      category: 'exploration',
      difficulty: 'platinum',
      points: 400,
      progress: 0,
      maxProgress: 7,
      unlocked: false,
      rarity: 0.8
    }
  ];

  static getUserStats(): UserStats {
    // Simular stats del usuario (en producción vendría de una base de datos)
    const saved = localStorage.getItem('neurobeats-stats');
    if (saved) {
      return JSON.parse(saved);
    }

    return {
      totalListeningTime: 0,
      tracksPlayed: 0,
      genresExplored: [],
      playlistsCreated: 0,
      songsLiked: 0,
      friendsInvited: 0,
      perfectStreaks: 0,
      weeklyGoalsMet: 0,
      level: 1,
      experience: 0,
      rank: 'Novice'
    };
  }

  static updateStats(newStats: Partial<UserStats>) {
    const current = this.getUserStats();
    const updated = { ...current, ...newStats };
    localStorage.setItem('neurobeats-stats', JSON.stringify(updated));
    return updated;
  }

  static getAchievements(): Achievement[] {
    const saved = localStorage.getItem('neurobeats-achievements');
    if (saved) {
      return JSON.parse(saved);
    }
    return [...this.achievements];
  }

  static updateAchievement(achievementId: string, progress: number): Achievement | null {
    const achievements = this.getAchievements();
    const achievement = achievements.find(a => a.id === achievementId);
    
    if (achievement && !achievement.unlocked) {
      achievement.progress = Math.min(progress, achievement.maxProgress);
      
      if (achievement.progress >= achievement.maxProgress) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
        
        // Agregar experiencia
        const stats = this.getUserStats();
        const newExperience = stats.experience + achievement.points;
        const newLevel = Math.floor(newExperience / 1000) + 1;
        
        this.updateStats({
          experience: newExperience,
          level: newLevel,
          rank: this.calculateRank(newLevel)
        });
      }
      
      localStorage.setItem('neurobeats-achievements', JSON.stringify(achievements));
      return achievement.unlocked ? achievement : null;
    }
    
    return null;
  }

  static calculateRank(level: number): string {
    if (level >= 50) return 'Legendary';
    if (level >= 25) return 'Master';
    if (level >= 15) return 'Expert';
    if (level >= 10) return 'Advanced';
    if (level >= 5) return 'Intermediate';
    return 'Novice';
  }

  static checkForNewAchievements(stats: UserStats): Achievement[] {
    const newlyUnlocked: Achievement[] = [];

    // Check listening achievements
    const listeningMinutes = stats.totalListeningTime;
    if (listeningMinutes >= 1) {
      const unlocked = this.updateAchievement('first-listen', 1);
      if (unlocked) newlyUnlocked.push(unlocked);
    }
    if (listeningMinutes >= 60) {
      const unlocked = this.updateAchievement('music-lover', listeningMinutes);
      if (unlocked) newlyUnlocked.push(unlocked);
    }

    // Check discovery achievements
    const unlocked = this.updateAchievement('genre-explorer', stats.genresExplored.length);
    if (unlocked) newlyUnlocked.push(unlocked);

    // Check social achievements
    if (stats.songsLiked >= 1) {
      const unlocked = this.updateAchievement('first-like', stats.songsLiked);
      if (unlocked) newlyUnlocked.push(unlocked);
    }

    return newlyUnlocked;
  }
}

export const AchievementSystem: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newUnlocks, setNewUnlocks] = useState<Achievement[]>([]);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  useEffect(() => {
    // Cargar datos iniciales
    setAchievements(GamificationEngine.getAchievements());
    setUserStats(GamificationEngine.getUserStats());

    // Simular eventos de logros
    const interval = setInterval(() => {
      const stats = GamificationEngine.getUserStats();
      
      // Simular progreso de listening time
      const newStats = GamificationEngine.updateStats({
        totalListeningTime: stats.totalListeningTime + Math.random() * 2,
        tracksPlayed: stats.tracksPlayed + (Math.random() > 0.8 ? 1 : 0)
      });

      const newUnlocked = GamificationEngine.checkForNewAchievements(newStats);
      if (newUnlocked.length > 0) {
        setNewUnlocks(newUnlocked);
        setShowUnlockModal(true);
      }

      setUserStats(newStats);
      setAchievements(GamificationEngine.getAchievements());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const categories = [
    { id: 'all', name: 'All', icon: Trophy },
    { id: 'listening', name: 'Listening', icon: Headphones },
    { id: 'discovery', name: 'Discovery', icon: Target },
    { id: 'social', name: 'Social', icon: Users },
    { id: 'creation', name: 'Creation', icon: Sparkles },
    { id: 'exploration', name: 'Exploration', icon: TrendingUp }
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const getDifficultyColor = (difficulty: Achievement['difficulty']) => {
    const colors = {
      bronze: 'from-amber-600 to-yellow-600',
      silver: 'from-gray-400 to-gray-600',
      gold: 'from-yellow-400 to-yellow-600',
      platinum: 'from-purple-400 to-purple-600',
      diamond: 'from-blue-400 to-cyan-500'
    };
    return colors[difficulty];
  };

  const getProgressColor = (progress: number, maxProgress: number) => {
    const percentage = (progress / maxProgress) * 100;
    if (percentage === 100) return 'from-green-500 to-emerald-500';
    if (percentage >= 75) return 'from-yellow-500 to-orange-500';
    if (percentage >= 50) return 'from-blue-500 to-indigo-500';
    return 'from-purple-500 to-pink-500';
  };

  if (!userStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Trophy className="w-6 h-6 text-white" />
          </motion.div>
          <p className="text-white">Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* User Stats Header */}
      <GlassCard className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className={`w-16 h-16 bg-gradient-to-r ${getDifficultyColor('gold')} rounded-full flex items-center justify-center mb-2`}>
                <Crown className="w-8 h-8 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">{userStats.level}</p>
              <p className="text-gray-400 text-sm">Level</p>
            </div>
            
            <div>
              <h2 className="text-2xl font-space font-bold text-white">{userStats.rank}</h2>
              <div className="flex items-center space-x-4 mt-2">
                <div className="text-center">
                  <p className="text-lg font-bold text-neon-purple">{userStats.experience.toLocaleString()}</p>
                  <p className="text-gray-400 text-xs">XP</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-neon-blue">{achievements.filter(a => a.unlocked).length}</p>
                  <p className="text-gray-400 text-xs">Unlocked</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-neon-green">{userStats.totalListeningTime.toFixed(0)}</p>
                  <p className="text-gray-400 text-xs">Minutes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress to next level */}
          <div className="text-right">
            <p className="text-white font-medium mb-2">Next Level Progress</p>
            <div className="w-40 bg-white/10 rounded-full h-3">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                style={{ width: `${(userStats.experience % 1000) / 10}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${(userStats.experience % 1000) / 10}%` }}
              />
            </div>
            <p className="text-gray-400 text-sm mt-1">
              {userStats.experience % 1000}/1000 XP
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Category Filter */}
      <GlassCard className="p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <motion.button
                key={category.id}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-neon-purple text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(category.id)}
              >
                <Icon className="w-4 h-4" />
                <span>{category.name}</span>
              </motion.button>
            );
          })}
        </div>
      </GlassCard>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement, index) => {
          const Icon = achievement.icon;
          const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard 
                className={`p-4 transition-all duration-300 ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30' 
                    : 'hover:bg-white/5'
                } ${achievement.rarity > 0.8 ? 'shadow-lg shadow-purple-500/20' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${getDifficultyColor(achievement.difficulty)} rounded-lg flex items-center justify-center ${
                    achievement.unlocked ? '' : 'opacity-50'
                  }`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {achievement.unlocked && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <Trophy className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                    {achievement.rarity > 0.8 && (
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                    )}
                  </div>
                </div>

                <h3 className={`font-bold text-lg mb-1 ${
                  achievement.unlocked ? 'text-white' : 'text-gray-300'
                }`}>
                  {achievement.name}
                </h3>
                
                <p className="text-gray-400 text-sm mb-3">
                  {achievement.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.maxProgress}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(achievement.progress, achievement.maxProgress)}`}
                      style={{ width: `${progressPercentage}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-medium">{achievement.points} XP</span>
                  </div>
                  
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    achievement.difficulty === 'bronze' ? 'bg-amber-600/20 text-amber-400' :
                    achievement.difficulty === 'silver' ? 'bg-gray-500/20 text-gray-400' :
                    achievement.difficulty === 'gold' ? 'bg-yellow-500/20 text-yellow-400' :
                    achievement.difficulty === 'platinum' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {achievement.difficulty}
                  </span>
                </div>

                {achievement.unlocked && achievement.unlockedAt && (
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <p className="text-gray-500 text-xs">
                      Unlocked {achievement.unlockedAt.toLocaleDateString()}
                    </p>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Achievement Unlock Modal */}
      <AnimatePresence>
        {showUnlockModal && newUnlocks.length > 0 && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-purple-900 to-pink-900 p-8 rounded-2xl border border-purple-500/30 max-w-md mx-4"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
            >
              <div className="text-center">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 0.5, repeat: Infinity, repeatType: "reverse" }
                  }}
                  className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Trophy className="w-10 h-10 text-white" />
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-2">Achievement Unlocked!</h2>
                
                {newUnlocks.map(achievement => {
                  const Icon = achievement.icon;
                  return (
                    <div key={achievement.id} className="mb-4">
                      <div className="flex items-center justify-center space-x-3 mb-2">
                        <div className={`w-8 h-8 bg-gradient-to-r ${getDifficultyColor(achievement.difficulty)} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white">{achievement.name}</h3>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{achievement.description}</p>
                      <p className="text-yellow-400 font-bold">+{achievement.points} XP</p>
                    </div>
                  );
                })}

                <NeonButton
                  variant="primary"
                  onClick={() => {
                    setShowUnlockModal(false);
                    setNewUnlocks([]);
                  }}
                  className="mt-4"
                >
                  <Gift className="w-5 h-5 mr-2" />
                  Awesome!
                </NeonButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};