import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Volume2,
  Shuffle,
  Repeat,
  Heart,
  MoreHorizontal
} from 'lucide-react';
import { usePlayerStore } from '../../stores/playerStore';
import { GlassCard } from '../ui/GlassCard';
import { MusicPlayer } from './MusicPlayer';

export const Player: React.FC = () => {
  const { currentTrack } = usePlayerStore();

  if (!currentTrack) return null;

  return <MusicPlayer />;
};