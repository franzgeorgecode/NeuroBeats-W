import React from 'react';
import { motion } from 'framer-motion';
import { 
  Music, 
  Guitar, 
  Mic, 
  Headphones, 
  Piano, 
  Drum,
  Radio,
  Heart,
  Zap,
  Star,
  Volume2,
  Disc,
  Waves,
  Sparkles,
  Crown
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

interface GenreSelectorProps {
  selectedGenres: string[];
  onGenreToggle: (genre: string) => void;
}

const GENRES = [
  { name: 'Pop', icon: Star, color: 'from-pink-500 to-rose-500', description: 'Catchy melodies and mainstream hits' },
  { name: 'Rock', icon: Guitar, color: 'from-red-500 to-orange-500', description: 'Electric guitars and powerful vocals' },
  { name: 'Hip Hop', icon: Mic, color: 'from-purple-500 to-indigo-500', description: 'Rhythmic beats and rap vocals' },
  { name: 'Electronic', icon: Zap, color: 'from-cyan-500 to-blue-500', description: 'Synthesized sounds and digital beats' },
  { name: 'Classical', icon: Piano, color: 'from-amber-500 to-yellow-500', description: 'Orchestral and instrumental masterpieces' },
  { name: 'Jazz', icon: Headphones, color: 'from-emerald-500 to-teal-500', description: 'Improvisation and smooth rhythms' },
  { name: 'Reggae', icon: Waves, color: 'from-green-500 to-lime-500', description: 'Laid-back Caribbean vibes' },
  { name: 'Country', icon: Crown, color: 'from-orange-500 to-red-500', description: 'Storytelling and acoustic guitars' },
  { name: 'R&B', icon: Heart, color: 'from-rose-500 to-pink-500', description: 'Soulful vocals and smooth grooves' },
  { name: 'Latin', icon: Drum, color: 'from-yellow-500 to-orange-500', description: 'Passionate rhythms and vibrant energy' },
  { name: 'Metal', icon: Volume2, color: 'from-gray-500 to-slate-500', description: 'Heavy guitars and intense energy' },
  { name: 'Indie', icon: Sparkles, color: 'from-violet-500 to-purple-500', description: 'Independent and alternative sounds' },
  { name: 'Folk', icon: Music, color: 'from-stone-500 to-neutral-500', description: 'Traditional and acoustic storytelling' },
  { name: 'Blues', icon: Disc, color: 'from-blue-500 to-indigo-500', description: 'Emotional expression and guitar solos' },
  { name: 'Soul', icon: Radio, color: 'from-indigo-500 to-purple-500', description: 'Deep emotion and powerful vocals' },
];

export const GenreSelector: React.FC<GenreSelectorProps> = ({
  selectedGenres,
  onGenreToggle,
}) => {
  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-4xl font-space font-bold text-white mb-4">
          Choose Your Favorite Genres
        </h2>
        <p className="text-xl text-gray-300 mb-2">
          Select at least 3 genres to personalize your music experience
        </p>
        <p className="text-lg text-neon-purple font-medium">
          {selectedGenres.length}/3 minimum selected
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto"
      >
        {GENRES.map((genre, index) => {
          const Icon = genre.icon;
          const isSelected = selectedGenres.includes(genre.name);
          
          return (
            <motion.div
              key={genre.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <GlassCard
                className={`
                  p-6 cursor-pointer transition-all duration-300 relative overflow-hidden
                  ${isSelected 
                    ? 'ring-2 ring-neon-purple shadow-neon bg-neon-gradient' 
                    : 'hover:ring-1 hover:ring-white/30'
                  }
                `}
                onClick={() => onGenreToggle(genre.name)}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-20`} />
                
                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="w-3 h-3 bg-neon-purple rounded-full"
                    />
                  </motion.div>
                )}
                
                <div className="relative z-10">
                  <div className={`w-12 h-12 bg-gradient-to-r ${genre.color} rounded-xl flex items-center justify-center mb-3 mx-auto`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-space font-semibold text-white mb-2">
                    {genre.name}
                  </h3>
                  
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {genre.description}
                  </p>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>

      {selectedGenres.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <div className="flex items-center justify-center space-x-2 text-neon-green">
            <Sparkles className="w-5 h-5" />
            <span className="font-inter font-medium">Great! You can now proceed to the next step</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};